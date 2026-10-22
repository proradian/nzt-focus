'use strict';

// ---------- Хранилище ----------
const K_SET = 'focus.settings.v2', K_HIST = 'focus.history.v2', K_STATE = 'focus.state.v2';
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const write = (k, v) => {
  const s = JSON.stringify(v);
  try { localStorage.setItem(k, s); } catch {}
  // Главная копия — файл на диске: кэш браузерного движка может не успеть записаться при выключении.
  window.__TAURI__?.core?.invoke('store_set', { key: k, value: s }).catch(() => {});
};

const DEFAULTS = {
  dur: '60', customMin: 60, breakMin: 10, longEvery: 3, longMin: 25, capMin: 90,
  micro: true, sound: true, notify: true, popup: true, extraMin: 5, lastTask: '', onTop: true,
  soundMode: 'entry', musicCalm: true, musicVol: 30, guard: true, closeYandex: true, theme: 'indigo'
};
const settings = { ...DEFAULTS, ...read(K_SET, {}) };
// С этой версии «поверх всех окон» включено по умолчанию — включаем его и тем, у кого было выключено.
// Громкость по умолчанию снижена до 30% (фон должен быть тише разговора). Прежние 50% по умолчанию тоже снижаем.
if (!settings.volV2) { if (settings.musicVol === 50) settings.musicVol = 30; settings.volV2 = true; write(K_SET, settings); }
if (!settings.onTopV2) { settings.onTop = true; settings.onTopV2 = true; write(K_SET, settings); }
// Звук в фокусе (soundMode): 'silence' — тишина, 'entry' — музыка на вход, 'music' — музыка весь блок.
// С этой версии по умолчанию «музыка на вход»: она помогает начать, а сложная работа идёт в тишине.
if (!settings.soundV4) { settings.soundMode = 'entry'; settings.soundV4 = true; delete settings.music; delete settings.silenceV3; write(K_SET, settings); }
const saveSettings = () => write(K_SET, settings);
const fx = window.FocusFx;
fx?.setTheme(settings.theme);

// [{ts, task, min}]. История хранится в двух местах, которые при запуске объединяются (boot.js).
// Поэтому «Очистить историю» запоминает время очистки (settings.histClearedAt): старые записи
// из кэша движка после этого не возвращаются, даже если он не успел записаться на диск.
let history = read(K_HIST, []).filter(h => h && !h.deleted && h.min > 0);
const IDLE = { phase: 'idle', cycle: 0, day: '' };
let st = read(K_STATE, IDLE);
const save = () => write(K_STATE, st);

// ---------- Утилиты ----------
const $ = id => document.getElementById(id);
const MIN = 60000, CIRC = 2 * Math.PI * 96;
const now = () => Date.now();
const dayKey = (t = now()) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
function mmss(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(s / 60), sec = s % 60;
  const p = n => String(n).padStart(2, '0');
  if (m >= 100) return `${Math.floor(m / 60)}:${p(m % 60)}:${p(sec)}`;
  return `${p(m)}:${p(sec)}`;
}
function plural(n, one, few, many) {
  const a = n % 10, b = n % 100;
  if (a === 1 && b !== 11) return one;
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
  return many;
}
const hm = m => m >= 60 ? `${Math.floor(m / 60)} ч ${m % 60 ? (m % 60) + ' мин' : ''}`.trim() : `${m} мин`;

// ---------- Tauri ----------
const T = window.__TAURI__;
const win = T?.window?.getCurrentWindow?.();
const native = {
  last: {},
  once(key, val, fn) { if (this.last[key] === val) return; this.last[key] = val; try { fn(); } catch {} },
  title(t) { this.once('title', t, () => { document.title = t; win?.setTitle(t).catch(() => {}); }); },
  tray(t) { this.once('tray', t, () => T?.core?.invoke('set_tray_text', { text: t }).catch(() => {})); },
  progress(status, pct) {
    const p = Math.max(0, Math.min(100, Math.round(pct || 0)));
    this.once('prog', status + p, () => win?.setProgressBar({ status, progress: p }).catch(() => {}));
  }
};
async function notify(title, body) {
  if (!settings.notify || !T?.notification) return;
  try {
    const n = T.notification;
    let ok = await n.isPermissionGranted();
    if (!ok) ok = (await n.requestPermission()) === 'granted';
    if (ok) n.sendNotification({ title, body });
  } catch {}
}
async function popup() {
  if (!win) return;
  try {
    await win.requestUserAttention(2);
    if (!settings.popup) return;
    await win.show(); await win.unminimize(); await win.setFocus();
  } catch {}
}

// ---------- Поверх окон и мини-режим ----------
const LSize = T?.dpi?.LogicalSize || T?.window?.LogicalSize;
let mini = false;

function applyOnTop() {
  $('pinBtn').classList.toggle('on', !!settings.onTop);
  $('pinBtn').setAttribute('aria-pressed', String(!!settings.onTop));
  $('pinBtn').title = settings.onTop ? 'Поверх всех окон: включено' : 'Поверх всех окон';
  win?.setAlwaysOnTop(!!settings.onTop || mini).catch(() => {});
}

async function setMini(on) {
  if (mini === on) return;
  mini = on;
  document.body.classList.toggle('mini', on);
  $('mini').hidden = !on;
  if (on) renderMini();
  if (!win || !LSize) return;
  try {
    if (on) {
      await win.setDecorations(false);
      await win.setMinSize(new LSize(200, 64));
      await win.setSize(new LSize(260, 76));
    } else {
      await win.setDecorations(true);
      fx?.titlebar();
      await win.setSize(new LSize(420, 700));
      await win.setMinSize(new LSize(360, 600));
    }
  } catch {}
  applyOnTop();
}

function renderMini() {
  if (!mini) return;
  const dot = $('miniDot');
  // Полоска внизу: сколько пройдено блока или перерыва.
  const prog = st.phase === 'focus' ? elapsed() / (isFree() ? 60 * MIN : targetMs())
    : st.phase === 'break' ? 1 - (st.brk.endAt - now()) / st.brk.totalMs : 0;
  $('miniProg').style.width = (Math.max(0, Math.min(1, prog)) * 100).toFixed(2) + '%';
  if (st.phase === 'focus') {
    const el = elapsed(), running = !!st.runFrom, microOn = !$('microBanner').hidden;
    $('miniClock').textContent = isFree() ? mmss(el) : mmss(targetMs() - el);
    $('miniLabel').textContent = !running ? 'Пауза'
      : now() < distractUntil ? `${siteName(distractKind)} — после блока`
      : microOn ? 'Микропауза: взгляд вдаль' : (st.task || 'Фокус');
    dot.className = 'mini-dot' + (running ? '' : ' paused') + (microOn ? ' micro' : '');
    $('miniPause').hidden = false;
    $('miniPause').title = running ? 'Пауза' : 'Продолжить';
    $('miniPauseIcon').setAttribute('d', running ? 'M6 19h4V5H6v14Zm8-14v14h4V5h-4Z' : 'M8 5v14l11-7Z');
  } else if (st.phase === 'break') {
    $('miniClock').textContent = mmss(st.brk.endAt - now());
    $('miniLabel').textContent = 'Перерыв — отдых без экрана';
    dot.className = 'mini-dot rest';
    $('miniPause').hidden = true;
  }
}

