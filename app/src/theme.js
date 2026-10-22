'use strict';
// Темы оформления и живой фон. Цвет медленно перетекает, как краска в воде: без пульса и вспышек,
// потому что внимание цепляет начало движения, а не плавное течение (Abrams & Christ, 2003).
// Цвет переливается на всё окно; пока играет музыка, перелив вдобавок следует за звуком.

const THEMES = {
  tide: { name: 'Прилив', mode: 0,
    v: { bg: '#04141a', text: '#e3f4f1', muted: '#86aaa5', f1: '#33d1b2', f2: '#4aa3f0', r1: '#ffc56e', r2: '#ff8e6e', on: '#04201b' },
    focus: ['#0b7f74', '#1b8fb5', '#1d3fa8', '#36d0b0'], rest: ['#a8521a', '#c46a2a', '#9a3a58', '#f0b050'] },
  deep: { name: 'Глубина', mode: 1,
    v: { bg: '#060b1a', text: '#e7edfc', muted: '#8c99ba', f1: '#5bb2ff', f2: '#8a7dff', r1: '#ffb27e', r2: '#f28aa6', on: '#06122a' },
    focus: ['#1c3fb8', '#1691c9', '#5a46d6', '#4fb4ff'], rest: ['#b04a2a', '#c0507a', '#d08a30', '#ffb070'] },
  indigo: { name: 'Индиго', mode: 0,
    v: { bg: '#0b0a1b', text: '#ece9ff', muted: '#9f98c9', f1: '#9a8cff', f2: '#d08cff', r1: '#ffb0d0', r2: '#ffc38a', on: '#160e33' },
    focus: ['#4a34c8', '#8a3ccc', '#2f4fd0', '#c070e0'], rest: ['#c04478', '#d06a3a', '#a83a9a', '#f0a060'],
    // В фокусе фон переливается всеми «рабочими» холодными цветами сразу: фиолетовый, синий, лазурь,
    // бирюза, зелёный. Цвета плавно перетекают по кругу. Фон тёмный: возбуждение сильнее всего
    // зависит от насыщенности и яркости (Valdez & Mehrabian, 1994; Wilms & Oberfeld, 2018).
    // Тёплые оставлены для перерыва: синий и оранжевый различимы краем глаза (Mullen & Kingdom, 2002).
    spectrum: ['#4a34c8', '#7a3fe0', '#2f4fd0', '#1691c9', '#0fa3b8', '#0b8f7a', '#2fae78'] },
  amber: { name: 'Янтарь', mode: 3,
    v: { bg: '#110d0a', text: '#f4ede3', muted: '#aba192', f1: '#ffb547', f2: '#ff7a45', r1: '#8fe3b0', r2: '#5fd0c8', on: '#2a1404' },
    focus: ['#b8500e', '#d07a1a', '#7a2410', '#f2b04e'], rest: ['#127a5a', '#1a8a7a', '#0e5a44', '#7ad0a0'] },
  spectrum: { name: 'Спектр', mode: 0,
    v: { bg: '#060c18', text: '#e8eefa', muted: '#8e9bb5', f1: '#33d1b2', f2: '#4aa3f0', r1: '#ffc56e', r2: '#ff8e6e', on: '#06122a' },
    // Фокус по очереди проходит бирюзу, синий и индиго; тёплые цвета оставлены для перерыва.
    cycle: [
      { pal: ['#0b7f74', '#1b8fb5', '#1d3fa8', '#36d0b0'], acc: ['#33d1b2', '#4aa3f0'] },
      { pal: ['#1c3fb8', '#1691c9', '#5a46d6', '#4fb4ff'], acc: ['#5bb2ff', '#8a7dff'] },
      { pal: ['#4a34c8', '#8a3ccc', '#2f4fd0', '#c070e0'], acc: ['#9a8cff', '#d08cff'] }
    ],
    focus: ['#0b7f74', '#1b8fb5', '#1d3fa8', '#36d0b0'], rest: ['#a8521a', '#c46a2a', '#9a3a58', '#f0b050'] }
};
const SPECTRUM_STEP_SEC = 300;   // «Спектр»: 5 минут на переход между цветами — полный круг за 15 минут
// Перелив в фокусе: цвет сдвигается на соседний за 60 с, полный круг ≈ 7 мин. Плавную смену цвета
// за 12 с люди часто не замечали вовсе (Simons, Franconeri & Reimer, 2000) — это нижняя граница. Так как
// меняются сразу четыре цвета фона, берём с большим запасом: живость дают волны, а не смена цвета.
const FLOW_STEP_SEC = 60;

