//! Защита фокуса: во время блока сворачивает отвлекающие сайты и Яндекс Музыку, если они стали активным окном.
//! Встроенные сайты можно выключить, свои — добавить по домену (настройки, команда set_sites).

use std::collections::HashSet;
use std::os::windows::process::CommandExt;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;
use std::time::{Duration, Instant};

use tauri::{AppHandle, Emitter, Manager};
use windows_sys::Win32::Foundation::{CloseHandle, HWND};
use windows_sys::Win32::System::Threading::{
    OpenProcess, QueryFullProcessImageNameW, PROCESS_NAME_WIN32, PROCESS_QUERY_LIMITED_INFORMATION,
};
use windows_sys::Win32::UI::WindowsAndMessaging::{
    GetForegroundWindow, GetWindowTextW, GetWindowThreadProcessId, ShowWindow, SW_MINIMIZE,
};

const CREATE_NO_WINDOW: u32 = 0x0800_0000;
const YANDEX_EXE: &str = "Яндекс Музыка.exe";
const STEAM_EXE: &str = "steam.exe";

static ACTIVE: AtomicBool = AtomicBool::new(false);
/// Встроенные сайты, которые прячутся во время фокуса.
pub const KINDS: [&str; 5] = ["youtube", "instagram", "vk", "telegram", "yandex"];
/// Браузеры: по заголовку их окна понятно, какой сайт открыт в активной вкладке.
const BROWSERS: [&str; 7] = ["chrome.exe", "msedge.exe", "firefox.exe", "browser.exe", "opera.exe", "brave.exe", "vivaldi.exe"];

/// Встроенные сайты, которые пользователь выключил, и его собственные домены.
static OFF: Mutex<Vec<String>> = Mutex::new(Vec::new());
static CUSTOM: Mutex<Vec<String>> = Mutex::new(Vec::new());

/// Свой сайт: домен из букв, цифр, точек и дефисов. Других символов нет —
/// поэтому домен, как и встроенный kind, можно подставлять в JS плашки и занавеса.
fn valid_host(h: &str) -> bool {
    h.len() <= 253
        && h.contains('.')
        && !h.starts_with(['.', '-'])
        && !h.ends_with(['.', '-'])
        && h.chars().all(|c| c.is_alphanumeric() || c == '.' || c == '-')
}

#[tauri::command]
pub fn set_sites(off: Vec<String>, custom: Vec<String>) {
    *OFF.lock().unwrap() = off.into_iter().filter(|k| KINDS.contains(&k.as_str())).collect();
    *CUSTOM.lock().unwrap() = custom.into_iter().map(|h| h.trim().to_lowercase()).filter(|h| valid_host(h)).take(200).collect();
}

fn is_allowed(kind: &str) -> bool {
    ALLOWED.lock().unwrap().as_ref().is_some_and(|a| a.contains(kind))
}

/// Что пользователь разрешил до конца текущего блока («нужно для работы»).
static ALLOWED: Mutex<Option<HashSet<String>>> = Mutex::new(None);

#[tauri::command]
pub fn set_guard(on: bool) {
    ACTIVE.store(on, Ordering::Relaxed);
}

/// Новый блок — разрешения прошлого блока сбрасываются.
/// Что уже свернули в этом блоке: каждый сайт сворачиваем один раз, дальше не мешаем.
static MINIMIZED: Mutex<Option<HashSet<String>>> = Mutex::new(None);


#[tauri::command]
pub fn reset_allowed() {
    *ALLOWED.lock().unwrap() = Some(HashSet::new());
    *MINIMIZED.lock().unwrap() = Some(HashSet::new());

}

#[tauri::command]
pub fn allow_distraction(kind: String) {
    // Принимаем только известные сайты: команду вызывают окна-занавесы и плашки.
    if KINDS.contains(&kind.as_str()) || CUSTOM.lock().unwrap().contains(&kind) {
        ALLOWED.lock().unwrap().get_or_insert_with(HashSet::new).insert(kind);
    }
}

/// Закрывает приложение Яндекс Музыки. Возвращает true, если оно было запущено.
#[tauri::command]
pub fn close_yandex_music() -> bool {
    std::process::Command::new("taskkill")
        .args(["/IM", YANDEX_EXE, "/F"])
        .creation_flags(CREATE_NO_WINDOW)
        .status()
        .map(|s| s.success())
        .unwrap_or(false)
}

/// Закрывает Steam вместе с его процессами (steamwebhelper, запущенные из него игры).
/// Возвращает true, если Steam был запущен.
#[tauri::command]
pub fn close_steam() -> bool {
    std::process::Command::new("taskkill")
        .args(["/IM", STEAM_EXE, "/F", "/T"])
        .creation_flags(CREATE_NO_WINDOW)
        .status()
        .map(|s| s.success())
        .unwrap_or(false)
}

fn window_title(hwnd: HWND) -> String {
    let mut buf = [0u16; 512];
    let n = unsafe { GetWindowTextW(hwnd, buf.as_mut_ptr(), buf.len() as i32) };
    String::from_utf16_lossy(&buf[..n.max(0) as usize])
}

