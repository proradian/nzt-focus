//! Адрес активной вкладки браузера через UI Automation (механизм специальных возможностей Windows).
//! Заголовок окна часто не говорит, какой сайт открыт: у ВК это просто «Мессенджер» или «Новости».
//! Поэтому для браузеров читаем адресную строку и узнаём сайт по домену.

use std::cell::RefCell;

use windows::core::Interface;
use windows::Win32::System::Variant::VARIANT;
use windows::Win32::Foundation::HWND;
use windows::Win32::System::Com::{CoCreateInstance, CoInitializeEx, CLSCTX_INPROC_SERVER, COINIT_MULTITHREADED};
use windows::Win32::UI::Accessibility::{
    CUIAutomation, IUIAutomation, IUIAutomationElement, IUIAutomationValuePattern, TreeScope_Descendants,
    UIA_ControlTypePropertyId, UIA_DocumentControlTypeId, UIA_EditControlTypeId, UIA_ValuePatternId,
};

thread_local! {
    // Объект UI Automation создаётся один раз на поток (проверка идёт из одного фонового потока).
    static UIA: RefCell<Option<IUIAutomation>> = const { RefCell::new(None) };
}

fn automation() -> Option<IUIAutomation> {
    UIA.with(|cell| {
        if cell.borrow().is_none() {
            unsafe {
                let _ = CoInitializeEx(None, COINIT_MULTITHREADED);
                *cell.borrow_mut() = CoCreateInstance(&CUIAutomation, None, CLSCTX_INPROC_SERVER).ok();
            }
        }
        cell.borrow().clone()
    })
}

/// Текст адресной строки окна браузера (например, «vk.com/im»). None — если прочитать не вышло.
pub fn read(hwnd: *mut core::ffi::c_void) -> Option<String> {
    let uia = automation()?;
    unsafe {
        let window = uia.ElementFromHandle(HWND(hwnd)).ok()?;
        // Адресная строка — первое поле ввода в интерфейсе браузера (оно идёт раньше содержимого страницы).
        let edit = VARIANT::from(UIA_EditControlTypeId.0);
        let condition = uia.CreatePropertyCondition(UIA_ControlTypePropertyId, &edit).ok()?;
        let field = window.FindFirst(TreeScope_Descendants, &condition).ok()?;
        // Поле внутри страницы (поиск на сайте и т. п.) — не адресная строка: лучше не знать адрес,
        // чем принять чужой текст за домен.
        if inside_document(&uia, &field) {
            return None;
        }
        let pattern: IUIAutomationValuePattern = field.GetCurrentPattern(UIA_ValuePatternId).ok()?.cast().ok()?;
        let value = pattern.CurrentValue().ok()?.to_string();
        let value = value.trim().to_string();
        (!value.is_empty()).then_some(value)
    }
}

/// Лежит ли элемент внутри содержимого страницы (элемента «Документ»).
unsafe fn inside_document(uia: &IUIAutomation, el: &IUIAutomationElement) -> bool {
    let Ok(walker) = uia.ControlViewWalker() else { return false };
    let mut cur = walker.GetParentElement(el).ok();
    // Интерфейс браузера неглубокий; ограничение — на случай зацикленного дерева.
    for _ in 0..40 {
        let Some(p) = cur else { return false };
        if p.CurrentControlType().is_ok_and(|t| t == UIA_DocumentControlTypeId) {
            return true;
        }
        cur = walker.GetParentElement(&p).ok();
    }
    false
}

/// Домен из адреса: «https://m.vk.com/im?x» → «m.vk.com». Браузеры часто прячут «https://».
pub fn host(url: &str) -> Option<String> {
    let rest = url.split_once("://").map_or(url, |(_, r)| r);
    let host = rest.split(['/', '?', '#']).next()?.split('@').last()?.split(':').next()?;
    let host = host.trim().trim_start_matches("www.").to_lowercase();
    // Без точки — это не адрес, а поисковый запрос, набранный в строке.
    (host.contains('.') && !host.contains(' ')).then_some(host)
}

/// Домен d или его поддомен: «m.vk.com» под «vk.com», а «notvk.com» — нет.
pub fn under(host: &str, d: &str) -> bool {
    host == d || host.ends_with(&format!(".{d}"))
}

/// Какой отвлекающий сайт по домену (те же kind, что в guard::KINDS).
pub fn kind_of_host(host: &str) -> Option<&'static str> {
    let is = |d: &str| under(host, d);
    if is("youtube.com") || is("youtu.be") {
        Some("youtube")
    } else if is("vk.com") || is("vk.ru") || is("vkvideo.ru") || is("vk.me") {
        Some("vk")
    } else if is("instagram.com") {
        Some("instagram")
    } else if host == "web.telegram.org" || host == "web.telegram.me" {
        Some("telegram")
    } else if host.starts_with("music.yandex.") {
        Some("yandex")
    } else {
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hosts_and_kinds() {
        let k = |u: &str| host(u).as_deref().and_then(kind_of_host);
        assert_eq!(k("vk.com/im"), Some("vk"));
        assert_eq!(k("https://m.vk.com/feed"), Some("vk"));
        assert_eq!(k("vkvideo.ru/video-1_2"), Some("vk"));
        assert_eq!(k("www.youtube.com/watch?v=1"), Some("youtube"));
        assert_eq!(k("youtu.be/abc"), Some("youtube"));
        assert_eq!(k("instagram.com/explore"), Some("instagram"));
        assert_eq!(k("web.telegram.org/a/"), Some("telegram"));
        assert_eq!(k("music.yandex.ru/home"), Some("yandex"));
        // не путать с похожими доменами и поиском
        assert_eq!(k("vk.company.com"), None);
        assert_eq!(k("notvk.com"), None);
        assert_eq!(k("developers.google.com/youtube"), None);
        assert_eq!(k("telegram.org/apps"), None);
        assert_eq!(k("как пользоваться vk.com"), None);
        assert_eq!(k("github.com/tauri-apps"), None);
    }
}