const VS = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }';
const FS = `
precision highp float;
uniform vec2 res; uniform float t; uniform float e; uniform float light; uniform float wv; uniform float mini; uniform int mode; uniform vec2 ctr;
uniform vec3 bg, c0, c1, c2, c3;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0., a = .5; mat2 m = mat2(1.6,1.2,-1.2,1.6);
  for (int i=0;i<5;i++){ v += a*noise(p); p = m*p; a *= .5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / res;
  vec2 asp = vec2(res.x/res.y, 1.);
  vec2 p = uv * asp * 1.6;
  vec2 q = vec2(fbm(p + vec2(0., t*.05)), fbm(p + vec2(5.2,1.3) - t*.04));
  // Форма волн от звука не зависит: изменение закручивания перестраивает весь узор и выглядит дёргано.
  vec2 r = vec2(fbm(p + 2.6*q + vec2(1.7,9.2) + t*.06), fbm(p + 2.6*q + vec2(8.3,2.8) - t*.05));
  float f = fbm(p + 2.4*r);

  vec3 col = mix(c0, c1, smoothstep(.25,.75,f));
  col = mix(col, c2, smoothstep(.35,.95,length(q)) * .85);
  col = mix(col, c3, smoothstep(.55,.9,r.y) * .9);

  // Звук делает волны выразительнее: громко — перелив контрастнее и сочнее, тихо — мягче и бледнее.
  col = mix(col, mix(col, c3, smoothstep(.45,.85,f)), .35*wv);
  float m;
  if (mode == 0) {
    float rad = length((uv - ctr) * asp);
    m = (.3 + .6*smoothstep(.3,.85,f)) * (1. - .5*smoothstep(.15,.85,rad));
  } else if (mode == 1) {
    m = smoothstep(.3, .95, uv.y + .35*(f-.5) + .15*(r.x-.5));
  } else if (mode == 2) {
    float rad = length((uv - ctr) * asp) + .22*(r.x-.5) + .12*(f-.5);
    m = 1. - smoothstep(.12, .48, rad);
  } else {
    m = smoothstep(.75, .05, uv.y + .35*(f-.5) + .15*(r.y-.5));
  }

  // Мини-плашка узкая и широкая: перелив растекается по всей полосе, без затухания к краям.
  m = mix(m, .4 + .55*smoothstep(.25,.8,f), mini);

  // Тишина: цвет собирается в небольшое тусклое облако за таймером.
  float rq = length((uv - ctr) * asp) + .14*(f-.5) + .08*(r.x-.5);
  m = mix((1. - smoothstep(.06, .38, rq)) * .75, m, e);
  col = mix(vec3(dot(col, vec3(.299,.587,.114))), col, .4 + .6*e);

  // Тонкие светящиеся нити, как дым; под музыку они ярче.
  float iso = abs(fract(f*2. + q.x*.5) - .5) * 2.;
  float wisp = pow(iso, 18.) * smoothstep(.45,.85,length(r)) * smoothstep(.3,.7,f) * smoothstep(.3,1.,e) * (.45 + 1.1*wv);

  float a = clamp(m * (.8 + .25*wv), 0., 1.);
  vec3 outc = mix(bg, col, a) + mix(c3, vec3(1.), .35) * wisp * a * .4;
  // Источник света за таймером: под музыку плавно разгорается на громком и гаснет на тихом.
  float d = length((uv - ctr) * asp) / (1. + 1.5*mini);
  float glow = exp(-d*d / .1) * .3 + exp(-d*d / .02) * .08;
  outc += mix(c1, c3, .5) * glow * light * .6;
  gl_FragColor = vec4(outc, 1.);
}`;