// Включить «поверх всех окон» можно сразу, а отключить — только подтвердив отдельной кнопкой.
$('pinBtn').onclick = () => {
  if (!settings.onTop) { settings.onTop = true; saveSettings(); applyOnTop(); toast('Окно поверх всех остальных'); return; }
  openSheet('onTopSheet');
};
$('onTopOff').onclick = () => {
  settings.onTop = false; saveSettings(); applyOnTop(); closeSheets(); toast('Окно больше не поверх остальных');
};
$('miniBtn').onclick = () => setMini(true);
$('miniExpand').onclick = () => setMini(false);
$('miniPause').onclick = () => { $('pauseBtn').click(); renderMini(); };

// ---------- Музыка Tabletop Audio и защита от отвлечений ----------
const inv = (cmd, args) => T?.core ? T.core.invoke(cmd, args).catch(() => null) : Promise.resolve(null);
const MUSIC_QUEUE = 20;
// «Музыка на вход»: первые 2 минуты фокуса звучит спокойная музыка, потом за 3 минуты плавно стихает.
// Затухание медленное и ровное: внимание цепляет перемена, а не плавное течение.
// Время — минуты фокуса, без пауз: вернулся с паузы в первые 5 минут — вход продолжается.
// Кнопка «Погружение» запускает вход заново с текущей минуты блока (st.entryFrom — минуты фокуса в мс).
const ENTRY_FULL = 2 * MIN, ENTRY_END = 5 * MIN;
// Слух оценивает громкость в децибелах, а плеер задаётся амплитудой. Поэтому стихаем равномерно
// по децибелам: от 0 до −40 дБ (почти не слышно), дальше пауза. Если убавлять амплитуду равномерно,
// первые минуты спада на слух незаметны, а почти всё затухание приходится на последние секунды.
const ENTRY_DB = 40;
const musicMode = () => settings.soundMode || 'entry';
const entryElapsed = () => elapsed() - (st.entryFrom || 0);
// Доля громкости входа: 1 — полная, 0 — тишина. В режиме «весь блок» всегда 1.
function entryLevel() {
  if (musicMode() !== 'entry') return 1;
  const x = (entryElapsed() - ENTRY_FULL) / (ENTRY_END - ENTRY_FULL);
  return x <= 0 ? 1 : x >= 1 ? 0 : 10 ** (-ENTRY_DB * x / 20);
}
const musicVolume = () => settings.musicVol / 100 * entryLevel();
// Время для музыки: весь фокус или только вход.
const musicTime = () => st.phase === 'focus' && (musicMode() === 'music' || (musicMode() === 'entry' && entryElapsed() < ENTRY_END));
// На вход — всегда спокойные треки.
const musicArgs = () => ({ count: MUSIC_QUEUE, calm: !!settings.musicCalm || musicMode() === 'entry', volume: musicVolume() });
let musicOn = false, guardOn = false;
let sentVol = -1;        // последняя громкость, отправленная плееру во время входа
// Музыку поставили на паузу кнопкой — до конца блока сама не включается.
let musicUserPaused = false;
let musicTrack = '';     // название текущего трека приходит из окна сайта

// Музыка играет только пока идёт фокус (в режиме входа — первые 5 минут); пауза, конец блока
// и перерыв её останавливают.
function syncMusic() {
  const time = musicTime();
  const want = time && !musicUserPaused && !!st.runFrom;
  if (want && !musicOn) { musicOn = true; sentVol = musicVolume(); inv('tta_play', musicArgs()); }
  else if (want && musicMode() === 'entry') {
    // Затухание входа: громкость снижается каждую секунду на ~2% (≈0,2 дБ) — шагов на слух не слышно.
    const v = musicVolume();
    if (Math.abs(v - sentVol) > Math.max(.0002, sentVol * .02)) { sentVol = v; inv('tta_cmd', { cmd: 'volume', volume: v }); }
  }
  // Затухаем от громкости, которая сейчас звучит: после «Стоп погружения» расчётная уже ноль.
  if (!want && musicOn) { musicOn = false; inv('tta_cmd', { cmd: 'pause', volume: sentVol >= 0 ? sentVol : musicVolume() }); }
  const g = !!settings.guard && st.phase === 'focus' && !!st.runFrom;
  if (g !== guardOn) { guardOn = g; inv('set_guard', { on: g }); }
  const row = $('musicRow');
  // Панель не появляется и не исчезает посреди блока: после входа на ней остаются название трека
  // и ссылка на сайт, без кнопок управления.
  row.hidden = st.phase !== 'focus' || musicMode() === 'silence';
  // На входе панель простая: трек, ссылка на сайт, пояснение и одна кнопка входа.
  row.classList.toggle('entry', musicMode() === 'entry');
  $('mDive').textContent = time ? 'Стоп погружения' : 'Погружение';
  $('mDive').title = time ? 'Остановить музыку сейчас — дальше тишина' : 'Ещё раз музыка на вход: 2 минуты звучит, к 5-й минуте стихает';
  $('musicTitle').textContent = musicTrack || 'Tabletop Audio';
  const playing = musicMode() === 'entry' ? 'Tabletop Audio · вход' : 'Tabletop Audio · играет';
  $('musicState').textContent = !time ? 'Tabletop Audio · тишина'
    : musicOn ? (musicTrack ? playing : 'загружается…') : 'на паузе';
  // Пояснение в самой панели: зачем музыка на входе и почему потом тишина.
  $('musicWhy').hidden = musicMode() !== 'entry';
  $('musicWhy').textContent = time
    ? 'Музыка — для приятного начала. К 5-й минуте она стихнет: думать лучше в тишине.'
    : 'Дальше тишина — в ней лучше думается. Захочешь музыку снова — «Погружение».';
  row.classList.toggle('playing', musicOn && !!musicTrack);
  renderLike();
  row.classList.toggle('off', !musicOn);
  $('mToggleIcon').setAttribute('d', musicUserPaused ? 'M8 5v14l11-7Z' : 'M6 19h4V5H6v14Zm8-14v14h4V5h-4Z');
  $('mToggle').title = musicUserPaused ? 'Включить музыку' : 'Пауза музыки';
  syncFx();
}

// Живой фон всегда переливается на всё окно: в фокусе — спектр холодных цветов, в перерыве — тёплые.
// Пока играет музыка, перелив вдобавок следует за звуком.
function syncFx() {
  const rest = st.phase === 'break' || st.phase === 'brkDone';
  fx?.setState(rest, 1, st.phase === 'focus');
  // Громкость звука слушаем, только пока играет музыка фокуса.
  native.once('meter', musicOn, () => inv('audio_meter', { on: musicOn }));
}
T?.event?.listen('audio_level', e => fx?.audio(e.payload));

async function onFocusStart() {
  inv('reset_allowed');
  musicUserPaused = false;
  if (settings.closeYandex && await inv('close_yandex_music')) toast('Яндекс Музыка закрыта на время фокуса');
}

