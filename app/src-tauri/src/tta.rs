//! Музыка: сайт Tabletop Audio в отдельном окне, с его собственным плеером.
//! Focus только собирает случайную очередь и ставит её на паузу / продолжает.
//! Удалённой странице не даётся доступ к командам Focus — мы лишь выполняем в ней свой JS.

use std::sync::atomic::{AtomicU64, AtomicU8, Ordering};

use tauri::{AppHandle, Emitter, Manager, WebviewUrl, WebviewWindowBuilder};

const LABEL: &str = "tta";
/// Номер текущего плавного перехода громкости: новый переход (пауза или продолжение) отменяет старый.
static FADE_GEN: AtomicU64 = AtomicU64::new(0);
/// Идёт ли сейчас переход: 0 — нет, 1 — нарастание, 2 — затухание перед паузой.
static FADING: AtomicU8 = AtomicU8::new(0);
/// Громкость, которую выбрал пользователь (биты f64). Переходы читают её на каждом шаге,
/// поэтому ползунок, сдвинутый во время перехода, не теряется.
static VOLUME: AtomicU64 = AtomicU64::new(0);
const FADE_MS: u64 = 2000;

fn set_volume(v: f64) -> f64 {
    let v = v.clamp(0.0, 1.0);
    VOLUME.store(v.to_bits(), Ordering::SeqCst);
    v
}

fn volume() -> f64 {
    f64::from_bits(VOLUME.load(Ordering::SeqCst))
}

/// Плавно меняет громкость плеера сайта за FADE_MS. Шаги задаются отсюда, а не таймером страницы:
/// в скрытом окне таймеры почти стоят, и затухание шло бы рывками.
/// pause = false — нарастание от тишины до громкости пользователя;
/// pause = true — затухание до тишины, пауза и возврат громкости пользователя для следующего запуска.
fn fade(w: tauri::WebviewWindow, pause: bool) {
    let gen = FADE_GEN.fetch_add(1, Ordering::SeqCst) + 1;
    FADING.store(if pause { 2 } else { 1 }, Ordering::SeqCst);
    let from = if pause { volume() } else { 0.0 };
    std::thread::spawn(move || {
        const STEPS: u64 = 25;
        for i in 1..=STEPS {
            std::thread::sleep(std::time::Duration::from_millis(FADE_MS / STEPS));
            if FADE_GEN.load(Ordering::SeqCst) != gen {
                return;
            }
            // Плавная кривая (косинус): без щелчка в начале и в конце.
            let t = i as f64 / STEPS as f64;
            let k = (1.0 - (t * std::f64::consts::PI).cos()) / 2.0;
            let to = if pause { 0.0 } else { volume() };
            let v = (from + (to - from) * k).clamp(0.0, 1.0);
            let _ = w.eval(&format!("window.__focus && window.__focus('volume', {v})"));
        }
        if pause {
            let _ = w.eval(&format!("window.__focus && (window.__focus('pause'), window.__focus('volume', {}))", volume()));
        }
        if FADE_GEN.load(Ordering::SeqCst) == gen {
            FADING.store(0, Ordering::SeqCst);
        }
    });
}
const URL: &str = "https://tabletopaudio.com/";
/// Должны совпадать с аргументами главного окна в tauri.conf.json: окна делят один движок WebView2.
/// Кроме звука без клика отключаем экономию скрытых окон: иначе через 5 минут таймеры невидимого
/// сайта срабатывают раз в минуту, и плеер переключает трек почти минуту.
pub const BROWSER_ARGS: &str = "--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection,IntensiveWakeUpThrottling,CalculateNativeWinOcclusion --autoplay-policy=no-user-gesture-required --disable-background-timer-throttling --disable-renderer-backgrounding --disable-backgrounding-occluded-windows";