fn process_path(pid: u32) -> String {
    unsafe {
        let h = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, 0, pid);
        if h.is_null() {
            return String::new();
        }
        let mut buf = [0u16; 1024];
        let mut len = buf.len() as u32;
        let ok = QueryFullProcessImageNameW(h, PROCESS_NAME_WIN32, buf.as_mut_ptr(), &mut len);
        CloseHandle(h);
        if ok == 0 {
            return String::new();
        }
        String::from_utf16_lossy(&buf[..len as usize])
    }
}

fn exe_name_is(path: &str, name: &str) -> bool {
    path.rsplit(['\\', '/']).next().is_some_and(|n| n.eq_ignore_ascii_case(name))
}

fn classify(title: &str, exe: &str) -> Option<&'static str> {
    let t = title.to_lowercase();
    let e = exe.to_lowercase();
    // Приложение Яндекс Музыки узнаём по exe.
    if e.contains("yandexmusic") || e.contains("яндекс музыка") {
        return Some("yandex");
    }
    // Остальное — только в браузере. У программ заголовок ничего не значит: редактор с файлом
    // youtube.md или папка «YouTube» в Проводнике — это работа. Приложение Telegram тоже не трогаем.
    if !is_browser(exe) {
        return None;
    }
    if t.contains("youtube") {
        return Some("youtube");
    }
    if t.contains("яндекс музыка") || t.contains("yandex music") {
        return Some("yandex");
    }
    if t.contains("instagram") {
        return Some("instagram");
    }
    if t.contains("вконтакте") || t.contains("vk видео") || t.contains("vk video") || t.ends_with("| vk") || t.contains("| vk -") || t.contains(" vk —") {
        return Some("vk");
    }
    if t.contains("telegram") {
        return Some("telegram");
    }
    None
}

fn is_browser(exe: &str) -> bool {
    BROWSERS.iter().any(|b| exe_name_is(exe, b))
}

/// Последний прочитанный адрес: окно, его заголовок, домен вкладки и когда прочитан.
/// Адресную строку перечитываем, когда сменилось окно или заголовок, и не реже раза в URL_TTL:
/// у двух вкладок заголовок бывает одинаковым («Новости»), а сайты разные.
static URL_CACHE: Mutex<Option<(usize, String, String, Instant)>> = Mutex::new(None);
const URL_TTL: Duration = Duration::from_secs(3);

/// Домен активной вкладки браузера. None — адрес прочитать не вышло (тогда смотрим на заголовок, как раньше).
fn host_by_url(hwnd: HWND, title: &str) -> Option<String> {
    let mut cache = URL_CACHE.lock().unwrap_or_else(|e| e.into_inner());
    if let Some((h, t, host, at)) = cache.as_ref() {
        if *h == hwnd as usize && t == title && at.elapsed() < URL_TTL {
            return Some(host.clone());
        }
    }
    let Some(host) = crate::urlbar::read(hwnd).and_then(|u| crate::urlbar::host(&u)) else {
        *cache = None;
        return None;
    };
    *cache = Some((hwnd as usize, title.to_string(), host.clone(), Instant::now()));
    Some(host)
}

/// Сайт по домену: встроенный (если не выключен) или свой. Свой называется своим доменом.
fn site_of_host(host: &str, off: &[String], custom: &[String]) -> Option<String> {
    if let Some(k) = crate::urlbar::kind_of_host(host) {
        if !off.iter().any(|o| o == k) {
            return Some(k.to_string());
        }
    }
    custom.iter().find(|d| crate::urlbar::under(host, d)).cloned()
}

/// Свой сайт по заголовку окна, когда адрес не прочитался: домен целиком или «twitch» из twitch.tv
/// отдельным словом. Имя короче 4 букв не ищем: «x» из x.com нашлось бы почти в любом заголовке.
fn custom_by_title(title: &str, custom: &[String]) -> Option<String> {
    let t = title.to_lowercase();
    let words: Vec<&str> = t
        .split(|c: char| !(c.is_alphanumeric() || c == '.' || c == '-'))
        .map(|w| w.trim_matches(['.', '-']))
        .collect();
    custom
        .iter()
        .find(|d| {
            let labels: Vec<&str> = d.split('.').collect();
            let name = labels[labels.len().saturating_sub(2)];
            words.iter().any(|w| w == d) || (name.chars().count() >= 4 && words.iter().any(|w| *w == name))
        })
        .cloned()
}

/// Сайт в активном окне с учётом настроек.
fn site_now(hwnd: HWND, title: &str, exe: &str, browser: bool) -> Option<String> {
    let off = OFF.lock().unwrap().clone();
    let custom = CUSTOM.lock().unwrap().clone();
    // В браузере главное — адрес вкладки: у ВК заголовок обычно просто «Мессенджер» или «Новости».
    if browser {
        if let Some(host) = host_by_url(hwnd, title) {
            return site_of_host(&host, &off, &custom);
        }
    }
    if let Some(k) = classify(title, exe) {
        if !off.iter().any(|o| o == k) {
            return Some(k.to_string());
        }
    }
    if browser { custom_by_title(title, &custom) } else { None }
}

