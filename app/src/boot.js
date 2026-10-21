'use strict';
// Перед запуском приложения подтягиваем данные из файла на диске (он главный).
// Историю блоков объединяем с той, что могла остаться в хранилище браузерного движка:
// так ни один записанный блок не теряется, даже если раньше данные жили в разных местах.
(async () => {
  const core = window.__TAURI__?.core;
  const KEYS = ['focus.settings.v2', 'focus.history.v2', 'focus.state.v2'];
  const HIST = 'focus.history.v2';
  const parse = s => { try { return JSON.parse(s); } catch { return null; } };

  if (core) {
    let clearedAt = 0;   // когда историю очистили (из настроек; они читаются первыми)
    for (const key of KEYS) {
      try {
        const fromFile = await core.invoke('store_get', { key });
        const old = localStorage.getItem(key);
        let value = fromFile ?? old;
        if (key === HIST) {
          const merged = new Map();
          // Файл — главная копия. Из кэша движка не берём записи, сделанные до очистки истории:
          // кэш мог не успеть записаться и хранить уже стёртое.
          const cached = (parse(old) || []).filter(h => h && h.ts > clearedAt);
          [cached, parse(fromFile)].forEach(list => Array.isArray(list) && list.forEach(h => h && merged.set(h.ts, h)));
          value = JSON.stringify([...merged.values()].sort((a, b) => a.ts - b.ts));
        }
        if (key === KEYS[0]) clearedAt = parse(value)?.histClearedAt || 0;
        if (value == null) continue;
        localStorage.setItem(key, value);
        if (value !== fromFile) await core.invoke('store_set', { key, value });
      } catch {}
    }
  }
  const s = document.createElement('script');
  s.src = 'app.js';
  document.body.append(s);
})();