/// Выполняется на каждой загрузке страницы сайта. Определяет помощник window.__focus.
/// autostart: сразу собрать очередь и играть (иначе сайт загружается заранее и молчит).
fn init_script(count: u32, calm: bool, volume: f64, autostart: bool) -> String {
    format!(
        r#"(() => {{
  const START = {{ count: {count}, calm: {calm}, volume: {volume}, autostart: {autostart} }};
  // Плавные переходы сайта крутят громкость таймером во втором плеере. В скрытом окне таймеры
  // почти стоят, и следующий трек играет беззвучно. Отключаем их через собственные настройки сайта.
  try {{ localStorage.setItem('ttaCrossfadeEnabled', 'false'); localStorage.setItem('ttaFadeEnabled', 'false'); }} catch (e) {{}}
  const ready = () => window.myPlaylist && window.SongList && window.useCaseTags && window.jQuery && window.jQuery('#jquery_jplayer_1').data('jPlayer');
  const jp = () => window.jQuery('#jquery_jplayer_1');
  const status = () => jp().data('jPlayer')?.status;
  // Должна ли музыка играть. Пауза снимает желание — тогда отложенные проверки запуска (ensure) молчат.
  let want = START.autostart;
  const shuffle = a => {{ for (let i = a.length - 1; i > 0; i--) {{ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }} return a; }};
  // Название трека передаём программе через заголовок страницы (другого канала у сайта нет).
  const report = () => {{
    const t = myPlaylist.playlist[myPlaylist.current]?.title;
    if (t) document.title = 'FOCUS_TRACK:' + t;
  }};
  // Запустить и, пока не заиграет, повторять. Первая попытка — сразу.
  const kick = start => {{
    clearInterval(window.__focusKick);
    start();
    let tries = 0;
    window.__focusKick = setInterval(() => {{
      const s = status();
      if ((s && !s.paused) || ++tries > 30) {{ clearInterval(window.__focusKick); report(); return; }}
      jp().jPlayer('play');
    }}, 500);
  }};
  const api = {{
    queue(count, calm, volume) {{
      const quiet = t => t.mood.includes('peaceful') && !t.mood.some(m => ['tension', 'dramatic', 'epic'].includes(m));
      // Голоса и толпа (таверна, рынок, город, праздник, битва) отвлекают как чужая речь — убираем всегда.
      const crowd = t => ['cities', 'public', 'slums'].some(c => (t.civ || []).includes(c)) || ['celebrate', 'war', 'skirmish', 'chase', 'monster', 'boss', 'ritual'].some(a => (t.action || []).includes(a));
      const VOICES = /tavern|inn\b|market|bazaar|festival|fair|carnival|circus|club|crowd|party|feast|arena|battle|war|siege|riot|court|council|throne|street|city|town|village|harbou?r|dock|port\b|station|parade|wedding|ball\b|school|academy|collegium|guild|camp|barracks|prison|jail|slum|plaza|square|stadium|casino|bar\b|pub\b/i;
      const ids = Object.keys(useCaseTags).filter(id => !crowd(useCaseTags[id]) && (!calm || quiet(useCaseTags[id])));
      const songs = shuffle(ids.map(id => SongList['song_' + id]).filter(s => s && s.mp3 && !VOICES.test(s.title)))
        .slice(0, count).map(s => ({{ title: s.title, artist: s.artist, mp3: s.mp3 }}));
      myPlaylist.setPlaylist(songs);
      want = true;
      jp().jPlayer('volume', volume);
      sessionStorage.setItem('focusQueued', '1');
      kick(() => myPlaylist.play(0));
    }},
    // Первый раз — собрать очередь, дальше — продолжить с того же места.
    playOrQueue(count, calm, volume) {{
      if (!sessionStorage.getItem('focusQueued') || !myPlaylist.playlist.length) return api.queue(count, calm, volume);
      want = true;
      jp().jPlayer('volume', volume);
      kick(() => jp().jPlayer('play'));
    }},
    pause() {{ want = false; clearInterval(window.__focusKick); myPlaylist.pause(); }},
    next() {{ want = true; myPlaylist.next(); report(); }},
    // Если трек стоит, а должен играть, — запускаем. Вызывается из Focus, а не по таймеру страницы.
    ensure() {{ const s = status(); if (want && s && s.paused) jp().jPlayer('play'); report(); }},
    volume(v) {{ jp().jPlayer('volume', v); }}
  }};
  // Команды, пришедшие до готовности плеера, ждут в очереди.
  const pending = [];
  window.__focus = (cmd, ...args) => ready() ? api[cmd](...args) : pending.push([cmd, args]);
  const boot = setInterval(() => {{
    if (!ready()) return;
    clearInterval(boot);
    // Новый трек начался (в том числе сам по окончании прошлого) — сообщаем название.
    jp().bind(jQuery.jPlayer.event.play, report);
    if (START.autostart && !sessionStorage.getItem('focusQueued')) api.queue(START.count, START.calm, START.volume);
    pending.splice(0).forEach(([c, a]) => api[c](...a));
  }}, 200);
}})();"#
    )
}