T?.event?.listen('tta-track', e => { musicTrack = e.payload || ''; syncMusic(); });
// ---------- Понравившиеся треки ----------
const HEART = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z', HEART_O = 'M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3Zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05Z';
const liked = () => (settings.liked ||= []);
const isLiked = title => liked().some(x => x.title === title);
function renderLike() {
  const on = !!musicTrack && isLiked(musicTrack);
  $('mLike').hidden = !musicTrack;
  $('mLike').classList.toggle('on', on);
  $('mLike').setAttribute('aria-pressed', String(on));
  $('mLike').title = on ? 'Убрать из понравившихся' : 'Нравится — сохранить трек';
  $('mLikeIcon').setAttribute('d', on ? HEART : HEART_O);
}
$('mLike').onclick = () => {
  if (!musicTrack) return;
  if (isLiked(musicTrack)) { settings.liked = liked().filter(x => x.title !== musicTrack); toast('Убрано из понравившихся'); }
  else { liked().unshift({ title: musicTrack, at: now() }); toast(`«${musicTrack}» — в понравившихся`); }
  saveSettings(); renderLike();
};
function renderLiked() {
  const list = $('likedList'); list.innerHTML = '';
  $('likedCount').textContent = liked().length ? String(liked().length) : '';
  if (!liked().length) {
    const li = document.createElement('li'); li.className = 'empty';
    li.textContent = 'Пока пусто. Нажми ♡ рядом с треком во время фокуса.';
    list.append(li); return;
  }
  liked().forEach(x => {
    const li = document.createElement('li');
    const name = document.createElement('span');
    const heart = document.createElement('span'); heart.className = 'heart'; heart.textContent = '♥';
    name.append(heart, x.title);
    const del = document.createElement('button'); del.className = 'ghost'; del.textContent = 'Убрать';
    del.onclick = () => { settings.liked = liked().filter(y => y.title !== x.title); saveSettings(); renderLiked(); renderLike(); };
    li.append(name, del); list.append(li);
  });
}
$('mToggle').onclick = () => { musicUserPaused = !musicUserPaused; syncMusic(); };
$('mNext').onclick = () => { musicUserPaused = false; inv('tta_cmd', { cmd: 'next' }); syncMusic(); };
// Одна кнопка входа: пока музыка звучит — «Стоп погружения» (сразу тишина),
// после входа — «Погружение» (ещё раз: 2 минуты звучит, к 5-й минуте стихает).
$('mDive').onclick = () => {
  st.entryFrom = musicTime() ? elapsed() - ENTRY_END : elapsed();
  musicUserPaused = false;
  save(); syncMusic();
};
$('mShow').onclick = async () => { if (!await inv('tta_show')) { musicOn = false; syncMusic(); } };

const SITE_NAMES = { youtube: 'YouTube', instagram: 'Instagram', vk: 'ВКонтакте', telegram: 'Telegram', yandex: 'Яндекс Музыка' };
const DISTRACT = { youtube: 'YouTube свёрнут', instagram: 'Instagram свёрнут', vk: 'ВКонтакте свёрнут', telegram: 'Telegram свёрнут', yandex: 'Яндекс Музыка свёрнута' };
let distractKind = null, distractTimer = null;
// again — повторное напоминание: окно уже сворачивали, теперь только надпись, без перехвата окна.
let distractUntil = 0;
function showDistraction(kind, again = false) {
  if (st.phase !== 'focus') return;
  distractKind = kind;
  distractUntil = now() + 8000;
  $('distractTitle').textContent = again ? `${siteName(kind)} — после блока` : (DISTRACT[kind] || `${siteName(kind)} свёрнут`);
  $('distractText').textContent = again ? 'Сейчас фокус. Если это нужно для работы — нажми кнопку справа.' : 'Сейчас фокус. Вернёшься к нему после блока.';
  $('distractAllow').textContent = 'Нужно для работы';
  $('distractBanner').hidden = false;
  clearTimeout(distractTimer);
  distractTimer = setTimeout(() => $('distractBanner').hidden = true, 12000);
  if (mini || again) return;      // мини-плашка и так поверх окон; повтор — без перехвата окна
  popup();
}
T?.event?.listen('distraction-again', e => showDistraction(e.payload, true));
$('distractOk').onclick = () => { $('distractBanner').hidden = true; };
$('distractAllow').onclick = () => {
  inv('allow_distraction', { kind: distractKind });
  $('distractBanner').hidden = true;
  toast('Хорошо, до конца блока не трогаю');
};
T?.event?.listen('distraction', e => showDistraction(e.payload));

// ---------- Какие сайты сворачивать ----------
// Встроенные сайты можно выключить (settings.sitesOff — их kind), свои — добавить по домену (settings.sites).
// Свой сайт в защите называется своим доменом: kind = «twitch.tv».
// Какие адреса считаются встроенным сайтом — те же правила, что в urlbar.rs (kind_of_host).
const BUILTIN_SITES = [
  { kind: 'youtube', host: 'youtube.com', is: h => under(h, 'youtube.com') || under(h, 'youtu.be') },
  { kind: 'vk', host: 'vk.com', is: h => ['vk.com', 'vk.ru', 'vkvideo.ru', 'vk.me'].some(d => under(h, d)) },
  { kind: 'instagram', host: 'instagram.com', is: h => under(h, 'instagram.com') },
  { kind: 'telegram', host: 'web.telegram.org', is: h => h === 'web.telegram.org' || h === 'web.telegram.me' },
  { kind: 'yandex', host: 'music.yandex.ru', is: h => h.startsWith('music.yandex.') },
];
const MAX_SITES = 200;   // столько же принимает guard.rs (set_sites)
function siteName(kind) { return SITE_NAMES[kind] || kind || 'Сайт'; }
const sitesOff = () => (settings.sitesOff ||= []);
const mySites = () => (settings.sites ||= []);
const under = (host, d) => host === d || host.endsWith('.' + d);
const pushSites = () => inv('set_sites', { off: sitesOff(), custom: mySites() });

