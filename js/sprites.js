'use strict';
/* The Gilded Needle prototype — procedural chibi sprites (Mari + customers).
   Each sprite is drawn into an offscreen canvas, base size 128x160, front & back views. */
window.G = window.G || {};

(function () {

  const BW = 128, BH = 160;

  function makeCanvas() {
    const c = document.createElement('canvas');
    c.width = BW; c.height = BH;
    return c;
  }

  /* Draw a chibi character. view: 'front' | 'back'. pose: 0 idle, legs offset for walk. */
  function drawChibi(ctx, opts, view, legShift) {
    const { hair, dress, skin, accent } = opts;
    const cx = BW / 2;
    ctx.clearRect(0, 0, BW, BH);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#3a2a1c';
    ctx.lineJoin = 'round';

    // ---- legs & shoes ----
    const legY = 118, legH = 24;
    const lx = cx - 13, rx = cx + 13;
    const lOff = legShift, rOff = -legShift;
    ctx.fillStyle = skin;
    ctx.fillRect(lx - 5, legY + lOff, 10, legH - Math.abs(lOff));
    ctx.fillRect(rx - 5, legY + rOff, 10, legH - Math.abs(rOff));
    // socks
    ctx.fillStyle = '#fdfdf6';
    ctx.fillRect(lx - 6, legY + legH - 10 + lOff * 0.4, 12, 7);
    ctx.fillRect(rx - 6, legY + legH - 10 + rOff * 0.4, 12, 7);
    // shoes
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.ellipse(lx, legY + legH + 2 + lOff * 0.4, 9, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(rx, legY + legH + 2 + rOff * 0.4, 9, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // ---- dress ----
    ctx.fillStyle = dress;
    ctx.beginPath();
    ctx.moveTo(cx - 16, 88);
    ctx.quadraticCurveTo(cx - 34, 122, cx - 28, 126);
    ctx.quadraticCurveTo(cx, 134, cx + 28, 126);
    ctx.quadraticCurveTo(cx + 34, 122, cx + 16, 88);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // hem frill
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - 26, 122);
    ctx.quadraticCurveTo(cx, 130, cx + 26, 122);
    ctx.stroke();
    ctx.strokeStyle = '#3a2a1c'; ctx.lineWidth = 3;

    // ---- arms ----
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.ellipse(cx - 22, 98, 6, 12, 0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx + 22, 98, 6, 12, -0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // ---- head ----
    const headY = 56, headR = 40;
    // back hair mass
    ctx.fillStyle = hair;
    ctx.beginPath();
    ctx.ellipse(cx, headY + 14, headR + 8, headR + 12, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    // hair strands at sides
    ctx.beginPath(); ctx.ellipse(cx - 38, headY + 32, 11, 26, 0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx + 38, headY + 32, 11, 26, -0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    if (view === 'front') {
      // face
      ctx.fillStyle = skin;
      ctx.beginPath(); ctx.ellipse(cx, headY + 6, headR - 7, headR - 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // bangs
      ctx.fillStyle = hair;
      ctx.beginPath();
      ctx.moveTo(cx - 33, headY + 2);
      ctx.quadraticCurveTo(cx - 30, headY - 32, cx, headY - 34);
      ctx.quadraticCurveTo(cx + 30, headY - 32, cx + 33, headY + 2);
      ctx.quadraticCurveTo(cx + 22, headY - 4, cx + 12, headY + 4);
      ctx.quadraticCurveTo(cx, headY - 8, cx - 12, headY + 4);
      ctx.quadraticCurveTo(cx - 22, headY - 4, cx - 33, headY + 2);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // eyes
      ctx.fillStyle = '#2b2320';
      ctx.beginPath(); ctx.ellipse(cx - 14, headY + 12, 6.5, 8.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 14, headY + 12, 6.5, 8.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx - 16, headY + 9, 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 12, headY + 9, 2.4, 0, Math.PI * 2); ctx.fill();
      // blush
      ctx.fillStyle = 'rgba(233,120,120,0.4)';
      ctx.beginPath(); ctx.ellipse(cx - 24, headY + 20, 6, 3.6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 24, headY + 20, 6, 3.6, 0, 0, Math.PI * 2); ctx.fill();
      // mouth
      ctx.strokeStyle = '#7a4a3a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, headY + 25, 4, 0.2, Math.PI - 0.2); ctx.stroke();
      ctx.strokeStyle = '#3a2a1c'; ctx.lineWidth = 3;
      // hair clip
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.ellipse(cx - 26, headY - 14, 6, 3.4, -0.5, 0, Math.PI * 2); ctx.fill();
    } else {
      // back view: full hair, small ribbon
      ctx.fillStyle = hair;
      ctx.beginPath(); ctx.ellipse(cx, headY + 4, headR - 4, headR - 1, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.ellipse(cx, headY - 22, 8, 4.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
  }

  /* Build a sprite set { front: [idle, stepA, stepB], back: [...] } */
  G.makeSprite = function (opts) {
    const set = { front: [], back: [] };
    ['front', 'back'].forEach(view => {
      [0, 5, -5].forEach(shift => {
        const c = makeCanvas();
        drawChibi(c.getContext('2d'), opts, view, shift);
        set[view].push(c);
      });
    });
    set.w = BW; set.h = BH;
    return set;
  };

  G.Sprites = {
    init() {
      // Mari — brown wavy hair, pink dress, like the wardrobe doll
      this.mari = G.makeSprite({ hair: '#4a2f1d', dress: '#e9a0b4', skin: '#fbe3cd', accent: '#e2738f' });
      this.customers = G.CUSTOMER_LOOKS.map(l =>
        G.makeSprite({ hair: l.hair, dress: l.dress, skin: l.skin, accent: '#8a6a3a' }));
    },
  };

  /* Draw a sprite at feet position (screen coords), given desired pixel height. */
  G.drawSprite = function (ctx, set, feetX, feetY, h, opts) {
    opts = opts || {};
    const view = opts.view || 'front';
    const frames = set[view];
    let idx = 0;
    if (opts.walking) idx = (Math.floor(opts.time * 7) % 2) + 1;
    const img = frames[idx];
    const scale = h / 150;                 // chibi body occupies ~150px of the 160 canvas
    const w = set.w * scale, hh = set.h * scale;
    const bob = opts.walking ? Math.sin(opts.time * 14) * h * 0.012 : Math.sin((opts.time || 0) * 2.2) * h * 0.006;
    ctx.save();
    // soft shadow
    ctx.fillStyle = 'rgba(40,25,10,0.28)';
    ctx.beginPath();
    ctx.ellipse(feetX, feetY, w * 0.26, h * 0.055, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.translate(feetX, feetY - hh * 0.955 + bob);
    if (opts.flip) { ctx.scale(-1, 1); }
    ctx.drawImage(img, -w / 2, 0, w, hh);
    ctx.restore();
  };

})();
