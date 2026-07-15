'use strict';
/* The Gilded Needle prototype — title, intro, flashbacks, wardrobe dress-up, sewing minigame */
window.G = window.G || {};

(function () {

  // ---------- text helpers ----------
  function wrapText(ctx, text, maxW) {
    const out = [];
    text.split('\n').forEach(par => {
      const words = par.split(' ');
      let line = '';
      words.forEach(w => {
        const test = line ? line + ' ' + w : w;
        if (ctx.measureText(test).width > maxW && line) { out.push(line); line = w; }
        else line = test;
      });
      out.push(line);
    });
    return out;
  }

  function drawPageOverlay(ctx, opts) {
    // sepia memory backdrop
    const g = ctx.createRadialGradient(G.W / 2, G.H / 2, 80, G.W / 2, G.H / 2, Math.max(G.W, G.H) * 0.75);
    g.addColorStop(0, opts.warm ? '#4a3520' : '#40301e');
    g.addColorStop(1, '#1c120a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, G.W, G.H);
    // film grain flicker
    ctx.fillStyle = `rgba(255,230,190,${0.02 + Math.random() * 0.015})`;
    ctx.fillRect(0, 0, G.W, G.H);
  }

  function drawCenteredPage(ctx, title, text, footer, t) {
    if (title) {
      ctx.font = 'italic 30px Georgia, serif';
      ctx.fillStyle = '#e8c88a';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(title, G.W / 2, G.H * 0.22);
    }
    ctx.font = '21px Georgia, serif';
    ctx.fillStyle = '#f3e3c2';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const lines = wrapText(ctx, text, Math.min(640, G.W * 0.8));
    const lh = 32;
    const y0 = G.H / 2 - (lines.length - 1) * lh / 2;
    lines.forEach((l, i) => ctx.fillText(l, G.W / 2, y0 + i * lh));
    if (footer) {
      ctx.font = 'italic 15px Georgia, serif';
      ctx.fillStyle = `rgba(232,200,138,${0.5 + Math.sin(t * 3) * 0.3})`;
      ctx.fillText(footer, G.W / 2, G.H * 0.87);
    }
  }

  // ---------- TITLE ----------
  G.modes.title = {
    t: 0,
    enter() { this.t = 0; G.UI.showHUD(false); },
    update(dt) {
      this.t += dt;
      G.updateFade(dt);
      if (G.Fade.dir !== 0) return;
      if (G.Input.mouse.clicked || G.Input.pressed('Space') || G.Input.pressed('Enter')) {
        G.Audio.play('bell');
        G.transition(() => {
          if (!G.S.introSeen) G.setMode('intro');
          else G.setMode('exterior', {});
        });
      }
      if (G.Input.pressed('KeyR')) { G.resetSave(); G.UI.toast('Save reset.'); G.UI.updateHUD(); }
    },
    draw(ctx) {
      // cover-fit exterior as backdrop
      const img = G.images.exterior;
      const s = Math.max(G.W / G.EXTERIOR.w, G.H / G.EXTERIOR.h);
      ctx.filter = 'blur(3px) brightness(0.65) sepia(0.25)';
      ctx.drawImage(img, (G.W - G.EXTERIOR.w * s) / 2, (G.H - G.EXTERIOR.h * s) / 2, G.EXTERIOR.w * s, G.EXTERIOR.h * s);
      ctx.filter = 'none';

      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = 'italic 20px Georgia, serif';
      ctx.fillStyle = '#d8b880';
      ctx.fillText('— a tailor\'s tale, 1972 —', G.W / 2, G.H * 0.3 - 52);
      ctx.font = 'bold 54px Georgia, serif';
      ctx.fillStyle = '#f7ebd2';
      ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 14;
      ctx.fillText('The Gilded Needle', G.W / 2, G.H * 0.3);
      ctx.shadowBlur = 0;
      ctx.font = '17px Georgia, serif';
      ctx.fillStyle = '#e8d3a8';
      ctx.fillText('🪡  stitch  ·  serve  ·  remember  🪡', G.W / 2, G.H * 0.3 + 46);

      ctx.font = 'italic 19px Georgia, serif';
      ctx.fillStyle = `rgba(255,240,210,${0.55 + Math.sin(this.t * 3) * 0.35})`;
      ctx.fillText('click to begin', G.W / 2, G.H * 0.78);
      ctx.font = '13px Georgia, serif';
      ctx.fillStyle = 'rgba(230,210,180,0.55)';
      ctx.fillText('WASD / arrows to walk · E or click to interact · R here to reset save', G.W / 2, G.H * 0.78 + 30);
      G.drawFade(ctx);
    },
  };

  // ---------- INTRO ----------
  G.modes.intro = {
    page: 0, t: 0,
    enter() { this.page = 0; this.t = 0; G.UI.showHUD(false); },
    update(dt) {
      this.t += dt;
      G.updateFade(dt);
      if (G.Fade.dir !== 0) return;
      if (G.Input.mouse.clicked || G.Input.pressed('Space') || G.Input.pressed('Enter')) {
        G.Audio.play('page');
        this.page++;
        if (this.page >= G.INTRO_PAGES.length) {
          G.S.introSeen = true; G.save();
          G.transition(() => G.setMode('exterior', {}));
        }
      }
    },
    draw(ctx) {
      drawPageOverlay(ctx, {});
      const p = Math.min(this.page, G.INTRO_PAGES.length - 1);
      drawCenteredPage(ctx, p === 0 ? '· prologue ·' : null, G.INTRO_PAGES[p],
        `click ▸  (${p + 1}/${G.INTRO_PAGES.length})`, this.t);
      G.drawFade(ctx);
    },
  };

  // ---------- FLASHBACK ----------
  G.modes.flashback = {
    page: 0, t: 0, mem: null, back: 'interior',
    enter(opts) {
      this.mem = G.MEMORIES[opts.memory];
      this.key = opts.memory;
      this.back = opts.back || 'interior';
      this.page = 0; this.t = 0;
      G.UI.showHUD(false);
      G.Audio.play('memory');
    },
    update(dt) {
      this.t += dt;
      G.updateFade(dt);
      if (G.Fade.dir !== 0) return;
      if (G.Input.mouse.clicked || G.Input.pressed('Space') || G.Input.pressed('Enter')) {
        G.Audio.play('page');
        this.page++;
        if (this.page >= this.mem.pages.length) {
          G.S.memoriesSeen[this.key] = true;
          G.S.coins += this.mem.reward;
          G.save();
          const r = this.mem.reward;
          G.transition(() => {
            G.setMode(this.back, {});
            G.UI.showHUD(true);
            G.UI.coinToast(r);
            G.UI.toast(`📖 Memory kept: "${this.mem.title}"`);
          });
        }
      }
    },
    draw(ctx) {
      drawPageOverlay(ctx, { warm: true });
      const p = Math.min(this.page, this.mem.pages.length - 1);
      drawCenteredPage(ctx, `· ${this.mem.title} ·`, this.mem.pages[p],
        `click ▸  (${p + 1}/${this.mem.pages.length})`, this.t);
      G.drawFade(ctx);
    },
  };

  // ---------- WARDROBE dress-up ----------
  G.modes.wardrobe = {
    t: 0, order: null, back: 'interior', tries: 0,
    feedback: '', feedbackT: 0, done: false, sparkles: [],

    enter(opts) {
      this.t = 0;
      this.order = opts.order || null;
      this.back = opts.back || 'interior';
      this.tries = 0; this.done = false;
      this.sparkles = [];
      this.feedback = this.order ? '' : 'Just browsing — every top has a story.';
      this.feedbackT = 3;
      G.UI.showHUD(false);
    },

    view() {
      const w = 1122, h = 1402;
      const s = Math.min(G.W / w, (G.H - 90) / h);
      return { s, ox: (G.W - w * s) / 2, oy: 80 + (G.H - 90 - h * s) / 2 };
    },

    cellAt(ix, iy) {
      const GR = G.WARDROBE_GRID;
      for (const top of G.TOPS) {
        if (Math.abs(ix - top.x) < GR.cellW / 2 && Math.abs(iy - top.y) < GR.cellH / 2) return top;
      }
      return null;
    },

    topName(top) {
      return `${top.color} ${top.pattern} ${top.style} top`;
    },

    matches(top) {
      const w = this.order.want;
      return top.color === w.color && top.pattern === w.pattern && (!w.style || top.style === w.style);
    },

    update(dt) {
      this.t += dt;
      G.updateFade(dt);
      this.feedbackT -= dt;
      this.sparkles.forEach(s => { s.y -= 40 * dt; s.a -= dt * 0.8; });
      this.sparkles = this.sparkles.filter(s => s.a > 0);
      if (G.Fade.dir !== 0 || this.done || G.UI.busy()) return;

      if (G.Input.pressed('Escape')) { this.close(); return; }

      if (G.Input.mouse.clicked) {
        const v = this.view();
        const mx = G.Input.mouse.x, my = G.Input.mouse.y;
        // close button
        if (mx > G.W - 70 && my < 66) { this.close(); return; }
        const ix = (mx - v.ox) / v.s, iy = (my - v.oy) / v.s;
        const top = this.cellAt(ix, iy);
        if (!top) return;
        if (!this.order) {
          G.Audio.play('click');
          this.feedback = `A ${this.topName(top)} — one of Grandmother Brida's patterns.`;
          this.feedbackT = 3;
          return;
        }
        if (this.matches(top)) {
          this.done = true;
          G.Audio.play('success');
          this.feedback = `Perfect — the ${this.topName(top)}!`;
          this.feedbackT = 99;
          for (let i = 0; i < 26; i++) {
            this.sparkles.push({
              x: v.ox + (top.x + (Math.random() - 0.5) * 130) * v.s,
              y: v.oy + (top.y + (Math.random() - 0.5) * 150) * v.s,
              a: 1 + Math.random() * 0.5,
            });
          }
          const order = this.order;
          const quality = this.tries === 0 ? 'perfect' : this.tries <= 2 ? 'fine' : 'rough';
          setTimeout(() => {
            G.transition(() => {
              G.setMode(this.back, {});
              G.UI.showHUD(true);
              order.status = 'sewn';
              G.modes.interior.orderCompleted(order, quality);
            });
          }, 1100);
        } else {
          this.tries++;
          G.Audio.play('error');
          this.feedback = `Hmm — that's ${top.color} ${top.pattern}. They asked for ${this.order.wantText}.`;
          this.feedbackT = 3.5;
        }
      }
    },

    close() {
      G.Audio.play('click');
      G.transition(() => { G.setMode(this.back, {}); G.UI.showHUD(true); });
    },

    draw(ctx) {
      // dim backdrop
      ctx.fillStyle = '#241708';
      ctx.fillRect(0, 0, G.W, G.H);
      const v = this.view();
      ctx.drawImage(G.images.wardrobe, v.ox, v.oy, 1122 * v.s, 1402 * v.s);

      // hover highlight
      if (!this.done) {
        const ix = (G.Input.mouse.x - v.ox) / v.s, iy = (G.Input.mouse.y - v.oy) / v.s;
        const top = this.cellAt(ix, iy);
        if (top) {
          const GR = G.WARDROBE_GRID;
          ctx.save();
          G.rrect(ctx, v.ox + (top.x - GR.cellW / 2) * v.s, v.oy + (top.y - GR.cellH / 2) * v.s,
            GR.cellW * v.s, GR.cellH * v.s, 10);
          ctx.strokeStyle = 'rgba(255,220,140,0.95)';
          ctx.lineWidth = 3;
          ctx.shadowColor = 'rgba(255,220,140,0.8)'; ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.restore();
          // name tag near cursor
          ctx.font = 'italic 14px Georgia, serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          const label = this.topName(top);
          const tw = ctx.measureText(label).width;
          const lx = G.clamp(G.Input.mouse.x, tw / 2 + 14, G.W - tw / 2 - 14);
          G.rrect(ctx, lx - tw / 2 - 9, G.Input.mouse.y - 44, tw + 18, 24, 12);
          ctx.fillStyle = 'rgba(46,31,19,0.92)'; ctx.fill();
          ctx.fillStyle = '#f3e3c2';
          ctx.fillText(label, lx, G.Input.mouse.y - 32);
        }
      }

      // sparkles
      this.sparkles.forEach(s => {
        ctx.fillStyle = `rgba(255,235,160,${Math.min(1, s.a)})`;
        ctx.font = '18px serif';
        ctx.fillText('✦', s.x, s.y);
      });

      // top banner
      const banner = this.order
        ? `👗 For ${this.order.name}:  find ${this.order.wantText}`
        : '👗 The Wardrobe — click any top to admire it';
      ctx.font = '20px Georgia, serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const bw = ctx.measureText(banner).width;
      G.rrect(ctx, G.W / 2 - bw / 2 - 20, 16, bw + 40, 44, 20);
      ctx.fillStyle = 'rgba(46,31,19,0.92)'; ctx.fill();
      ctx.strokeStyle = '#c8a05e'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#f7ebd2';
      ctx.fillText(banner, G.W / 2, 39);

      // close button
      G.rrect(ctx, G.W - 62, 16, 44, 44, 12);
      ctx.fillStyle = 'rgba(46,31,19,0.92)'; ctx.fill();
      ctx.strokeStyle = '#c8a05e'; ctx.stroke();
      ctx.fillStyle = '#f3e3c2';
      ctx.font = '20px Georgia, serif';
      ctx.fillText('✕', G.W - 40, 39);

      // feedback line
      if (this.feedback && this.feedbackT > 0) {
        ctx.font = 'italic 17px Georgia, serif';
        const fw = ctx.measureText(this.feedback).width;
        G.rrect(ctx, G.W / 2 - fw / 2 - 16, G.H - 58, fw + 32, 36, 16);
        ctx.fillStyle = 'rgba(46,31,19,0.92)'; ctx.fill();
        ctx.strokeStyle = '#c8a05e'; ctx.stroke();
        ctx.fillStyle = '#ffe9bd';
        ctx.fillText(this.feedback, G.W / 2, G.H - 40);
      }
      G.drawFade(ctx);
    },
  };

  // ---------- SEWING minigame ----------
  G.modes.sewing = {
    t: 0, order: null, back: 'interior',
    phase: 'cut', mistakes: 0,
    cutIdx: 0, stitches: 0, stitchNeed: 5, marker: 0, markerDir: 1,
    resultT: 0, quality: 'fine',

    // local-space cut points (panel is 460x420)
    CUT_PTS: [[150, 60], [310, 60], [352, 168], [408, 360], [52, 360], [108, 168]],

    enter(opts) {
      this.t = 0;
      this.order = opts.order;
      this.back = opts.back || 'interior';
      this.phase = 'cut';
      this.mistakes = 0; this.cutIdx = 0;
      this.stitches = 0;
      this.stitchNeed = G.S.upgrades.machine ? 4 : 5;
      this.marker = 0; this.markerDir = 1;
      this.resultT = 0;
      G.UI.showHUD(false);
    },

    panel() {
      const pw = Math.min(560, G.W * 0.9), ph = Math.min(560, G.H * 0.86);
      return { x: (G.W - pw) / 2, y: (G.H - ph) / 2, w: pw, h: ph };
    },

    fabricPattern(ctx) {
      const f = G.FABRICS[this.order.fabric];
      const c = document.createElement('canvas');
      c.width = c.height = 26;
      const g = c.getContext('2d');
      g.fillStyle = f.alt; g.fillRect(0, 0, 26, 26);
      g.fillStyle = f.color + 'aa';
      g.fillRect(0, 0, 26, 13);
      g.fillRect(0, 0, 13, 26);
      return ctx.createPattern(c, 'repeat');
    },

    update(dt) {
      this.t += dt;
      G.updateFade(dt);
      if (G.Fade.dir !== 0 || G.UI.busy()) return;

      if (this.phase === 'cut') {
        if (G.Input.mouse.clicked) {
          const P = this.panel();
          const sx = P.w / 460, sy0 = (P.h - 120) / 420;
          const r = (G.S.upgrades.shears ? 30 : 22) * sx;
          const mx = G.Input.mouse.x, my = G.Input.mouse.y;
          // which point was clicked?
          let hit = -1;
          this.CUT_PTS.forEach((p, i) => {
            const px = P.x + p[0] * sx, py = P.y + 96 + p[1] * sy0;
            if (Math.hypot(mx - px, my - py) < Math.max(r, 24)) hit = i;
          });
          if (hit === this.cutIdx) {
            G.Audio.play('snip');
            this.cutIdx++;
            if (this.cutIdx >= this.CUT_PTS.length) this.phase = 'stitch';
          } else if (hit >= 0) {
            G.Audio.play('error');
            this.mistakes++;
          }
        }
      } else if (this.phase === 'stitch') {
        const speed = 0.9 + this.stitches * 0.12;
        this.marker += this.markerDir * speed * dt;
        if (this.marker > 1) { this.marker = 1; this.markerDir = -1; }
        if (this.marker < 0) { this.marker = 0; this.markerDir = 1; }
        if (G.Input.mouse.clicked || G.Input.pressed('Space')) {
          const half = (G.S.upgrades.machine ? 0.13 : 0.09);
          if (Math.abs(this.marker - 0.5) < half) {
            G.Audio.play('stitch');
            this.stitches++;
            if (this.stitches >= this.stitchNeed) {
              this.phase = 'done';
              this.quality = this.mistakes === 0 ? 'perfect' : this.mistakes <= 2 ? 'fine' : 'rough';
              this.resultT = 0;
              G.Audio.play('success');
            }
          } else {
            G.Audio.play('error');
            this.mistakes++;
          }
        }
      } else if (this.phase === 'done') {
        this.resultT += dt;
        if (this.resultT > 0.9 && (G.Input.mouse.clicked || G.Input.pressed('Space'))) {
          const order = this.order, quality = this.quality;
          G.transition(() => {
            G.setMode(this.back, {});
            G.UI.showHUD(true);
            order.status = 'sewn';
            G.modes.interior.orderCompleted(order, quality);
          });
        }
      }
    },

    draw(ctx) {
      // dim interior behind
      ctx.fillStyle = '#241708';
      ctx.fillRect(0, 0, G.W, G.H);
      const P = this.panel();

      // wooden work panel
      G.rrect(ctx, P.x - 14, P.y - 14, P.w + 28, P.h + 28, 18);
      ctx.fillStyle = '#5c3c20'; ctx.fill();
      G.rrect(ctx, P.x, P.y, P.w, P.h, 12);
      ctx.fillStyle = '#3f5a3a'; ctx.fill();          // cutting mat green
      ctx.strokeStyle = '#2c4028'; ctx.lineWidth = 2;
      for (let gx = P.x + 26; gx < P.x + P.w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, P.y); ctx.lineTo(gx, P.y + P.h); ctx.stroke(); }
      for (let gy = P.y + 26; gy < P.y + P.h; gy += 26) { ctx.beginPath(); ctx.moveTo(P.x, gy); ctx.lineTo(P.x + P.w, gy); ctx.stroke(); }

      // header
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '20px Georgia, serif';
      ctx.fillStyle = '#f7ebd2';
      const f = G.FABRICS[this.order.fabric];
      const title = this.phase === 'cut' ? `✂️  Cut the ${this.order.garment} — snip the pins in order`
        : this.phase === 'stitch' ? `🪡  Stitch the seam — click when the needle is in the gold`
        : `✨  ${this.quality === 'perfect' ? 'Perfect!' : this.quality === 'fine' ? 'Nicely done.' : 'A little crooked...'}`;
      ctx.fillText(title, G.W / 2, P.y + 34);
      ctx.font = 'italic 14px Georgia, serif';
      ctx.fillStyle = '#d8c39a';
      ctx.fillText(`${f.name} · for ${this.order.name} · mistakes: ${this.mistakes}`, G.W / 2, P.y + 62);

      const sx = P.w / 460, sy0 = (P.h - 120) / 420;
      const lx = (x) => P.x + x * sx, ly = (y) => P.y + 96 + y * sy0;

      if (this.phase === 'cut') {
        // fabric silhouette
        ctx.save();
        ctx.beginPath();
        const pts = this.CUT_PTS;
        ctx.moveTo(lx(pts[0][0]), ly(pts[0][1]));
        ctx.quadraticCurveTo(lx(230), ly(20), lx(pts[1][0]), ly(pts[1][1]));
        for (let i = 2; i < pts.length; i++) ctx.lineTo(lx(pts[i][0]), ly(pts[i][1]));
        ctx.closePath();
        ctx.fillStyle = this.fabricPattern(ctx);
        ctx.fill();
        ctx.setLineDash([9, 7]);
        ctx.strokeStyle = '#fdf3dd'; ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
        // pins
        const r = (G.S.upgrades.shears ? 30 : 22) * Math.min(sx, 1.4);
        pts.forEach((p, i) => {
          const px = lx(p[0]), py = ly(p[1]);
          if (i < this.cutIdx) {
            ctx.fillStyle = 'rgba(120,200,120,0.85)';
            ctx.beginPath(); ctx.arc(px, py, r * 0.55, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = `${Math.round(r * 0.7)}px serif`;
            ctx.fillText('✓', px, py);
          } else {
            const active = i === this.cutIdx;
            const pulse = active ? (Math.sin(this.t * 5) + 1) / 2 : 0;
            ctx.fillStyle = active ? `rgba(255,220,120,${0.85 + pulse * 0.15})` : 'rgba(253,243,221,0.75)';
            ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(px, py, active ? r * (0.8 + pulse * 0.2) : r * 0.62, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#4a300f';
            ctx.font = `bold ${Math.round(r * 0.75)}px Georgia, serif`;
            ctx.fillText(String(i + 1), px, py + 1);
          }
        });
      } else if (this.phase === 'stitch') {
        // fabric strip with seam
        const fy = ly(120), fh = 160 * sy0;
        ctx.fillStyle = this.fabricPattern(ctx);
        G.rrect(ctx, lx(30), fy, (460 - 60) * sx, fh, 8);
        ctx.fill();
        ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 2; ctx.stroke();
        // seam line + done stitches
        const seamY = fy + fh / 2;
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath(); ctx.moveTo(lx(50), seamY); ctx.lineTo(lx(410), seamY); ctx.stroke();
        ctx.setLineDash([]);
        for (let i = 0; i < this.stitches; i++) {
          const px = lx(70 + i * (320 / this.stitchNeed));
          ctx.strokeStyle = '#4a300f'; ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(px - 7, seamY - 7); ctx.lineTo(px + 7, seamY + 7);
          ctx.moveTo(px + 7, seamY - 7); ctx.lineTo(px - 7, seamY + 7);
          ctx.stroke();
        }
        // timing bar
        const by = ly(330), bw = 360 * sx, bx = lx(50), bh = 26;
        G.rrect(ctx, bx, by, bw, bh, 13);
        ctx.fillStyle = 'rgba(30,20,10,0.7)'; ctx.fill();
        const half = (G.S.upgrades.machine ? 0.13 : 0.09);
        ctx.fillStyle = 'rgba(242,193,78,0.85)';
        G.rrect(ctx, bx + bw * (0.5 - half), by + 3, bw * half * 2, bh - 6, 10);
        ctx.fill();
        // marker needle
        const mx = bx + bw * this.marker;
        ctx.fillStyle = '#fdf3dd';
        ctx.beginPath();
        ctx.moveTo(mx, by - 8); ctx.lineTo(mx - 7, by - 20); ctx.lineTo(mx + 7, by - 20);
        ctx.closePath(); ctx.fill();
        ctx.fillRect(mx - 2, by - 8, 4, bh + 16);
        // progress
        ctx.font = '15px Georgia, serif';
        ctx.fillStyle = '#f3e3c2';
        ctx.fillText(`${this.stitches} / ${this.stitchNeed} stitches  ·  Space or click`, G.W / 2, by + 58);
      } else {
        // result: show simple finished garment
        ctx.font = '84px serif';
        ctx.fillText('👗', G.W / 2, G.H / 2 - 8);
        ctx.font = 'italic 17px Georgia, serif';
        ctx.fillStyle = '#f3e3c2';
        ctx.fillText(`One ${this.order.garment} in ${f.name}.`, G.W / 2, G.H / 2 + 62);
        if (this.resultT > 0.9) {
          ctx.fillStyle = `rgba(232,200,138,${0.5 + Math.sin(this.t * 3) * 0.3})`;
          ctx.font = 'italic 15px Georgia, serif';
          ctx.fillText('click to hand it over ▸', G.W / 2, G.H / 2 + 96);
        }
      }
      G.drawFade(ctx);
    },
  };

})();