// «https://www.Twitch.tv/videos/1» → «twitch.tv». Пустая строка — не похоже на адрес.
// Правила не мягче, чем guard.rs (valid_host): что принято здесь, примет и защита.
function normHost(text) {
  const h = text.trim().toLowerCase().replace(/^[a-z]+:\/\//, '')
    .split(/[/?#]/)[0].split('@').pop().split(':')[0].replace(/^www\./, '');
  const ok = h.length <= 253 && /^[\p{L}\p{N}-]+(\.[\p{L}\p{N}-]+)+$/u.test(h) && !/^-|-$/.test(h);
  return ok ? h : '';
}

function siteHint(text, err = false) {
  $('siteHint').textContent = text;
  $('siteHint').classList.toggle('err', err);
}

function renderSites() {
  $('sitesBox').classList.toggle('off', !settings.guard);
  const list = $('sitesList'); list.innerHTML = '';
  BUILTIN_SITES.forEach(s => {
    const li = document.createElement('li');
    const label = document.createElement('label'); label.className = 'site-on';
    const name = document.createElement('span'); name.textContent = SITE_NAMES[s.kind];
    const host = document.createElement('span'); host.className = 'host'; host.textContent = s.host;
    name.append(host);
    const box = document.createElement('input'); box.type = 'checkbox';
    box.checked = !sitesOff().includes(s.kind);
    box.setAttribute('aria-label', SITE_NAMES[s.kind]);
    box.onchange = () => {
      settings.sitesOff = box.checked ? sitesOff().filter(k => k !== s.kind) : [...sitesOff(), s.kind];
      saveSettings(); pushSites(); renderSites();
    };
    label.append(name, box); li.append(label); list.append(li);
  });
  mySites().forEach(h => {
    const li = document.createElement('li');
    const name = document.createElement('span'); name.textContent = h;
    const del = document.createElement('button'); del.type = 'button'; del.className = 'ghost'; del.textContent = 'Убрать';
    del.onclick = () => { settings.sites = mySites().filter(x => x !== h); saveSettings(); pushSites(); renderSites(); };
    li.append(name, del); list.append(li);
  });
  const on = BUILTIN_SITES.length - sitesOff().length + mySites().length;
  $('sitesCount').textContent = on ? String(on) : '';
}

$('siteInput').oninput = () => siteHint('');
$('siteAdd').onsubmit = e => {
  e.preventDefault();
  const text = $('siteInput').value;
  if (!text.trim()) return;
  const h = normHost(text);
  if (!h) return siteHint('Не похоже на адрес сайта. Пример: twitch.tv', true);
  const b = BUILTIN_SITES.find(s => s.is(h));
  if (b) {
    if (sitesOff().includes(b.kind)) {
      settings.sitesOff = sitesOff().filter(k => k !== b.kind);
      saveSettings(); pushSites(); renderSites();
      siteHint(`${SITE_NAMES[b.kind]} уже есть в списке — включил`);
    } else siteHint(`${SITE_NAMES[b.kind]} уже есть в списке`);
    $('siteInput').value = '';
    return;
  }
  const same = mySites().find(d => under(h, d));
  if (same) return siteHint(`${same} уже в списке`, true);
  if (mySites().filter(d => !under(d, h)).length >= MAX_SITES) return siteHint(`Можно добавить не больше ${MAX_SITES} сайтов`, true);
  // Добавили домен шире уже записанного (vk.com после m.vk.com) — узкий больше не нужен.
  settings.sites = [...mySites().filter(d => !under(d, h)), h];
  saveSettings(); pushSites(); renderSites();
  $('siteInput').value = '';
  siteHint(`${h} и его поддомены будут сворачиваться во время фокуса`);
};
pushSites();


// ---------- Звук ----------
let audio = null;
function initAudio() { try { audio = audio || new AudioContext(); audio.resume(); } catch {} }
document.addEventListener('pointerdown', initAudio, { once: true });
function tone(freqs, gap = 0.18, vol = 0.16) {
  if (!settings.sound || !audio) return;
  freqs.forEach((f, i) => {
    const o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime + i * gap;
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
    o.connect(g).connect(audio.destination); o.start(t); o.stop(t + 1.2);
  });
}
const chimeEnd = () => tone([523.25, 659.25, 783.99]);
const chimeBack = () => tone([783.99, 659.25, 523.25]);
const chimeSoft = () => tone([659.25], 0, 0.08);

// ---------- Экраны ----------
const SCREENS = ['home', 'focus', 'wrap', 'brk', 'brkDone'];
const PHASE_SCREEN = { idle: 'home', focus: 'focus', wrap: 'wrap', break: 'brk', brkDone: 'brkDone' };
function show(id) { SCREENS.forEach(s => $(s).hidden = s !== id); }

let toastTimer;
function toast(text) {
  const t = $('toast'); t.textContent = text; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.hidden = true, 3200);
}

// ---------- Фокус: вычисления ----------
const elapsed = () => (st.acc || 0) + (st.runFrom ? now() - st.runFrom : 0);
const isFree = () => st.planMin == null;
const targetMs = () => ((st.planMin ?? 60) + (st.extendMin || 0)) * MIN;
const capMs = () => settings.capMin * MIN;

function chosenMinutes() {
  if (settings.dur === 'free') return null;
  if (settings.dur === 'custom') return settings.customMin;
  return +settings.dur;
}

function rollDay() {
  if (st.day !== dayKey()) { st.day = dayKey(); st.cycle = 0; }
}

function startFocus(planMin, task, note) {
  initAudio(); rollDay();
  st = { ...st, phase: 'focus', task, note: note || '', planMin, basePlan: planMin, extendMin: 0, acc: 0, runFrom: now(), entryFrom: 0,
         micro: [], extraCount: 0, brk: null, wrapAt: null, auto: 0, seen: now() };
  save(); render();
  onFocusStart();
}

function pauseFocus() { if (st.runFrom) { st.acc = elapsed(); st.runFrom = null; } }
function resumeFocus() { if (!st.runFrom) st.runFrom = now(); }

function recordBlock() {
  const min = Math.round(elapsed() / MIN);
  if (min >= 1) {
    // Дата — момент конца блока, а не нажатия кнопки: блок, закрытый после выключения ПК, остаётся в своём дне.
    history.push({ ts: st.wrapAt || now(), task: st.task || '', min });
    if (history.length > 2000) history = history.slice(-2000);
    write(K_HIST, history);
  }
  return min;
}

function goHome(msg) {
  st = { ...IDLE, cycle: st.cycle, day: st.day };
  save(); render();
  if (msg) toast(msg);
}

// После конца блока время замирает. Если человек дописывает мысль и нажимает кнопку
// в течение GRACE — эти минуты засчитываются. Если он отошёл дольше AUTO —
// блок закрывается сам, ровно на плановом времени.
const GRACE = 10 * MIN, AUTO = 15 * MIN;
const sinceWrap = () => now() - (st.wrapAt || now());
function creditWrap() { const away = sinceWrap(); if (away <= GRACE) st.acc += away; }

function enterWrap() {
  st.acc = targetMs(); st.runFrom = null; st.wrapAt = now();
  st.phase = 'wrap'; save(); render();
  chimeEnd();
  const m = Math.round(elapsed() / MIN);
  notify('Блок завершён', `${m} ${plural(m, 'минута', 'минуты', 'минут')} фокуса. Допиши мысль — и на перерыв.`);
  popup();
}

function startBreak(kind, min) {
  const total = min * MIN;
  st.phase = 'break';
  st.brk = { kind, endAt: now() + total, totalMs: total, idea: pickIdea(kind) };
  save(); render();
}

function endBreak(natural) {
  st.phase = 'brkDone'; save(); render();
  if (natural) {
    chimeBack();
    notify('Перерыв окончен', st.note ? `Ты остановился на: ${st.note}` : 'Можно продолжать.');
    popup();
  }
}

// ---------- Идеи для перерыва ----------
const IDEAS = {
  short: [
    'Встань и пройдись по комнате или по коридору.',
    'Посмотри в окно на что-нибудь далёкое — глазам это нужнее всего.',
    'Потянись: шея, плечи, спина, запястья.',
    'Налей воды или чая и выпей не за столом.',
    'Несколько медленных вдохов с длинным выдохом.',
    'Посмотри секунд сорок на что-нибудь зелёное: деревья за окном, растение.'
  ],
  long: [
    'Выйди на улицу хотя бы на 10 минут.',
    'Поешь не за рабочим столом и без экрана.',
    'Поговори с кем-нибудь не о работе.',
    'Сделай короткую прогулку или лёгкую разминку.'
  ]
};
function pickIdea(kind) {
  const list = kind === 'long' ? IDEAS.long : IDEAS.short;
  let idea = list[Math.floor(Math.random() * list.length)];
  const h = new Date().getHours() + new Date().getMinutes() / 60;
  if (kind === 'long' && h >= 12.5 && h <= 15) idea += ' Можно вздремнуть 15–20 минут — но не дольше 30.';
  return idea;
}

// ---------- Отрисовка ----------
function render() {
  show(PHASE_SCREEN[st.phase] || 'home');
  closeSheets();
  const live = st.phase === 'focus' || st.phase === 'break';
  // Конец блока и конец перерыва требуют решения — для этого нужно полное окно.
  if (!live) setMini(false);
  $('miniBtn').hidden = !live;
  $('openSettings').hidden = st.phase !== 'idle';
  if (st.phase === 'idle') renderHome();
  if (st.phase === 'focus') {
    $('focusTask').textContent = st.task || 'Фокус-сессия';
    $('noteCard').hidden = !st.note;
    $('noteText').textContent = st.note || '';
    $('microBanner').hidden = true;
    $('stopBtn').textContent = 'Завершить';
  }
  if (st.phase === 'wrap') {
    const m = Math.round(elapsed() / MIN);
    $('wrapTitle').textContent = isFree()
      ? `${m} ${plural(m, 'минута', 'минуты', 'минут')} фокуса. Пора отдохнуть`
      : 'Блок завершён. Время отдохнуть';
    $('wrapNote').value = '';
    const kind = nextBreakKind();
    $('takeBreakBtn').textContent = kind === 'long'
      ? `Длинный перерыв ${settings.longMin} мин`
      : `Перерыв ${settings.breakMin} мин`;
    setTimeout(() => $('wrapNote').focus(), 50);
  }
  if (st.phase === 'break') {
    const b = st.brk;
    const lbl = { regular: 'Перерыв', long: 'Длинный перерыв', extra: 'Внеплановый перерыв' }[b.kind];
    $('brkTag').textContent = `${lbl} · ${Math.round(b.totalMs / MIN)} мин`;
    $('brkIdea').textContent = b.idea;
  }
  if (st.phase === 'brkDone') {
    const extra = st.brk?.kind === 'extra';
    $('doneTitle').textContent = extra ? 'Возвращаемся к сессии'
      : st.auto ? `Ты отходил — блок засчитан: ${hm(st.auto)}` : 'Готов к следующему блоку?';
    $('doneNoteCard').hidden = !st.note;
    $('doneNote').textContent = st.note || '';
    if (extra) {
      $('resumeBtn').textContent = isFree()
        ? 'Продолжить сессию'
        : `Продолжить · осталось ${mmss(targetMs() - elapsed())}`;
    } else {
      const m = st.basePlan !== undefined ? st.basePlan : st.planMin;
      $('resumeBtn').textContent = m == null ? 'Начать фокус · без таймера' : `Начать фокус · ${m} мин`;
    }
  }
  tick();
}

function nextBreakKind() { return (st.cycle + 1) >= settings.longEvery ? 'long' : 'regular'; }

function setRing(el, frac) {
  const f = Math.max(0, Math.min(1, frac));
  el.style.strokeDashoffset = String(CIRC * (1 - f));
  // Светлая точка на конце дуги
  const head = el.parentNode.querySelector('.ring-head'), a = f * 2 * Math.PI;
  if (head) { head.setAttribute('cx', 110 + 96 * Math.cos(a)); head.setAttribute('cy', 110 + 96 * Math.sin(a)); }
}

// ---------- Тик ----------
// Если между тиками прошло больше 2 минут, компьютер спал или приложение было закрыто.
// Это время не работа: ставим сессию на паузу в момент, когда тики прекратились.
let lastTick = now();
function catchUpGap(t) {
  const gap = t - lastTick, stoppedAt = lastTick;
  lastTick = t;
  if (gap < 2 * MIN || st.phase !== 'focus' || !st.runFrom) return false;
  const accBefore = st.acc, runFrom = st.runFrom;
  st.acc += Math.max(0, stoppedAt - runFrom);
  st.runFrom = null;
  if (st.acc >= targetMs()) {
    // Блок успел закончиться до выключения — закрываем его на плановом времени.
    st.wrapAt = runFrom + (targetMs() - accBefore);
    st.acc = targetMs(); st.phase = 'wrap';
    autoCloseBlock();
  } else {
    save(); render();
    toast('Компьютер спал или был выключен — сессия на паузе');
  }
  return true;
}

function autoCloseBlock() {
  const m = recordBlock();
  const kind = nextBreakKind();
  st.cycle = kind === 'long' ? 0 : st.cycle + 1;
  st.phase = 'brkDone';
  st.brk = { kind };
  st.auto = m;
  save(); render();
}

function tick() {
  const t = now();
  if (catchUpGap(t)) return;
  if (st.phase !== 'idle' && t - (st.seen || 0) > 30000) { st.seen = t; save(); }
  renderMini();
  syncMusic();
  if (st.phase === 'idle') {
    native.title('NZT Focus'); native.tray('NZT Focus'); native.progress('none', 0);
    return;
  }

  if (st.phase === 'focus') {
    const el = elapsed(), tgt = targetMs(), running = !!st.runFrom;
    const free = isFree();
    $('focusClock').textContent = free ? mmss(el) : mmss(tgt - el);
    $('focusSub').textContent = !running ? 'пауза' : free ? 'прошло' : 'осталось';
    $('focusClock').classList.toggle('paused', !running);
    $('focusRing').classList.toggle('paused', !running);
    setRing($('focusRing'), el / tgt);
    const tag = $('focusTag');
    tag.textContent = running ? (st.extendMin ? `Фокус · +${st.extendMin} мин` : 'Фокус') : 'Пауза';
    tag.classList.toggle('paused', !running);
    $('pauseBtn').textContent = running ? 'Пауза' : 'Продолжить';
    $('extraHint').hidden = !(st.extraCount >= 2 && tgt - el > 12 * MIN);

    const label = free ? `${mmss(el)} фокуса` : `${mmss(tgt - el)} до перерыва`;
    native.title(running ? `${mmss(free ? el : tgt - el)} · Фокус` : 'Пауза · NZT Focus');
    native.tray(`NZT Focus — ${running ? label : 'пауза'}`);
    native.progress(running ? 'normal' : 'paused', (el / tgt) * 100);

    if (running) {
      checkMicro(el, tgt);
      if (el >= tgt) enterWrap();
    }
    return;
  }

  if (st.phase === 'wrap') {
    const away = sinceWrap();
    if (away >= AUTO) { autoCloseBlock(); return; }
    $('overtime').hidden = away < 30000;
    $('overtimeVal').textContent = '+' + mmss(away);
    $('extendBtn').disabled = elapsed() >= capMs();
    $('wrapText').textContent = elapsed() >= capMs()
      ? `Это уже ${Math.round(elapsed() / MIN)} минут подряд — дальше внимание заметно падает. Лучше отдохнуть.`
      : 'Если ты посреди мысли — допиши её: до 10 минут после конца блока засчитаются.';
    native.title('Перерыв? · NZT Focus');
    native.tray('NZT Focus — время перерыва');
    native.progress('paused', 100);
    return;
  }

  if (st.phase === 'break') {
    const b = st.brk, left = b.endAt - t;
    $('brkClock').textContent = mmss(left);
    setRing($('brkRing'), 1 - left / b.totalMs);
    native.title(`${mmss(left)} · Перерыв`);
    native.tray(`NZT Focus — перерыв, ещё ${mmss(left)}`);
    native.progress('paused', (1 - left / b.totalMs) * 100);
    if (left <= 0) endBreak(true);
    return;
  }

  if (st.phase === 'brkDone') {
    native.title('Продолжаем? · NZT Focus');
    native.tray('NZT Focus — перерыв окончен');
    native.progress('none', 0);
  }
}

// ---------- Микропаузы ----------
let microTimer = null;
function checkMicro(el, tgt) {
  if (!settings.micro) return;
  const mark = Math.floor(el / MIN / 20) * 20;
  // Каждые 20 минут, но не ближе 5 минут к концу блока (там и так будет перерыв).
  if (mark < 20 || st.micro.includes(mark)) return;
  st.micro.push(mark); save();
  if (tgt - el < 5 * MIN || el - mark * MIN > 2 * MIN) return;
  showMicro();
}
function showMicro() {
  let left = 20;
  $('microLeft').textContent = left;
  $('microBanner').hidden = false;
  chimeSoft();
  notify('Микропауза', 'Отведи взгляд вдаль на 20 секунд. Можно не отвлекаться от мысли.');
  clearInterval(microTimer);
  microTimer = setInterval(() => {
    left--; $('microLeft').textContent = left;
    if (left <= 0) hideMicro();
  }, 1000);
}
function hideMicro() { clearInterval(microTimer); $('microBanner').hidden = true; }
$('microSkip').onclick = hideMicro;

// ---------- Главная ----------
const DUR_HINTS = {
  '25': 'Короткий блок: удобно, чтобы раскачаться, или для утомительной задачи.',
  '45': 'Средний блок, как школьный урок.',
  '60': 'Рекомендуемый: час работы → 10 минут отдыха. Так советуют нормы Японии, США и Великобритании.',
  '90': 'Длинный блок для глубокой работы. Дольше без отдыха лучше не тянуть.',
  'custom': 'Своя длительность от 10 до 120 минут.',
  'free': 'Без жёсткого конца: таймер считает вверх и предложит перерыв на 60-й минуте.'
};

function renderHome() {
  $('task').value = settings.lastTask || '';
  document.querySelectorAll('#durChips button').forEach(b => b.classList.toggle('on', b.dataset.min === settings.dur));
  $('customRow').hidden = settings.dur !== 'custom';
  $('customRange').value = settings.customMin;
  $('customOut').textContent = settings.customMin + ' мин';
  $('customChip').textContent = settings.dur === 'custom' ? settings.customMin + '′' : 'Своё';
  $('durHint').textContent = DUR_HINTS[settings.dur];
  renderSound();
  $('helpCard').hidden = !!settings.helpSeen;

  const today = history.filter(h => dayKey(h.ts) === dayKey());
  const tMin = today.reduce((a, h) => a + h.min, 0);
  $('todayLine').textContent = today.length
    ? `Сегодня: ${today.length} ${plural(today.length, 'блок', 'блока', 'блоков')} · ${hm(tMin)}`
    : 'Сегодня ещё ни одного блока';
  const lim = $('limitCard');
  // Ориентир — часы фокуса, а не число блоков: блоки бывают и по 15 минут.
  lim.hidden = tMin < 240;
  if (!lim.hidden) lim.querySelector('p').innerHTML =
    `Сегодня уже <b>${hm(tMin)}</b> фокуса. По исследованиям, глубокой работы в день выходит около 4 часов — дальше отдача падает. Остановиться сейчас — нормально.`;

  // Неделя
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
    days.push({ key: dayKey(d.getTime()), label: d.toLocaleDateString('ru-RU', { weekday: 'short' }).slice(0, 2), min: 0, blocks: [], today: i === 0 });
  }
  [...history].sort((a, b) => a.ts - b.ts).forEach(h => {
    const d = days.find(x => x.key === dayKey(h.ts));
    if (d) { d.min += h.min; d.blocks.push(h); }
  });
  renderWeek(days);
  const wk = days.reduce((a, d) => a + d.min, 0);
  $('weekTotal').textContent = wk ? hm(wk) : '';
}

// Неделя: у всех столбиков одна шкала яркости. Внизу цвет глубокий, к цели дня (4 часа
// глубокой работы) он светлеет и начинает светиться: чем больше сделано, тем ярче верх.
// Блоки дня разделены тонкими зазорами; при наведении видно, когда блок был.
const GOAL_MIN = 240;
function renderWeek(days) {
  const top = Math.max(GOAL_MIN, ...days.map(d => d.min));
  const BAR_PX = 84;
  const box = $('bars');
  box.innerHTML = '';
  box.style.setProperty('--full', BAR_PX + 'px');
  box.style.setProperty('--goal', (GOAL_MIN / top * BAR_PX).toFixed(1) + 'px');
  days.forEach(d => {
    const el = document.createElement('div');
    el.className = 'bar' + (d.min ? '' : ' empty') + (d.today ? ' today' : '');
    const v = document.createElement('b'); v.textContent = d.min ? short(d.min) : '';
    const stack = document.createElement('div'); stack.className = 'stack';
    if (!d.min) {
      const i = document.createElement('i'); i.className = 'seg-empty'; stack.append(i);
    }
    let doneMin = 0;
    d.blocks.forEach(h => {
      const i = document.createElement('i'), px = Math.max(3, h.min / top * BAR_PX);
      i.className = 'seg';
      i.style.height = px + 'px';
      // Общая для всех столбиков шкала: кусочек берёт цвет той высоты, на которой стоит. Высота — по минутам,
      // без зазоров между блоками: иначе в длинный день верх уезжает за край шкалы и выглядит тёмным.
      i.style.backgroundPosition = `0 calc(100% + ${(doneMin / top * BAR_PX).toFixed(1)}px)`;
      doneMin += h.min;
      i.title = `${timeOf(h.ts - h.min * MIN)}–${timeOf(h.ts)} · ${hm(h.min)}${h.task ? ' · ' + h.task : ''}`;
      stack.append(i);
    });
    // Свечение верха растёт вместе с днём.
    const last = stack.lastElementChild, g = Math.min(1, d.min / GOAL_MIN);
    if (d.min) last.style.boxShadow = `0 0 ${(4 + 14 * g).toFixed(0)}px -1px color-mix(in srgb, var(--a2) ${Math.round(15 + 70 * g)}%, transparent)`;
    const s = document.createElement('span'); s.textContent = d.label;
    el.append(v, stack, s); box.append(el);
  });
}

const timeOf = ts => new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

// Пояснения по исследованиям (docs/research/reports/Музыка и звук при работе.md): музыка без слов
// поднимает настроение и бодрость, но мышлению не помогает; для сложной работы лучше тишина.
const SOUND_HINTS = {
  entry: 'Музыка делает начало приятнее, а думать лучше в тишине. Поэтому 2 минуты звучит спокойная музыка без слов, потом она плавно стихает, и к 5-й минуте — тишина. Захочешь войти ещё раз — кнопка «Погружение».',
  music: 'Спокойная музыка без слов весь блок. Может помочь на однообразной работе: почта, правки, разбор. Для чтения, письма и сложных задач лучше тишина или музыка на вход.',
  silence: 'Лучший вариант для чтения, письма и сложных задач: ничто не отвлекает.'
};
// Выбор звука — на главном экране и в настройках, оба показывают одно и то же.
function renderSound() {
  document.querySelectorAll('.sound-chips button').forEach(b => b.classList.toggle('on', b.dataset.sound === musicMode()));
  document.querySelectorAll('.sound-hint').forEach(p => p.textContent = SOUND_HINTS[musicMode()]);
}
document.querySelectorAll('.sound-chips').forEach(c => c.onclick = e => {
  const b = e.target.closest('button'); if (!b) return;
  settings.soundMode = b.dataset.sound; saveSettings(); renderSound();
  if (musicMode() !== 'silence') inv('tta_preload', musicArgs());
  syncMusic();
});
$('durChips').onclick = e => {
  const b = e.target.closest('button'); if (!b) return;
  settings.dur = b.dataset.min; saveSettings(); renderHome();
};
$('customRange').oninput = e => {
  settings.customMin = +e.target.value; saveSettings();
  $('customOut').textContent = settings.customMin + ' мин';
  $('customChip').textContent = settings.customMin + '′';
};
$('task').oninput = e => { settings.lastTask = e.target.value; saveSettings(); };
$('task').onkeydown = e => { if (e.key === 'Enter') $('startBtn').click(); };
$('startBtn').onclick = () => startFocus(chosenMinutes(), $('task').value.trim(), '');

// ---------- Фокус: кнопки ----------
$('pauseBtn').onclick = () => { st.runFrom ? pauseFocus() : resumeFocus(); save(); tick(); };

let stopArmed = null;
$('stopBtn').onclick = () => {
  if (!stopArmed) {
    $('stopBtn').textContent = 'Точно завершить?';
    stopArmed = setTimeout(() => { stopArmed = null; $('stopBtn').textContent = 'Завершить'; }, 3000);
    return;
  }
  clearTimeout(stopArmed); stopArmed = null;
  const m = recordBlock();
  goHome(m >= 1 ? `Сохранено: ${hm(m)} фокуса` : 'Сессия отменена');
};

$('extraBreakBtn').onclick = () => {
  $('extraNote').value = '';
  selectExtra(settings.extraMin);
  openSheet('extraSheet');
  setTimeout(() => $('extraNote').focus(), 50);
};
function selectExtra(m) {
  settings.extraMin = m; saveSettings();
  document.querySelectorAll('#extraChips button').forEach(b => b.classList.toggle('on', +b.dataset.min === m));
}
$('extraChips').onclick = e => { const b = e.target.closest('button'); if (b) selectExtra(+b.dataset.min); };
$('extraNote').onkeydown = e => { if (e.key === 'Enter') $('extraGo').click(); };
$('extraGo').onclick = () => {
  pauseFocus();
  const n = $('extraNote').value.trim();
  if (n) st.note = n;
  st.extraCount = (st.extraCount || 0) + 1;
  hideMicro();
  startBreak('extra', settings.extraMin);
};

$('shortenBtn').onclick = () => {
  st.planMin = Math.ceil(elapsed() / MIN) + 10; st.extendMin = 0; save();
  toast('Блок закончится через 10 минут');
  tick();
};

// ---------- Конец блока ----------
$('extendBtn').onclick = () => {
  creditWrap();
  const base = st.planMin ?? 60;
  const el = Math.ceil(st.acc / MIN);
  st.extendMin = Math.min(el + 5, settings.capMin) - base;
  if ($('wrapNote').value.trim()) st.note = $('wrapNote').value.trim();
  st.wrapAt = null; st.runFrom = now();
  st.phase = 'focus'; save(); render();
};
$('takeBreakBtn').onclick = () => {
  st.note = $('wrapNote').value.trim();
  creditWrap();
  recordBlock();
  rollDay();
  const kind = nextBreakKind();
  st.cycle = kind === 'long' ? 0 : st.cycle + 1;
  startBreak(kind, kind === 'long' ? settings.longMin : settings.breakMin);
};
$('wrapNote').onkeydown = e => { if (e.key === 'Enter') $('takeBreakBtn').click(); };
$('wrapEndBtn').onclick = () => {
  creditWrap();
  const m = recordBlock();
  goHome(`Сохранено: ${hm(m)} фокуса. Хорошая работа`);
};

// ---------- Перерыв ----------
$('brkPlus').onclick = () => { st.brk.endAt += 5 * MIN; st.brk.totalMs += 5 * MIN; save(); render(); };
$('brkEndBtn').onclick = () => endBreak(false);

$('resumeBtn').onclick = () => {
  if (st.brk?.kind === 'extra') { st.phase = 'focus'; st.brk = null; resumeFocus(); save(); render(); }
  else startFocus(st.basePlan !== undefined ? st.basePlan : st.planMin, st.task, st.note);
};
$('moreRestBtn').onclick = () => startBreak(st.brk?.kind || 'regular', 5);
$('doneEndBtn').onclick = () => {
  let m = 0;
  if (st.brk?.kind === 'extra') m = recordBlock();
  goHome(m ? `Сохранено: ${hm(m)} фокуса` : 'До встречи. Хорошая работа');
};

// ---------- Листы ----------
function openSheet(id) { $('scrim').hidden = false; $(id).hidden = false; }
function closeSheets() { $('scrim').hidden = true; document.querySelectorAll('.sheet').forEach(s => s.hidden = true); }
$('scrim').onclick = closeSheets;
document.querySelectorAll('[data-close]').forEach(b => b.onclick = closeSheets);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSheets();
  if (e.key === ' ' && st.phase === 'focus' && document.activeElement?.tagName !== 'INPUT' && $('scrim').hidden) {
    e.preventDefault(); $('pauseBtn').click();
  }
});

