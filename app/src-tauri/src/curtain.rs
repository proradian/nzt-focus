//! Занавес «Сейчас фокус» поверх окна с отвлекающим сайтом или приложением.
//! Закрывает окно целиком, кроме верхней полоски (вкладки и адрес браузера), чтобы можно было
//! переключиться на рабочую вкладку — тогда занавес исчезнет сам. Едет вместе с окном.

use std::sync::Mutex;

use tauri::{AppHandle, Manager, PhysicalPosition, PhysicalSize, WebviewUrl, WebviewWindowBuilder};
use windows_sys::Win32::Foundation::{HWND, RECT};
use windows_sys::Win32::UI::WindowsAndMessaging::{GetWindowRect, ShowWindow, SW_HIDE, SW_SHOWNOACTIVATE};

const LABEL: &str = "curtain";
/// Сколько сверху оставить открытым (логические пиксели): вкладки и адресная строка браузера.
const TOP_BROWSER: f64 = 86.0;
/// У обычных приложений — только заголовок окна, чтобы можно было свернуть или закрыть.
const TOP_APP: f64 = 40.0;

/// Где сейчас стоит занавес (физические пиксели), чтобы не двигать окно каждую секунду зря.
static LAST: Mutex<Option<(i32, i32, u32, u32)>> = Mutex::new(None);

fn scale_at(app: &AppHandle, x: i32, y: i32) -> f64 {
    app.available_monitors()
        .ok()
        .and_then(|ms| {
            ms.into_iter().find(|m| {
                let (p, s) = (m.position(), m.size());
                x >= p.x && x < p.x + s.width as i32 && y >= p.y && y < p.y + s.height as i32
            })
        })
        .map(|m| m.scale_factor())
        .unwrap_or(1.0)
}

/// Прямоугольник занавеса над окном over.
fn rect_over(app: &AppHandle, over: HWND, browser: bool) -> Option<(i32, i32, u32, u32)> {
    let mut r = RECT { left: 0, top: 0, right: 0, bottom: 0 };
    if unsafe { GetWindowRect(over, &mut r) } == 0 {
        return None;
    }
    let scale = scale_at(app, (r.left + r.right) / 2, (r.top + r.bottom) / 2);
    // Невидимые рамки окна в Windows 10/11 — около 7 пикселей по бокам и снизу.
    let border = (7.0 * scale) as i32;
    let top = ((if browser { TOP_BROWSER } else { TOP_APP }) * scale) as i32;
    let (x, y) = (r.left + border, r.top + top);
    let (w, h) = (r.right - r.left - 2 * border, r.bottom - r.top - top - border);
    (w > 100 && h > 100).then_some((x, y, w as u32, h as u32))
}

fn apply(w: &tauri::WebviewWindow, rect: (i32, i32, u32, u32)) {
    let mut last = LAST.lock().unwrap();
    if *last != Some(rect) {
        *last = Some(rect);
        let _ = w.set_size(PhysicalSize::new(rect.2, rect.3));
        let _ = w.set_position(PhysicalPosition::new(rect.0, rect.1));
    }
}

/// Показать занавес над окном over (или подвинуть, если оно сдвинулось).
/// kind — из фиксированного списка (guard::KINDS) или проверенный домен (guard::valid_host), его можно подставлять в JS.
pub fn show(app: &AppHandle, kind: &str, over: HWND, browser: bool) {
    let Some(rect) = rect_over(app, over, browser) else { return };
    if let Some(w) = app.get_webview_window(LABEL) {
        apply(&w, rect);
        let _ = w.eval(&format!("window.showCurtain && window.showCurtain('{kind}')"));
        // Без активации: клавиатура остаётся у окна, в котором человек был.
        if let Ok(hwnd) = w.hwnd() {
            unsafe { ShowWindow(hwnd.0 as _, SW_SHOWNOACTIVATE) };
        }
        return;
    }
    let url = WebviewUrl::App(format!("curtain.html?kind={kind}").into());
    let built = WebviewWindowBuilder::new(app, LABEL, url)
        .title("Focus")
        .decorations(false)
        .transparent(true)
        .shadow(false)
        .always_on_top(true)
        .skip_taskbar(true)
        .resizable(false)
        .focused(false)
        .visible(false)
        .additional_browser_args(crate::tta::BROWSER_ARGS)
        .build();
    if let Ok(w) = built {
        *LAST.lock().unwrap() = None;
        apply(&w, rect);
        if let Ok(hwnd) = w.hwnd() {
            unsafe { ShowWindow(hwnd.0 as _, SW_SHOWNOACTIVATE) };
        }
    }
}

/// Занавес уже висит — подтянуть его к окну, если окно сдвинули или поменяли размер.
pub fn follow(app: &AppHandle, over: HWND, browser: bool) {
    let (Some(w), Some(rect)) = (app.get_webview_window(LABEL), rect_over(app, over, browser)) else { return };
    apply(&w, rect);
}

/// Убрать занавес.
pub fn hide(app: &AppHandle) {
    hide_native(app, LABEL);
}

/// Спрятать окно напрямую через Windows. Занавес и плашку мы показываем так же (без активации),
/// и Tauri считает их скрытыми — его собственный hide() для них ничего бы не сделал.
pub fn hide_native(app: &AppHandle, label: &str) {
    if let Some(w) = app.get_webview_window(label) {
        if let Ok(hwnd) = w.hwnd() {
            unsafe { ShowWindow(hwnd.0 as _, SW_HIDE) };
        }
    }
}

/// Для плашки и занавеса: спрятать себя (вызывают их страницы).
#[tauri::command]
pub fn overlay_hide(app: AppHandle, label: String) {
    if label == "nudge" || label == LABEL {
        hide_native(&app, &label);
    }
}
