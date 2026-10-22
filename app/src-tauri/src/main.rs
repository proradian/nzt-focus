#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod curtain;
mod guard;
mod nudge;
mod meter;
mod tta;
mod urlbar;

use std::{fs, io::Write, path::PathBuf};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager,
};

fn show_main(app: &AppHandle) {
    if let Some(w) = app.get_webview_window("main") {
        let _ = w.show();
        let _ = w.unminimize();
        let _ = w.set_focus();
    }
}

/// Текст подсказки у иконки в трее (оставшееся время и фаза).
#[tauri::command]
fn set_tray_text(app: AppHandle, text: String) {
    if let Some(tray) = app.tray_by_id("main") {
        let _ = tray.set_tooltip(Some(text));
    }
}

/// Пункты меню трея — чтобы переводить их при смене языка интерфейса.
struct TrayMenu {
    open: MenuItem<tauri::Wry>,
    quit: MenuItem<tauri::Wry>,
}

/// Язык меню трея: тексты приходят из интерфейса уже переведёнными.
#[tauri::command]
fn set_tray_lang(menu: tauri::State<TrayMenu>, open: String, quit: String) {
    let _ = menu.open.set_text(open);
    let _ = menu.quit.set_text(quit);
}

/// Красит заголовок окна в цвета темы (Windows 11; на Windows 10 просто ничего не меняется).
/// Цвета — "#rrggbb": фон полосы и текст заголовка.
#[tauri::command]
fn set_titlebar(window: tauri::WebviewWindow, bg: String, text: String) {
    use windows_sys::Win32::Graphics::Dwm::{
        DwmSetWindowAttribute, DWMWA_BORDER_COLOR, DWMWA_CAPTION_COLOR, DWMWA_TEXT_COLOR,
    };
    // COLORREF хранит цвет как 0x00BBGGRR.
    let colorref = |hex: &str| -> Option<u32> {
        let v = u32::from_str_radix(hex.trim_start_matches('#'), 16).ok()?;
        Some(((v & 0xff) << 16) | (v & 0xff00) | ((v >> 16) & 0xff))
    };
    let (Some(bg), Some(text), Ok(hwnd)) = (colorref(&bg), colorref(&text), window.hwnd()) else { return };
    for (attr, color) in [(DWMWA_CAPTION_COLOR, bg), (DWMWA_BORDER_COLOR, bg), (DWMWA_TEXT_COLOR, text)] {
        unsafe {
            DwmSetWindowAttribute(hwnd.0 as _, attr as u32, &color as *const u32 as _, std::mem::size_of::<u32>() as u32);
        }
    }
}

/// Файл с данными в %APPDATA%\app.focus.timer\. Ключ — только безопасные символы.
fn store_path(app: &AppHandle, key: &str) -> Option<PathBuf> {
    let ok = !key.is_empty()
        && key.chars().all(|c| c.is_ascii_alphanumeric() || c == '.' || c == '_' || c == '-');
    if !ok {
        return None;
    }
    let dir = app.path().app_data_dir().ok()?;
    fs::create_dir_all(&dir).ok()?;
    Some(dir.join(format!("{key}.json")))
}

#[tauri::command]
fn store_get(app: AppHandle, key: String) -> Option<String> {
    fs::read_to_string(store_path(&app, &key)?).ok()
}

/// Пишем сразу на диск через временный файл: выключение компьютера не оставит полузаписанный JSON.
#[tauri::command]
fn store_set(app: AppHandle, key: String, value: String) -> Result<(), String> {
    let path = store_path(&app, &key).ok_or("bad key")?;
    let tmp = path.with_extension("json.tmp");
    let mut f = fs::File::create(&tmp).map_err(|e| e.to_string())?;
    f.write_all(value.as_bytes()).map_err(|e| e.to_string())?;
    f.sync_all().map_err(|e| e.to_string())?;
    drop(f);
    fs::rename(&tmp, &path).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        // Повторный запуск с панели задач открывает уже работающее окно.
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| show_main(app)))
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            let open = MenuItem::with_id(app, "open", "Открыть NZT Focus", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "Выйти", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&open, &quit])?;
            app.manage(TrayMenu { open: open.clone(), quit: quit.clone() });

            TrayIconBuilder::with_id("main")
                .icon(app.default_window_icon().unwrap().clone())
                .tooltip("NZT Focus")
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "open" => show_main(app),
                    "quit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        show_main(tray.app_handle());
                    }
                })
                .build(app)?;

            // Раз в секунду будим интерфейс: в свёрнутом окне таймеры JS могут засыпать на минуту.
            let handle = app.handle().clone();
            std::thread::spawn(move || loop {
                std::thread::sleep(std::time::Duration::from_secs(1));
                let _ = handle.emit("tick", ());
                guard::check(&handle);
            });


            // Главное окно закрыли — выходим целиком: скрытые окна (музыка, плашка) не должны держать программу.
            if let Some(main) = app.get_webview_window("main") {
                let handle = app.handle().clone();
                main.on_window_event(move |event| {
                    if let tauri::WindowEvent::Destroyed = event {
                        handle.exit(0);
                    }
                });
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            set_tray_text,
            set_tray_lang,
            set_titlebar,
            store_get,
            store_set,
            tta::tta_play,
            tta::tta_preload,
            tta::tta_cmd,
            tta::tta_show,
            tta::tta_close,
            meter::audio_meter,
            guard::set_guard,
            guard::reset_allowed,
            guard::allow_distraction,
            guard::close_yandex_music,
            guard::set_sites,
            curtain::overlay_hide
        ])
        .run(tauri::generate_context!())
        .expect("не удалось запустить Focus");
}