$('openWhy').onclick = () => openSheet('whySheet');

// ---------- Подсказки ----------
const openHelp = () => { closeSheets(); openSheet('helpSheet'); };
$('openHelp').onclick = openHelp;
$('helpCardOpen').onclick = () => { settings.helpSeen = true; saveSettings(); $('helpCard').hidden = true; openHelp(); };
$('helpCardClose').onclick = () => { settings.helpSeen = true; saveSettings(); $('helpCard').hidden = true; };
$('helpToWhy').onclick = () => { closeSheets(); openSheet('whySheet'); };

// Короткая подпись над столбиком: «45м», «1:30».
function short(m) { return m < 60 ? `${m}м` : `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`; }

$('openHist').onclick = () => {
  const byDay = new Map();
  history.forEach(h => {
    const k = dayKey(h.ts);
    const d = byDay.get(k) || { ts: h.ts, min: 0, n: 0, tasks: new Set(), blocks: [] };
    d.min += h.min; d.n++; d.blocks.push(h); if (h.task) d.tasks.add(h.task);
    byDay.set(k, d);
  });
  const days = [...byDay.values()].sort((a, b) => b.ts - a.ts);
  const list = $('daysList'); list.innerHTML = '';
  if (!days.length) {
    const li = document.createElement('li'); li.className = 'muted'; li.textContent = 'Пока пусто — здесь появятся дни с завершёнными блоками.';
    list.append(li);
  }
  days.forEach(d => {
    const li = document.createElement('li');
    const left = document.createElement('div');
    const date = document.createElement('div');
    date.className = 'd-date' + (dayKey(d.ts) === dayKey() ? ' today' : '');
    date.textContent = new Date(d.ts).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' });
    const tasks = document.createElement('div'); tasks.className = 'd-tasks';
    tasks.textContent = `${d.n} ${plural(d.n, 'блок', 'блока', 'блоков')}` + (d.tasks.size ? ' · ' + [...d.tasks].join(', ') : '');
    // Блоки дня: когда были и сколько длились.
    const chips = document.createElement('div'); chips.className = 'd-blocks';
    d.blocks.sort((a, b) => a.ts - b.ts).forEach((h, n) => {
      const c = document.createElement('span');
      const dot = document.createElement('i');
      c.append(dot, `${timeOf(h.ts - h.min * MIN)}–${timeOf(h.ts)} · ${short(h.min)}`);
      c.title = `${n + 1}-й блок${h.task ? ' · ' + h.task : ''}`;
      chips.append(c);
    });
    left.append(date, tasks, chips);
    const total = document.createElement('div'); total.className = 'd-total'; total.textContent = hm(d.min);
    li.append(left, total); list.append(li);
  });
  const all = days.reduce((a, d) => a + d.min, 0);
  $('histSummary').textContent = days.length
    ? `Всего: ${hm(all)} за ${days.length} ${plural(days.length, 'день', 'дня', 'дней')}, в среднем ${hm(Math.round(all / days.length))} в день`
    : '';
  openSheet('histSheet');
};
$('openSettings').onclick = () => { renderSettings(); openSheet('settingsSheet'); };

