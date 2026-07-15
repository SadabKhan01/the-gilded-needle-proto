'use strict';
/* The Gilded Needle prototype — engine: canvas, input, audio, save, loop */
window.G = window.G || {};

(function () {

  // ---------- canvas ----------
  G.initCanvas = function (id) {
    G.canvas = document.getElementById(id);
    G.ctx = G.canvas.getContext('2d');
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      G.canvas.width = Math.round(window.innerWidth * dpr);
      G.canvas.height = Math.round(window.innerHeight * dpr);
      G.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      G.W = window.innerWidth;
      G.H = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
  };

  // ---------- images ----------
  G.images = {};
  G.loadImages = function (map, done) {
    const keys = Object.keys(map);
    let left = keys.length;
    keys.forEach(k => {
      const img = new Image();
      img.onload = () => { if (--left === 0) done(); };
      img.onerror = () => { console.error('failed to load', map[k]); if (--left === 0) done(); };
      img.src = map[k];
      G.images[k] = img;
    });
  };

  // ---------- input ----------
  const keys = {}, pressedSet = {};
  G.Input = {
    mouse: { x: 0, y: 0, down: false, clicked: false, moved: false },
    down: (c) => !!keys[c],
    pressed: (c) => !!pressedSet[c],
    axis() {
      let x = 0, y = 0;
      if (keys.KeyA || keys.ArrowLeft) x -= 1;
      if (keys.KeyD || keys.ArrowRight) x += 1;
      if (keys.KeyW || keys.ArrowUp) y -= 1;
      if (keys.KeyS || keys.ArrowDown) y += 1;
      const l = Math.hypot(x, y);
      return l > 0 ? { x: x / l, y: y / l } : { x: 0, y: 0 };
    },
    endFrame() {
      for (const k in pressedSet) delete pressedSet[k];
      this.mouse.clicked = false;
    },
  };

  window.addEventListener('keydown', (e) => {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Tab'].includes(e.code)) e.preventDefault();
    if (!keys[e.code]) pressedSet[e.code] = true;
    keys[e.code] = true;
    G.Audio.unlock();
  });
  window.addEventListener('keyup', (e) => { keys[e.code] = false; });

  G.bindMouse = function () {
    const m = G.Input.mouse;
    const pos = (e) => {
      const t = e.touches ? e.touches[0] : e;
      m.x = t.clientX; m.y = t.clientY;
    };
    G.canvas.addEventListener('mousemove', (e) => { pos(e); m.moved = true; });
    G.canvas.addEventListener('mousedown', (e) => { pos(e); m.down = true; G.Audio.unlock(); });
    window.addEventListener('mouseup', () => {
      if (m.down) m.clicked = true;
      m.down = false;
    });
    G.canvas.addEventListener('touchstart', (e) => { pos(e); m.down = true; G.Audio.unlock(); e.preventDefault(); }, { passive: false });
    G.canvas.addEventListener('touchmove', (e) => { pos(e); e.preventDefault(); }, { passive: false });
    G.canvas.addEventListener('touchend', () => { if (m.down) m.clicked = true; m.down = false; });
  };

  // ---------- audio (tiny synth) ----------
  let AC = null;
  G.Audio = {
    unlock() {
      if (!AC) {
        try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
      }
      if (AC.state === 'suspended') AC.resume();
    },
    tone(freq, dur, type, vol, when) {
      if (!AC) return;
      const t = AC.currentTime + (when || 0);
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol || 0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(AC.destination);
      o.start(t); o.stop(t + dur + 0.05);
    },
    play(name) {
      if (!AC) return;
      switch (name) {
        case 'bell':    this.tone(1318, 0.6, 'sine', 0.14); this.tone(1760, 0.8, 'sine', 0.08, 0.09); break;
        case 'coin':    this.tone(880, 0.09, 'square', 0.06); this.tone(1320, 0.16, 'square', 0.06, 0.07); break;
        case 'click':   this.tone(520, 0.05, 'triangle', 0.08); break;
        case 'stitch':  this.tone(1560, 0.05, 'square', 0.05); this.tone(780, 0.05, 'triangle', 0.05, 0.03); break;
        case 'snip':    this.tone(2200, 0.04, 'square', 0.05); this.tone(1400, 0.05, 'square', 0.04, 0.03); break;
        case 'error':   this.tone(180, 0.22, 'sawtooth', 0.07); break;
        case 'success': [660, 880, 990, 1320].forEach((f, i) => this.tone(f, 0.22, 'sine', 0.09, i * 0.09)); break;
        case 'door':    this.tone(220, 0.14, 'triangle', 0.1); this.tone(160, 0.2, 'triangle', 0.08, 0.08); break;
        case 'page':    this.tone(340, 0.08, 'triangle', 0.06); break;
        case 'memory':  [520, 390, 330, 262].forEach((f, i) => this.tone(f, 0.5, 'sine', 0.06, i * 0.22)); break;
      }
    },
  };

  // ---------- save / state ----------
  const SAVE_KEY = 'gilded-needle-proto-v1';
  const DEFAULT_STATE = () => ({
    coins: 20,
    fabrics: { gingham_red: 3, linen_cream: 2, gingham_blue: 1 },
    upgrades: {},
    ordersDone: 0,
    memoriesSeen: {},
    introSeen: false,
    management: {
      day: 1,
      minute: 480,
      cleanliness: 82,
      stress: 18,
      coffeeStock: 6,
      homeComfort: 5,
      trash: [],
      home: {},
      staff: {},
      mother: { health: 82, status: 'working', illDays: 0 },
      bills: {
        rent: { amount: 35, dueDay: 7, period: 7, paid: false },
        electricity: { amount: 16, dueDay: 5, period: 5, paid: false },
      },
      daily: { income: 0, expenses: 0, coffeeIncome: 0, customers: 0 },
      lateBills: 0,
    },
  });
  G.S = DEFAULT_STATE();
  G.save = function () {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(G.S)); } catch (e) {}
  };
  G.load = function () {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) G.S = Object.assign(DEFAULT_STATE(), JSON.parse(raw));
      if (G.Management) G.Management.ensure();
    } catch (e) { G.S = DEFAULT_STATE(); }
  };
  G.resetSave = function () { G.S = DEFAULT_STATE(); G.save(); };

  // ---------- mode manager + loop ----------
  G.modes = {};
  G.mode = null;
  G.modeName = '';
  G.setMode = function (name, opts) {
    G.modeName = name;
    G.mode = G.modes[name];
    if (G.mode.enter) G.mode.enter(opts || {});
  };

  let last = 0;
  function frame(ts) {
    const dt = Math.min((ts - last) / 1000 || 0.016, 0.05);
    last = ts;
    if (G.mode) {
      if (G.mode.update) G.mode.update(dt);
      const ctx = G.ctx;
      ctx.clearRect(0, 0, G.W, G.H);
      if (G.mode.draw) G.mode.draw(ctx);
    }
    G.Input.endFrame();
    requestAnimationFrame(frame);
  }
  G.start = function () { requestAnimationFrame(frame); };

  // helpers
  G.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  G.lerp = (a, b, t) => a + (b - a) * t;
  G.dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
  G.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // rounded rect helper for canvas UI
  G.rrect = function (ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

})();
