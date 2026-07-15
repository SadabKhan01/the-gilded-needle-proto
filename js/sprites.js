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

  function isWarmBackdrop(r, g, b, a) {
    return a > 0 && r > 184 && g > 154 && b > 122 && Math.max(r, g, b) - Math.min(r, g, b) < 112;
  }

  // Remove only warm background pixels connected to the crop edge. This keeps
  // similarly coloured skin safely enclosed by the character's painted outline.
  function clearConnectedBackdrop(ctx, w, h) {
    const image = ctx.getImageData(0, 0, w, h);
    const data = image.data;
    const seen = new Uint8Array(w * h);
    const queue = new Int32Array(w * h);
    let head = 0, tail = 0;
    const add = (x, y) => {
      if (x < 0 || y < 0 || x >= w || y >= h) return;
      const p = y * w + x;
      if (seen[p]) return;
      const i = p * 4;
      if (!isWarmBackdrop(data[i], data[i + 1], data[i + 2], data[i + 3])) return;
      seen[p] = 1;
      queue[tail++] = p;
    };
    for (let x = 0; x < w; x++) { add(x, 0); add(x, h - 1); }
    for (let y = 0; y < h; y++) { add(0, y); add(w - 1, y); }
    while (head < tail) {
      const p = queue[head++];
      const x = p % w, y = Math.floor(p / w);
      data[p * 4 + 3] = 0;
      add(x - 1, y); add(x + 1, y); add(x, y - 1); add(x, y + 1);
    }
    ctx.putImageData(image, 0, 0);
  }

  function referenceFrame(img, crop) {
    const source = document.createElement('canvas');
    source.width = crop.w; source.height = crop.h;
    const sg = source.getContext('2d', { willReadFrequently: true });
    sg.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    clearConnectedBackdrop(sg, crop.w, crop.h);

    // Fit the painted figure rather than the surrounding source-cell padding.
    // This gives Mari, Elise, customers and roaming townspeople one consistent
    // apparent height even though their source sheets have different margins.
    const pixels = sg.getImageData(0, 0, crop.w, crop.h).data;
    let minX = crop.w, minY = crop.h, maxX = -1, maxY = -1;
    for (let y = 0; y < crop.h; y++) {
      for (let x = 0; x < crop.w; x++) {
        if (pixels[(y * crop.w + x) * 4 + 3] > 24) {
          minX = Math.min(minX, x); minY = Math.min(minY, y);
          maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
        }
      }
    }
    if (maxX < minX) { minX = 0; minY = 0; maxX = crop.w - 1; maxY = crop.h - 1; }
    const pad = 5;
    minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
    maxX = Math.min(crop.w - 1, maxX + pad); maxY = Math.min(crop.h - 1, maxY + pad);
    const fitW = maxX - minX + 1, fitH = maxY - minY + 1;

    const c = makeCanvas();
    const g = c.getContext('2d');
    const scale = Math.min((BW - 6) / fitW, (BH - 2) / fitH);
    const w = fitW * scale, h = fitH * scale;
    g.drawImage(source, minX, minY, fitW, fitH, (BW - w) / 2, BH - h, w, h);
    return c;
  }

  G.makeReferenceSprite = function (img, crop) {
    const frame = referenceFrame(img, crop);
    const set = { front: [frame, frame, frame], back: [frame, frame, frame], w: BW, h: BH, reference: true };
    return set;
  };

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
      // Exact supplied character-sheet art. The crop is converted to a transparent
      // runtime sprite without altering the reference source file.
      this.mari = G.makeReferenceSprite(G.images.marielle_sheet, { x: 555, y: 105, w: 300, h: 465 });
      this.elise = G.makeReferenceSprite(G.images.elise_sheet, { x: 565, y: 0, w: 280, h: 485 });
      this.customers = [];
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
          this.customers.push(G.makeReferenceSprite(G.images.npc_sheet, {
            x: col * 512, y: row * 512, w: 512, h: 512
          }));
        }
      }
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
    const scale = h / BH;
    const w = set.w * scale, hh = set.h * scale;
    const phase = Math.sin((opts.time || 0) * 11);
    const stride = opts.walking ? phase : 0;
    ctx.save();
    // The shadow and the bottom of the image share feetY: movement sways and
    // leans around that contact point, never lifting the whole character.
    ctx.fillStyle = 'rgba(40,25,10,0.28)';
    ctx.beginPath();
    ctx.ellipse(feetX, feetY + 1, w * (opts.walking ? 0.3 : 0.26), h * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();
    if (opts.walking) {
      ctx.fillStyle = 'rgba(226,199,145,0.34)';
      ctx.beginPath();
      ctx.ellipse(feetX - Math.sign(stride || 1) * w * 0.14, feetY, w * 0.08, h * 0.018, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.translate(feetX + stride * w * 0.018, feetY);
    if (opts.walking) ctx.rotate(stride * 0.018);
    if (opts.flip) { ctx.scale(-1, 1); }
    ctx.drawImage(img, -w / 2, -hh, w, hh);
    ctx.restore();
  };

})();
