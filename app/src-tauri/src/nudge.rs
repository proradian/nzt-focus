//! Плашка поверх экрана: «Сейчас фокус · ВКонтакте подождёт до конца блока».
//! Небольшое окно сверху по центру, поверх всех окон. Окно, в котором человек работает,
//! на себя не перехватывает и через несколько секунд прячется само (это делает nudge.html).

use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};
use tauri::{PhysicalPosition, PhysicalSize};
use windows_sys::Win32::Foundation::{HWND, RECT};
use windows_sys::Win32::UI::WindowsAndMessaging::{GetWindowRect, ShowWindow, SW_SHOWNOACTIVATE};

const LABEL: &str = "nudge";
const WIDTH: f64 = 480.0;
const HEIGHT: f64 = 96.0;

/// Куда поставить плашку: сверху по центру того монитора, где открыто окно с сайтом
/// (у человека может быть несколько мониторов). Возвращает позицию и размер в физических пикселях.
fn place(app: &AppHandle, over: HWND) -> Option<(PhysicalPosition<i32>, PhysicalSize<u32>)> {
    let mut r = RECT { left: 0, top: 0, right: 0, bottom: 0 };
    let (cx, cy) = if unsafe { GetWindowRect(over, &mut r) } != 0 {
        ((r.left + r.right) / 2, (r.top + r.bottom) / 2)
    } else {
        (0, 0)
    };
    let monitors = app.available_monitors().ok()?;
    let m = monitors
        .iter()
        .find(|m| {
            let (p, s) = (m.position(), m.size());
            cx >= p.x && cx < p.x + s.width as i32 && cy >= p.y && cy < p.y + s.height as i32
        })
        .or_else(|| monitors.first())?;
    let scale = m.scale_factor();
    let (w, h) = ((WIDTH * scale) as u32, (HEIGHT * scale) as u32);
    let x = m.position().x + (m.size().width as i32 - w as i32) / 2;
    let y = m.position().y + (28.0 * scale) as i32;
    Some((PhysicalPosition::new(x, y), PhysicalSize::new(w, h)))
}

/// sticky: висеть, пока окно с сайтом на экране (иначе спрятаться через 6 секунд).
/// over — окно с сайтом: плашка появится на его мониторе.
pub fn show(app: &AppHandle, kind: &str, sticky: bool, over: HWND) {
    let spot = place(app, over);
    // kind — из фиксированного списка (guard::KINDS) или проверенный домен (guard::valid_host), поэтому его можно подставлять в JS.
    if let Some(w) = app.get_webview_window(LABEL) {
        if let Some((pos, size)) = spot {
            let _ = w.set_size(size);
            let _ = w.set_position(pos);
        }
        let _ = w.eval(&format!("window.showNudge && window.showNudge('{kind}', {sticky})"));
        // Показываем без активации: фокус остаётся в окне, где человек работал.
        if let Ok(hwnd) = w.hwnd() {
            unsafe { ShowWindow(hwnd.0 as _, SW_SHOWNOACTIVATE) };
        }
        return;
    }
    let url = WebviewUrl::App(format!("nudge.html?kind={kind}&sticky={sticky}").into());
    let builder = WebviewWindowBuilder::new(app, LABEL, url)
        .title("Focus")
        .inner_size(WIDTH, HEIGHT)
        .decorations(false)
        .transparent(true)
        .shadow(false)
        .always_on_top(true)
        .skip_taskbar(true)
        .resizable(false)
        .focused(false)
        .additional_browser_args(crate::tta::BROWSER_ARGS);
    if let Ok(w) = builder.visible(false).build() {
        if let Some((pos, size)) = spot {
            let _ = w.set_size(size);
            let _ = w.set_position(pos);
        }
        if let Ok(hwnd) = w.hwnd() {
            unsafe { ShowWindow(hwnd.0 as _, SW_SHOWNOACTIVATE) };
        }
    }
}