function renderSettings() {
  document.querySelectorAll('.stepper').forEach(s => {
    const unit = s.dataset.unit || 'мин';
    s.querySelector('output').textContent = `${settings[s.dataset.key]} ${unit}`;
  });
  document.querySelectorAll('#settingsSheet input[type=checkbox][data-key]').forEach(c => c.checked = !!settings[c.dataset.key]);
  renderVol();
  renderSound();
  renderLiked();
  renderSites();
  renderThemes();
}

// Стили оформления: кружок — цвета темы на её фоне.
const THEME_ORDER = ['indigo', 'spectrum', 'tide', 'deep', 'amber'];
function renderThemes() {
  const box = $('themePicker');
  if (!fx) { box.previousElementSibling.hidden = box.hidden = true; return; }
  box.innerHTML = '';
  THEME_ORDER.forEach(id => {
    const th = fx.themes[id], v = th.v;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = id === settings.theme ? 'on' : '';
    const sw = document.createElement('i');
    sw.style.background = th.cycle
      ? `conic-gradient(from 200deg, ${th.cycle.map(c => c.acc[0]).join(', ')}, ${th.cycle[0].acc[0]})`
      : `radial-gradient(circle at 30% 30%, ${v.f1}, ${v.f2} 60%, ${v.bg})`;
    b.append(sw, th.name);
    b.onclick = () => { settings.theme = id; saveSettings(); fx.setTheme(id); renderThemes(); };
    box.append(b);
  });
}
// Громкость: ползунок в настройках и ползунок у музыки на экране фокуса показывают одно и то же.
function renderVol() {
  $('musicVol').value = $('mVol').value = settings.musicVol;
  $('mVolOut').textContent = settings.musicVol + '%';
}
$('musicVol').oninput = $('mVol').oninput = e => {
  settings.musicVol = +e.target.value; saveSettings(); renderVol();
  sentVol = musicVolume();
  inv('tta_cmd', { cmd: 'volume', volume: sentVol });
};
renderVol();
document.querySelectorAll('.stepper').forEach(s => {
  const [minus, plus] = s.querySelectorAll('button');
  const step = d => {
    const k = s.dataset.key, v = settings[k] + d * +s.dataset.step;
    settings[k] = Math.max(+s.dataset.min, Math.min(+s.dataset.max, v));
    saveSettings(); renderSettings();
  };
  minus.onclick = () => step(-1); plus.onclick = () => step(1);
});
document.querySelectorAll('#settingsSheet input[type=checkbox][data-key]').forEach(c => c.onchange = () => {
  settings[c.dataset.key] = c.checked; saveSettings();
  if (c.dataset.key === 'notify' && c.checked) notify('NZT Focus', 'Уведомления включены');
  if (c.dataset.key === 'musicCalm' && musicOn) inv('tta_cmd', { cmd: 'shuffle', ...musicArgs() });
  if (c.dataset.key === 'guard') renderSites();
});
let clearArmed = null;
$('clearHist').onclick = () => {
  if (!clearArmed) {
    $('clearHist').textContent = 'Нажми ещё раз, чтобы удалить';
    clearArmed = setTimeout(() => { clearArmed = null; $('clearHist').textContent = 'Очистить историю'; }, 3000);
    return;
  }
  clearTimeout(clearArmed); clearArmed = null;
  settings.histClearedAt = now(); saveSettings();
  history = []; write(K_HIST, history);
  $('clearHist').textContent = 'Очистить историю';
  toast('История очищена');
  if (st.phase === 'idle') renderHome();
};