const FocusFx = (() => {
  const hex = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255); };
  const toHex = c => '#' + c.map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
  const lerp = (a, b, t) => a + (b - a) * t;
  const lerp3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let theme = THEMES.indigo, themeId = 'indigo';
  let pal = null;                                  // текущие цвета темы в виде чисел
  const want = { rest: false, energy: 0, focus: false };
  let mix = 0, energy = 0, flowT = Math.random() * 50, last = 0, accTick = 0;
  let ctr = [.5, .62];
  let fmix = 0;                                  // 0 — спокойный цвет темы, 1 — перелив спектра (идёт фокус)
  // Звук из Windows: уровень приходит 20 раз в секунду. Автоусиление подстраивается под тихие
  // и громкие треки; огибающая быстро поднимается и медленно спадает, поэтому нет мерцания.
  const snd = { level: 0, peak: .02, floor: 0, env: 0, wave: 0, pace: 0, at: 0 };
  // Положение уровня между обычной тишиной и пиками трека, 0…1. Диапазон не уже трети пика,
  // чтобы ровный трек не раздувал случайные колебания.
  const norm = (v, lo, hi) => Math.max(0, Math.min(1, (v - lo) / Math.max(hi - lo, hi * .35, .005)));

  const canvas = document.getElementById('fx');
  let gl = null, u = {};
  try {
    gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (gl) {
      const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
      const pr = gl.createProgram();
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error('shader');
      gl.useProgram(pr);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pr, 'p');
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['res', 't', 'e', 'light', 'wv', 'mini', 'mode', 'ctr', 'bg', 'c0', 'c1', 'c2', 'c3'].forEach(n => u[n] = gl.getUniformLocation(pr, n));
    }
  } catch { gl = null; }
  if (!gl) canvas.hidden = true;                   // без WebGL остаётся просто цвет фона темы

  function setTheme(id) {
    themeId = THEMES[id] ? id : 'indigo';
    theme = THEMES[themeId];
    Object.entries(theme.v).forEach(([k, v]) => root.style.setProperty('--' + k, v));
    titlebar();
    pal = {
      bg: hex(theme.v.bg), focus: theme.focus.map(hex), rest: theme.rest.map(hex),
      cycle: theme.cycle && theme.cycle.map(c => ({ pal: c.pal.map(hex), acc: c.acc.map(hex) })),
      spectrum: theme.spectrum && theme.spectrum.map(hex)
    };
    if (reduce) draw(performance.now());
  }

  // Верхняя полоса окна Windows — в цвет фона темы.
  function titlebar() {
    window.__TAURI__?.core?.invoke('set_titlebar', { bg: theme.v.bg, text: theme.v.text }).catch(() => {});
  }

  // Холст рисуется в половинном разрешении: перелив мягкий, а видеокарте легко.
  function resize() {
    const w = Math.max(1, Math.round(innerWidth * .5)), h = Math.max(1, Math.round(innerHeight * .5));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }

  // Центр облака — середина видимого таймера; на экранах без таймера — верхняя треть окна.
  function locate() {
    // В мини-окне кольца нет: свет — за цифрами слева.
    if (document.body.classList.contains('mini')) { ctr = [.25, .5]; return; }
    const ring = [...document.querySelectorAll('.ring-wrap')].find(el => el.offsetParent);
    if (!ring) { ctr = [.5, .66]; return; }
    const r = ring.getBoundingClientRect();
    ctr = [(r.left + r.width / 2) / innerWidth, 1 - (r.top + r.height / 2) / innerHeight];
  }

  function focusPalette(now) {
    // Перелив в фокусе: четыре цвета фона идут по кругу спектра со сдвигом друг от друга.
    if (pal.spectrum) {
      const S = pal.spectrum, n = S.length, s0 = now / 1000 / FLOW_STEP_SEC;
      const at = x => { const i = Math.floor(x), k = x - i, a = ((i % n) + n) % n; return lerp3(S[a], S[(a + 1) % n], k * k * (3 - 2 * k)); };
      const spec = [0, 1.7, 3.4, 5.1].map(o => at(s0 + o));
      const light = c => lerp3(c, [1, 1, 1], .38);
      return {
        colors: pal.focus.map((c, i) => lerp3(c, spec[i], fmix)),
        acc: [lerp3(hex(theme.v.f1), light(at(s0 + .8)), fmix), lerp3(hex(theme.v.f2), light(at(s0 + 2.5)), fmix)].map(toHex)
      };
    }
    if (!pal.cycle) return { colors: pal.focus };
    const n = pal.cycle.length, s = now / 1000 / SPECTRUM_STEP_SEC;
    const i = Math.floor(s) % n, j = (i + 1) % n, x = s % 1, k = x * x * (3 - 2 * x);
    const colors = pal.cycle[i].pal.map((c, ci) => lerp3(c, pal.cycle[j].pal[ci], k));
    const acc = [0, 1].map(a => toHex(lerp3(pal.cycle[i].acc[a], pal.cycle[j].acc[a], k)));
    return { colors, acc };
  }

  function draw(now) {
    const dt = last ? Math.min(.1, (now - last) / 1000) : 0; last = now;
    if (reduce) { mix = want.rest ? 1 : 0; energy = want.energy; }
    else {
      mix += ((want.rest ? 1 : 0) - mix) * (1 - Math.exp(-dt / 1.5));
      const live = want.energy >= .8 && now - snd.at < 1500;   // играет музыка и есть звук
      const follow = (v, x, up, down) => v + (x - v) * (1 - Math.exp(-dt / (x > v ? up : down)));
      // Выразительность волн следует за звуком за ~0,8 с и спадает за ~2,5 с, свет — так же мягко.
      // Скорость течения — только за общим характером музыки, с инерцией в несколько секунд.
      const lv = live ? norm(snd.level, snd.floor, snd.peak) : 0;
      snd.wave = follow(snd.wave, lv, .8, 2.5);
      snd.env = follow(snd.env, lv, .8, 2.5);
      snd.pace = follow(snd.pace, lv, 3, 5);
      // Звук управляет в основном светом; размер пятна и скорость меняются медленно (~2 с),
      // поэтому форма не дёргается. Без данных о звуке (браузер) уровень «дышит» на масштабе фраз.
      const target = live ? .6 + .4 * snd.env
        : want.energy >= .8 ? .85 + .15 * Math.sin(now / 1000 * .7) * Math.sin(now / 1000 * .23) : want.energy;
      // В узкой мини-плашке маленькое облако выглядит пятном — там перелив всегда растекается по всей полосе.
      const floor = document.body.classList.contains('mini') ? .6 : 0;
      energy += (Math.max(floor, target) - energy) * (1 - Math.exp(-dt / (live ? 2 : 1.4)));
      flowT += dt * (.15 + .95 * energy + .45 * snd.pace);   // громкая часть трека — течение чуть быстрее
      fmix += ((want.focus ? 1 : 0) - fmix) * (1 - Math.exp(-dt / 2.5));
    }
    const fp = focusPalette(now);
    if (fp.acc && (++accTick % 30 === 0 || reduce)) {
      root.style.setProperty('--f1', fp.acc[0]); root.style.setProperty('--f2', fp.acc[1]);
    }
    if (!gl || canvas.hidden) return;
    resize();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform1f(u.t, flowT);
    gl.uniform1f(u.e, energy);
    gl.uniform1f(u.light, snd.env);
    gl.uniform1f(u.wv, snd.wave);
    gl.uniform1f(u.mini, document.body.classList.contains('mini') ? 1 : 0);
    gl.uniform1i(u.mode, theme.mode);
    gl.uniform2f(u.ctr, ctr[0], ctr[1]);
    gl.uniform3fv(u.bg, pal.bg);
    ['c0', 'c1', 'c2', 'c3'].forEach((n, i) => gl.uniform3fv(u[n], lerp3(fp.colors[i], pal.rest[i], mix)));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // ~30 кадров в секунду хватает для медленного перелива; в скрытом окне не рисуем.
  let lastFrame = 0;
  function loop(now) {
    requestAnimationFrame(loop);
    if (document.hidden) { last = 0; return; }
    if (now - lastFrame < 32) return;
    lastFrame = now;
    draw(now);
  }

  setInterval(locate, 1000);
  addEventListener('resize', () => { locate(); if (reduce) draw(performance.now()); });
  setTheme('indigo');
  locate();
  if (reduce) draw(performance.now()); else requestAnimationFrame(loop);

  return {
    themes: THEMES,
    get theme() { return themeId; },
    setTheme,
    titlebar,
    // rest — тёплые цвета перерыва; energy: 0 — облако за таймером, 1 — перелив на всё окно;
    // focus — перелив спектра холодных цветов.
    // Уровень звука из Windows (0…1, не нормирован). Второе значение — низкие частоты, пока не нужно.
    audio(level) {
      const now = performance.now(), gap = snd.at ? Math.min(1, (now - snd.at) / 1000) : 0;
      if (!snd.at || gap >= 1) { snd.peak = Math.max(.01, level * 1.5); snd.floor = level; }   // первая порция звука — точка отсчёта
      snd.at = now; snd.level = level;
      // Пик медленно спадает (≈ за 15 с), «пол» медленно поднимается (≈ за 8 с): так фон
      // реагирует на перепады внутри трека, а тихий трек после громкого тоже его «качает».
      const decay = Math.exp(-gap / 15), rise = 1 - Math.exp(-gap / 8);
      snd.peak = Math.max(.01, snd.peak * decay, level);
      snd.floor = level < snd.floor ? level : snd.floor + (level - snd.floor) * rise;
    },
    setState(rest, e, focus = false) {
      if (want.rest === rest && want.energy === e && want.focus === focus) return;
      want.rest = rest; want.energy = e; want.focus = focus;
      root.classList.toggle('rest', rest);
      locate();
      if (reduce) draw(performance.now());
    }
  };
})();
window.FocusFx = FocusFx;
