//! Громкость того, что сейчас звучит в Windows (WASAPI loopback), для живого фона.
//! Звук никуда не пишется и не передаётся: считаем только уровень, 20 раз в секунду.

use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::time::Duration;

use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use tauri::{AppHandle, Emitter};

/// Нужно ли сейчас измерение.
static WANT: AtomicBool = AtomicBool::new(false);
/// Номер запуска: поток работает, пока номер не сменился. Выключение и новый запуск меняют номер,
/// поэтому старый поток не продолжит работу, даже если его включили обратно, пока он спал.
static GEN: AtomicU64 = AtomicU64::new(0);
/// Захват звука держит только один поток: новый ждёт, пока завершится прежний.
static STREAM: Mutex<()> = Mutex::new(());

#[derive(Default)]
struct Acc {
    sum: f64, // сумма квадратов всех сэмплов
    n: u64,
}

fn feed(acc: &Mutex<Acc>, data: impl Iterator<Item = f32>) {
    let Ok(mut a) = acc.lock() else { return };
    for s in data {
        a.sum += (s * s) as f64;
        a.n += 1;
    }
}

fn run(app: AppHandle, gen: u64) -> Result<(), String> {
    let host = cpal::default_host();
    let dev = host.default_output_device().ok_or("нет устройства вывода")?;
    let cfg = dev.default_output_config().map_err(|e| e.to_string())?;
    let acc = Arc::new(Mutex::new(Acc::default()));
    let err = |e| eprintln!("audio meter: {e}");

    // На WASAPI входной поток на устройстве вывода — это и есть loopback.
    let a = acc.clone();
    let stream = match cfg.sample_format() {
        cpal::SampleFormat::F32 => dev.build_input_stream(
            &cfg.clone().into(), move |d: &[f32], _: &_| feed(&a, d.iter().copied()), err, None),
        cpal::SampleFormat::I16 => dev.build_input_stream(
            &cfg.clone().into(), move |d: &[i16], _: &_| feed(&a, d.iter().map(|&s| s as f32 / 32768.0)), err, None),
        f => return Err(format!("формат {f:?} не поддержан")),
    }
    .map_err(|e| e.to_string())?;
    stream.play().map_err(|e| e.to_string())?;

    while GEN.load(Ordering::SeqCst) == gen {
        std::thread::sleep(Duration::from_millis(50));
        let level = {
            let Ok(mut a) = acc.lock() else { break };
            let r = (a.sum / a.n.max(1) as f64).sqrt();
            a.sum = 0.0; a.n = 0;
            r
        };
        let _ = app.emit("audio_level", level as f32);
    }
    drop(stream);
    Ok(())
}

/// Включить или выключить измерение. Пока выключено, звук не захватывается вовсе.
#[tauri::command]
pub fn audio_meter(app: AppHandle, on: bool) {
    if !on {
        if WANT.swap(false, Ordering::SeqCst) {
            GEN.fetch_add(1, Ordering::SeqCst);
        }
        return;
    }
    if WANT.swap(true, Ordering::SeqCst) {
        return;
    }
    let gen = GEN.fetch_add(1, Ordering::SeqCst) + 1;
    std::thread::spawn(move || {
        let _one = STREAM.lock().unwrap_or_else(|e| e.into_inner());
        if GEN.load(Ordering::SeqCst) != gen {
            return; // пока ждали прежний поток, измерение уже выключили
        }
        if let Err(e) = run(app, gen) {
            eprintln!("audio meter: {e}");
        }
        // Не вышло запустить (нет устройства) — следующее включение попробует снова.
        if GEN.load(Ordering::SeqCst) == gen {
            WANT.store(false, Ordering::SeqCst);
        }
    });
}