/// Какой сайт сейчас на экране с плашкой «Сейчас фокус» (плашка висит, пока он активен).
static STICKY: Mutex<Option<String>> = Mutex::new(None);

/// Убрать висящую плашку, если она показана.
fn clear_sticky(app: &AppHandle) {
    if STICKY.lock().unwrap().take().is_some() {
        crate::curtain::hide(app);
    }
}

fn is_main_window(app: &AppHandle, hwnd: HWND) -> bool {
    app.get_webview_window("main")
        .and_then(|w| w.hwnd().ok())
        .is_some_and(|h| h.0 as usize == hwnd as usize)
}

/// Вызывается раз в секунду из фонового потока.
pub fn check(app: &AppHandle) {
    if !ACTIVE.load(Ordering::Relaxed) {
        clear_sticky(app);
        return;
    }
    let hwnd = unsafe { GetForegroundWindow() };
    if hwnd.is_null() {
        // Активного окна нет (например, всё свёрнуто) — занавес не нужен.
        clear_sticky(app);
        return;
    }
    let mut pid = 0u32;
    unsafe { GetWindowThreadProcessId(hwnd, &mut pid) };
    // Своё окно. Плашку и занавес не трогаем: человек мог нажать «Нужно для работы».
    // Перешли в главное окно Focus — занавес над браузером больше не нужен.
    if pid == std::process::id() {
        if is_main_window(app, hwnd) {
            clear_sticky(app);
        }
        return;
    }
    let exe = process_path(pid);
    let title = window_title(hwnd);
    let browser = is_browser(&exe);
    let kind = site_now(hwnd, &title, &exe, browser).filter(|k| !is_allowed(k));
    let Some(kind) = kind else {
        clear_sticky(app);
        return;
    };
    // Первый раз за блок окно сворачиваем и коротко показываем плашку.
    let first = MINIMIZED.lock().unwrap().get_or_insert_with(HashSet::new).insert(kind.clone());
    if first {
        unsafe { ShowWindow(hwnd, SW_MINIMIZE) };
        let _ = app.emit("distraction", &kind);
        crate::nudge::show(app, &kind, false, hwnd);
        return;
    }
    // Развернули обратно: окно не сворачиваем, а закрываем занавесом, пока оно на экране.
    let mut sticky = STICKY.lock().unwrap();
    if sticky.as_deref() != Some(kind.as_str()) {
        let _ = app.emit("distraction-again", &kind);
        crate::curtain::show(app, &kind, hwnd, browser);
        *sticky = Some(kind);
    } else {
        crate::curtain::follow(app, hwnd, browser);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn v(xs: &[&str]) -> Vec<String> {
        xs.iter().map(|x| x.to_string()).collect()
    }

    #[test]
    fn own_sites() {
        let custom = v(&["twitch.tv", "x.com", "кино.рф"]);
        assert_eq!(site_of_host("m.twitch.tv", &[], &custom).as_deref(), Some("twitch.tv"));
        assert_eq!(site_of_host("кино.рф", &[], &custom).as_deref(), Some("кино.рф"));
        assert_eq!(site_of_host("nottwitch.tv", &[], &custom), None);
        assert_eq!(site_of_host("vk.com", &[], &custom).as_deref(), Some("vk"));
        // выключенный встроенный сайт не ловится, но свой домен на его месте — ловится
        assert_eq!(site_of_host("vk.com", &v(&["vk"]), &custom), None);
        assert_eq!(site_of_host("music.yandex.com", &v(&["yandex"]), &v(&["music.yandex.com"])).as_deref(), Some("music.yandex.com"));

        assert_eq!(custom_by_title("Стрим - Twitch - Google Chrome", &custom).as_deref(), Some("twitch.tv"));
        assert_eq!(custom_by_title("Новости x.com - Google Chrome", &custom).as_deref(), Some("x.com"));
        assert_eq!(custom_by_title("Max — отчёт.docx", &custom), None);
        assert_eq!(custom_by_title("twitchy - Поиск в Google", &custom), None);
    }

    #[test]
    fn titles_only_in_browsers() {
        let chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe";
        let code = r"C:\Users\u\AppData\Local\Programs\Microsoft VS Code\Code.exe";
        assert_eq!(classify("Котики - YouTube - Google Chrome", chrome), Some("youtube"));
        assert_eq!(classify("youtube.md - Focus - Visual Studio Code", code), None);
        assert_eq!(classify("Яндекс Музыка", r"C:\Users\u\AppData\Local\Programs\YandexMusic\Яндекс Музыка.exe"), Some("yandex"));
        assert_eq!(classify("Яндекс Музыка — заметки.txt - Блокнот", r"C:\Windows\notepad.exe"), None);
    }

    #[test]
    fn hosts_are_safe() {
        assert!(valid_host("twitch.tv"));
        assert!(valid_host("кино.рф"));
        assert!(!valid_host("twitch"));
        assert!(!valid_host("a.com');alert(1);//"));
        assert!(!valid_host(".com"));
        assert!(!valid_host("a b.com"));
    }
}