// ---------- Закрытие окна: во время сессии прячемся в трей ----------
let trayHinted = false;
win?.onCloseRequested(async e => {
  // Закрываем Focus — закрываем и окно с музыкой, иначе оно останется висеть без хозяина.
  if (st.phase === 'idle') { await inv('tta_close'); return; }
  e.preventDefault();
  await win.hide();
  if (!trayHinted) { trayHinted = true; notify('NZT Focus работает в трее', 'Таймер идёт. Открыть — клик по значку у часов.'); }
});

// ---------- Старт ----------
(function restore() {
  // Сайт музыки загружаем заранее и без звука — тогда при старте блока она заиграет сразу.
  if (musicMode() !== 'silence') setTimeout(() => inv('tta_preload', musicArgs()), 1500);
  if (!PHASE_SCREEN[st.phase]) st = { ...IDLE };
  // Состояние из старой версии: в конце блока время ещё шло. Замораживаем его на плане.
  if (st.phase === 'wrap' && !st.wrapAt) { st.acc = targetMs(); st.runFrom = null; st.wrapAt = st.seen || now(); }
  // Время, пока приложение было закрыто, не считаем работой: первый тик увидит разрыв.
  if (st.seen) lastTick = st.seen;
  if (st.phase === 'break' && now() - st.brk.endAt > 60 * MIN) {
    // Внеплановый перерыв прервал блок, и его минуты ещё не в истории — сохраняем их на момент начала перерыва.
    if (st.brk.kind === 'extra') { st.wrapAt = st.brk.endAt - st.brk.totalMs; recordBlock(); }
    st = { ...IDLE, cycle: st.cycle, day: st.day };
  }
  save();
  render();
  applyOnTop();
})();

setInterval(tick, 250);
// Нативный тик раз в секунду: таймеры скрытого окна браузер притормаживает, события из Rust — нет.
T?.event?.listen('tick', tick);