/// Создаёт невидимое окно сайта. Название трека приходит через заголовок страницы.
fn create(app: &AppHandle, count: u32, calm: bool, volume: f64, autostart: bool) -> Result<(), String> {
    let url = WebviewUrl::External(tauri::Url::parse(URL).map_err(|e| e.to_string())?);
    let handle = app.clone();
    let w = WebviewWindowBuilder::new(app, LABEL, url)
        .title("Tabletop Audio — музыка для Focus")
        .inner_size(1100.0, 760.0)
        .additional_browser_args(BROWSER_ARGS)
        .initialization_script(&init_script(count, calm, set_volume(volume), autostart))
        .on_document_title_changed(move |_, title| {
            if let Some(track) = title.strip_prefix("FOCUS_TRACK:") {
                let _ = handle.emit("tta-track", track.to_string());
            }
        })
        // Сайт играет невидимо: окно показывается только по кнопке «Сайт».
        .visible(false)
        .skip_taskbar(true)
        .build()
        .map_err(|e| e.to_string())?;
    // Крестик на окне сайта прячет его обратно, а не закрывает: музыка продолжает играть.
    let hidden = w.clone();
    w.on_window_event(move |event| {
        if let tauri::WindowEvent::CloseRequested { api, .. } = event {
            api.prevent_close();
            let _ = hidden.hide();
            let _ = hidden.set_skip_taskbar(true);
        }
    });
    Ok(())
}

/// Загрузить сайт заранее, без звука: тогда при старте блока музыка заиграет почти сразу.
#[tauri::command]
pub async fn tta_preload(app: AppHandle, count: u32, calm: bool, volume: f64) -> Result<(), String> {
    if app.get_webview_window(LABEL).is_some() {
        return Ok(());
    }
    create(&app, count, calm, volume, false)
}

/// Включить музыку: если сайт уже загружен — играть сразу, иначе открыть и начать.
/// Команда обязательно async: на Windows окно, созданное из синхронной команды, зависает пустым.
#[tauri::command]
pub async fn tta_play(app: AppHandle, count: u32, calm: bool, volume: f64) -> Result<bool, String> {
    let Some(w) = app.get_webview_window(LABEL) else {
        create(&app, count, calm, volume, true)?;
        return Ok(true);
    };
    // Начинаем с тишины и плавно выходим на нужную громкость.
    set_volume(volume);
    let _ = w.eval(&format!("window.__focus && window.__focus('playOrQueue', {count}, {calm}, 0)"));
    fade(w.clone(), false);
    // Таймеры скрытой страницы почти стоят, поэтому проверяем запуск отсюда.
    std::thread::spawn(move || {
        for ms in [700, 1500, 3000] {
            std::thread::sleep(std::time::Duration::from_millis(ms));
            let _ = w.eval("window.__focus && window.__focus('ensure')");
        }
    });
    Ok(false)
}

/// Команда плееру сайта: pause, next, shuffle (новая очередь), volume.
#[tauri::command]
pub fn tta_cmd(app: AppHandle, cmd: String, count: Option<u32>, calm: Option<bool>, volume: Option<f64>) {
    let Some(w) = app.get_webview_window(LABEL) else { return };
    let js = match cmd.as_str() {
        "pause" => {
            // Плавно затихаем, ставим на паузу и возвращаем громкость для следующего запуска.
            if let Some(v) = volume {
                set_volume(v);
            }
            fade(w.clone(), true);
            return;
        }
        "next" => {
            let _ = w.eval("window.__focus && window.__focus('next')");
            // Таймеры свёрнутой страницы почти стоят, поэтому проверяем запуск отсюда.
            let w = w.clone();
            std::thread::spawn(move || {
                for ms in [800, 1500, 3000] {
                    std::thread::sleep(std::time::Duration::from_millis(ms));
                    let _ = w.eval("window.__focus && window.__focus('ensure')");
                }
            });
            return;
        }
        "volume" => {
            let v = set_volume(volume.unwrap_or(0.5));
            // Во время перехода громкость выставит сам переход: он берёт новое значение на каждом шаге.
            if FADING.load(Ordering::SeqCst) != 0 {
                return;
            }
            format!("window.__focus && window.__focus('volume', {v})")
        }
        "shuffle" => format!(
            "window.__focus && window.__focus('queue', {}, {}, {})",
            count.unwrap_or(20),
            calm.unwrap_or(true),
            set_volume(volume.unwrap_or(0.5))
        ),
        _ => return,
    };
    let _ = w.eval(&js);
}

/// Показать окно сайта (выбрать трек вручную).
#[tauri::command]
pub fn tta_show(app: AppHandle) -> bool {
    match app.get_webview_window(LABEL) {
        Some(w) => {
            let _ = w.set_skip_taskbar(false);
            let _ = w.center();
            let _ = w.unminimize();
            let _ = w.show();
            let _ = w.set_focus();
            true
        }
        None => false,
    }
}

/// Закрыть окно сайта вместе с музыкой.
#[tauri::command]
pub fn tta_close(app: AppHandle) {
    if let Some(w) = app.get_webview_window(LABEL) {
        let _ = w.destroy();
    }
}
