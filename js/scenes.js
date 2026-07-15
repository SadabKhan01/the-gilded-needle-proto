'use strict';
/* The Gilded Needle prototype — exterior & interior scenes over the background paintings */
window.G = window.G || {};

(function () {

  // ---------------- shared helpers ----------------

  // screen fade transition
  G.Fade = { a: 0, dir: 0, cb: null };
  G.transition = function (cb) {
    if (G.Fade.dir !== 0) return;
    G.Fade.dir = 1; G.Fade.cb = cb;
  };
  G.updateFade = function (dt) {
    const F = G.Fade;
    if (F.dir === 1) {
      F.a = Math.min(1, F.a + dt * 3);
      if (F.a >= 1) { if (F.cb) F.cb(); F.cb = null; F.dir = -1; }
    } else if (F.dir === -1) {
      F.a = Math.max(0, F.a - dt * 3);
      if (F.a <= 0) F.dir = 0;
    }
  };
  G.drawFade = function (ctx) {
    if (G.Fade.a > 0) {
      ctx.fillStyle = `rgba(20,12,6,${G.Fade.a})`;
      ctx.fillRect(0, 0, G.W, G.H);
    }
  };

  function drawLetterbox(ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, G.H);
    grad.addColorStop(0, '#2e2013');
    grad.addColorStop(0.5, '#3d2b1a');
    grad.addColorStop(1, '#241708');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, G.W, G.H);
  }

  function drawVignette(ctx) {
    const g = ctx.createRadialGradient(G.W / 2, G.H / 2, Math.min(G.W, G.H) * 0.42, G.W / 2, G.H / 2, Math.max(G.W, G.H) * 0.72);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(26,14,4,0.42)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, G.W, G.H);
  }

  // pulsing marker + prompt bubble (screen coords)
  function drawMarker(ctx, sx, sy, t) {
    const p = (Math.sin(t * 3) + 1) / 2;
    ctx.fillStyle = `rgba(255,240,200,${0.25 + p * 0.2})`;
    ctx.beginPath(); ctx.arc(sx, sy, 5 + p * 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(120,80,40,${0.5 + p * 0.3})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function drawPrompt(ctx, sx, sy, icon, label, t) {
    const bob = Math.sin(t * 4) * 3;
    const y = sy - 46 + bob;
    ctx.save();
    ctx.font = '22px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    // bubble
    ctx.fillStyle = 'rgba(253,243,221,0.95)';
    ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(sx, y, 21, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(sx - 6, y + 18); ctx.lineTo(sx, y + 30); ctx.lineTo(sx + 6, y + 18);
    ctx.closePath(); ctx.fillStyle = 'rgba(253,243,221,0.95)'; ctx.fill();
    ctx.fillStyle = '#000';
    ctx.fillText(icon, sx, y + 1);
    // label pill
    ctx.font = 'italic 14px Georgia, serif';
    const tw = ctx.measureText(label).width;
    G.rrect(ctx, sx - tw / 2 - 10, y - 52, tw + 20, 24, 12);
    ctx.fillStyle = 'rgba(46,31,19,0.88)';
    ctx.fill();
    ctx.strokeStyle = '#a8814f'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#f3e3c2';
    ctx.fillText(label + '  (E)', sx, y - 40);
    ctx.restore();
  }

  function drawNamePill(ctx, sx, sy, text) {
    ctx.save();
    ctx.font = 'italic 13px Georgia, serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const tw = ctx.measureText(text).width;
    G.rrect(ctx, sx - tw / 2 - 8, sy - 12, tw + 16, 21, 10);
    ctx.fillStyle = 'rgba(46,31,19,0.75)';
    ctx.fill();
    ctx.fillStyle = '#f3e3c2';
    ctx.fillText(text, sx, sy - 1);
    ctx.restore();
  }

  // ---------------- order factory ----------------
  G.makeSewOrder = function (name, lookIdx, practice) {
    const fabric = G.pick(Object.keys(G.FABRICS));
    const garment = G.pick(G.GARMENTS);
    const pay = practice ? 8 : 12 + Math.floor(Math.random() * 7);
    const text = G.pick(G.SEW_LINES)
      .replace('{garment}', garment)
      .replace('{fabric}', G.FABRICS[fabric].name);
    const order = { kind: 'sew', name, lookIdx, fabric, garment, pay, text, status: 'open', practice: !!practice };
    return G.Management ? G.Management.enrichOrder(order) : order;
  };

  G.makeOutfitOrder = function (name, lookIdx) {
    const top = G.pick(G.TOPS);
    const want = { color: top.color, pattern: top.pattern };
    let wantText = `a ${top.color} ${top.pattern} top`;
    if (Math.random() < 0.4) { want.style = top.style; wantText = `a ${top.color} ${top.pattern} ${top.style} top`; }
    const pay = 10 + Math.floor(Math.random() * 5);
    const text = G.pick(G.OUTFIT_LINES).replace('{want}', wantText);
    const order = { kind: 'outfit', name, lookIdx, want, wantText, pay, text, status: 'open' };
    return G.Management ? G.Management.enrichOrder(order) : order;
  };

  // ---------------- EXTERIOR ----------------
  const Ext = {
    t: 0,
    player: { x: G.EXTERIOR.start.x, flip: false, walking: false },
    target: null,

    enter(opts) {
      this.t = 0;
      this.player.x = opts.fromDoor ? G.EXTERIOR.hotspots[0].x : G.EXTERIOR.start.x;
      this.target = null;
      G.UI.showHUD(true);
      if (!this._welcomed && !opts.fromDoor) {
        this._welcomed = true;
        setTimeout(() => G.UI.say('Mari', [
          'There it is. My shop. MY shop!',
          'Come on, Mari — first day. Walk with the arrow keys or click, press E near things... and go open that door.',
        ]), 500);
      }
    },

    view() {
      const D = G.EXTERIOR;
      const s = Math.min(G.W / D.w, G.H / D.h);
      return { s, ox: (G.W - D.w * s) / 2, oy: (G.H - D.h * s) / 2 };
    },

    update(dt) {
      this.t += dt;
      G.updateFade(dt);
      if (G.UI.busy() || G.Fade.dir !== 0) { this.player.walking = false; return; }
      const D = G.EXTERIOR, p = this.player, v = this.view();
      const speed = 330;
      let dx = G.Input.axis().x;

      // click: hotspot or walk target
      if (G.Input.mouse.clicked) {
        const ix = (G.Input.mouse.x - v.ox) / v.s;
        const hs = this.hotspotNear(ix, 999999);
        const near = this.hotspotNear(p.x);
        if (hs && near === hs) { this.interact(hs); }
        else this.target = G.clamp(ix, D.minX, D.maxX);
      }
      if (dx !== 0) this.target = null;
      if (this.target != null) {
        const d = this.target - p.x;
        if (Math.abs(d) < 6) { const hs = this.hotspotNear(p.x); this.target = null; if (hs) this.interact(hs); }
        else dx = Math.sign(d);
      }

      p.walking = dx !== 0;
      if (dx !== 0) { p.flip = dx < 0; p.x = G.clamp(p.x + dx * speed * dt, D.minX, D.maxX); }

      if (G.Input.pressed('KeyE') || G.Input.pressed('Space')) {
        const hs = this.hotspotNear(p.x);
        if (hs) this.interact(hs);
      }
    },

    hotspotNear(x, extra) {
      let best = null, bd = 1e9;
      for (const h of G.EXTERIOR.hotspots) {
        const d = Math.abs(x - h.x);
        if (d < (extra || h.r) && d < bd) { bd = d; best = h; }
      }
      return best;
    },

    interact(h) {
      G.Audio.play('click');
      if (h.id === 'door') {
        G.Audio.play('door');
        G.transition(() => G.setMode('interior', { fromDoor: true }));
      } else {
        const lines = G.EXTERIOR_FLAVOR[h.id];
        if (lines) G.UI.say('Mari', lines);
      }
    },

    draw(ctx) {
      drawLetterbox(ctx);
      const D = G.EXTERIOR, v = this.view();
      ctx.drawImage(G.images[D.img], v.ox, v.oy, D.w * v.s, D.h * v.s);

      // markers + prompt
      const near = this.hotspotNear(this.player.x);
      for (const h of D.hotspots) {
        if (h !== near) drawMarker(ctx, v.ox + h.x * v.s, v.oy + (h.y - 40) * v.s, this.t + h.x);
      }
      // player
      G.drawSprite(ctx, G.Sprites.mari, v.ox + this.player.x * v.s, v.oy + D.groundY * v.s,
        D.playerH * v.s, { walking: this.player.walking, flip: this.player.flip, time: this.t });
      if (near && !G.UI.busy()) drawPrompt(ctx, v.ox + near.x * v.s, v.oy + (near.y - 60) * v.s, near.icon, near.label, this.t);

      drawVignette(ctx);
      G.drawFade(ctx);
    },
  };

  // ---------------- INTERIOR ----------------
  const Int = {
    t: 0,
    player: { x: 465, y: 1520, flip: false, walking: false, dir: 'front' },
    target: null,
    camY: 0,
    customer: null,          // { name, lookIdx, x, y, state, wp:[], order, timer }
    nextCustomerIn: 6,

    enter(opts) {
      this.t = 0;
      const D = G.INTERIOR;
      this.player.x = D.start.x; this.player.y = D.start.y;
      this.target = null;
      G.UI.showHUD(true);
      if (!this._welcomed) {
        this._welcomed = true;
        setTimeout(() => G.UI.say('Mari', [
          'Warm floors, the smell of cotton and coffee... it\'s real.',
          'The sewing machines take orders for made-to-measure work. The mannequins and the wardrobe are for ready-made tops.',
          'And when the doorbell rings — that\'s a customer!',
        ]), 400);
      }
    },

    view() {
      const D = G.INTERIOR;
      const s = Math.min(G.W / D.w, G.H / 900);
      const visH = G.H / s;
      this.camY = G.clamp(this.player.y - visH * 0.55, 0, Math.max(0, D.h - visH));
      return { s, ox: (G.W - D.w * s) / 2, oy: -this.camY * s };
    },

    blocked(x, y) {
      const D = G.INTERIOR;
      if (x < D.bounds.minX || x > D.bounds.maxX || y < D.bounds.minY || y > D.bounds.maxY) return true;
      for (const b of D.blocks) {
        if (x > b[0] && x < b[0] + b[2] && y > b[1] && y < b[1] + b[3]) return true;
      }
      return false;
    },

    moveActor(a, dx, dy, speed, dt) {
      const step = speed * dt;
      let moved = false;
      if (dx !== 0) {
        const nx = a.x + dx * step;
        if (!this.blocked(nx, a.y)) { a.x = nx; moved = true; }
      }
      if (dy !== 0) {
        const ny = a.y + dy * step;
        if (!this.blocked(a.x, ny)) { a.y = ny; moved = true; }
      }
      return moved;
    },

    update(dt) {
      this.t += dt;
      G.updateFade(dt);
      this.updateCustomer(dt);
      const shopFrozen = G.UI.busy() || G.Fade.dir !== 0;
      if (!shopFrozen) G.Management.tick(dt, this.customer);
      G.UI.updateHUD();
      if (shopFrozen) { this.player.walking = false; return; }

      const p = this.player, v = this.view();
      let ax = G.Input.axis().x, ay = G.Input.axis().y;

      if (G.Input.mouse.clicked) {
        const ix = (G.Input.mouse.x - v.ox) / v.s;
        const iy = (G.Input.mouse.y - v.oy) / v.s;
        const near = this.hotspotNear();
        const clickedHs = this.hotspotAt(ix, iy);
        if (clickedHs && clickedHs === near) this.interact(clickedHs);
        else this.target = { x: ix, y: iy };
      }
      if (ax || ay) this.target = null;
      if (this.target) {
        const dx = this.target.x - p.x, dy = this.target.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 10) {
          this.target = null;
          const hs = this.hotspotNear(); if (hs) this.interact(hs);
        } else { ax = dx / d; ay = dy / d; }
      }

      p.walking = !!(ax || ay);
      if (p.walking) {
        const before = { x: p.x, y: p.y };
        this.moveActor(p, ax, ay, 300, dt);
        if (p.x === before.x && p.y === before.y) { p.walking = false; this.target = null; }
        if (ax) p.flip = ax < 0;
        p.dir = ay < -0.3 ? 'back' : 'front';
      }

      if (G.Input.pressed('KeyE') || G.Input.pressed('Space')) {
        const hs = this.hotspotNear();
        if (hs) this.interact(hs);
      }
    },

    hotspotNear() {
      const p = this.player;
      let best = null, bd = 1e9;
      for (const h of this.allHotspots()) {
        const d = G.dist(p.x, p.y, h.x, h.y);
        if (d < h.r + 40 && d < bd) { bd = d; best = h; }
      }
      return best;
    },

    hotspotAt(ix, iy) {
      let best = null, bd = 1e9;
      for (const h of this.allHotspots()) {
        const d = G.dist(ix, iy, h.x, h.y);
        if (d < h.r && d < bd) { bd = d; best = h; }
      }
      return best;
    },

    allHotspots() {
      return G.INTERIOR.hotspots.concat(G.Management.trashHotspots());
    },

    // ---------- customer flow ----------
    updateCustomer(dt) {
      const c = this.customer;
      if (!c) {
        if (G.Orders.list.length >= 3) return;
        this.nextCustomerIn -= dt;
        if (this.nextCustomerIn <= 0) this.spawnCustomer();
        return;
      }
      if (c.state === 'entering' || c.state === 'leaving') {
        const wp = c.wp[0];
        if (!wp) {
          if (c.state === 'leaving') { this.customer = null; this.nextCustomerIn = 18 + Math.random() * 15; }
          else { c.state = 'asking'; this.customerAsk(); }
          return;
        }
        const dx = wp.x - c.x, dy = wp.y - c.y, d = Math.hypot(dx, dy);
        if (d < 8) { c.wp.shift(); return; }
        c.x += (dx / d) * 200 * dt;
        c.y += (dy / d) * 200 * dt;
        c.flip = dx < 0;
        c.dir = dy < 0 ? 'back' : 'front';
        c.walking = true;
      } else {
        c.walking = false;
        c.dir = 'front';
      }
    },

    spawnCustomer() {
      const D = G.INTERIOR;
      const name = G.pick(G.CUSTOMER_NAMES);
      const lookIdx = Math.floor(Math.random() * G.Sprites.customers.length);
      this.customer = {
        name, lookIdx,
        x: D.doorSpot.x, y: D.doorSpot.y,
        state: 'entering', walking: true, flip: false, dir: 'back',
        wp: [{ x: 590, y: 1400 }, { x: D.counterSpot.x, y: D.counterSpot.y }],
        order: null,
      };
      G.Management.onCustomerSpawn(this.customer);
      G.Audio.play('bell');
      G.UI.toast(`🔔 The doorbell! ${name} steps in.`);
    },

    customerAsk() {
      const c = this.customer;
      const order = Math.random() < 0.5 ? G.makeSewOrder(c.name, c.lookIdx) : G.makeOutfitOrder(c.name, c.lookIdx);
      c.order = order;
      G.Orders.add(order);
      G.Management.recordDeposit(order.deposit);
      const concern = G.Management.customerConcern(order);
      const hint = order.kind === 'sew'
        ? 'A sewing order! I\'ll take it to a sewing machine. (Check 📜 Orders up top.)'
        : 'A ready-made top! I\'ll pick one at a mannequin or the wardrobe rack.';
      G.UI.say(c.name, concern ? [concern, order.text] : [order.text], () => {
        c.state = 'waiting';
        G.UI.say('Mari', [hint]);
      });
    },

    /* called by minigames when an order is finished */
    orderCompleted(order, quality) {
      const pay = Math.max(0, G.payFor(order.pay, quality) - (order.deposit || 0));
      G.S.coins += pay;
      G.S.ordersDone += 1;
      order.status = 'complete';
      G.Management.onOrderComplete(order, quality, pay);
      G.Orders.remove(order);
      G.save();
      G.UI.toast('✨ MANUFACTURING COMPLETE · ' + quality.toUpperCase());
      const qWord = quality === 'perfect' ? 'Perfect work!' : quality === 'fine' ? 'Fine work.' : 'A bit rough... but it\'ll do.';
      const c = this.customer;
      if (c && c.order === order) {
        G.UI.say(c.name, [G.pick(G.THANKS_LINES)], () => {
          G.UI.coinToast(pay);
          G.UI.toast(qWord);
          c.state = 'leaving';
          c.wp = [{ x: 590, y: 1400 }, { x: G.INTERIOR.doorSpot.x, y: G.INTERIOR.doorSpot.y }];
          this.maybeMilestone();
        });
      } else {
        G.UI.coinToast(pay);
        G.UI.toast(qWord + ' Order wrapped for pickup.');
        this.maybeMilestone();
      }
    },

    maybeMilestone() {
      if (G.S.ordersDone === 1) G.UI.toast('✨ First order done! Maybe rest on the sofa a moment...');
      if (G.S.ordersDone === 3) G.UI.toast('✨ The hearth crackles. Those old bricks remember something.');
      if (G.S.ordersDone === 5) G.UI.toast('✨ The little framed picture on the right wall catches your eye.');
    },

    // ---------- interactions ----------
    interact(h) {
      G.Audio.play('click');
      if (h.id.indexOf('trash:') === 0) {
        G.Management.cleanTrash(h.id.slice(6));
        return;
      }
      switch (h.id) {
        case 'exit':
          G.Audio.play('door');
          G.transition(() => G.setMode('exterior', { fromDoor: true }));
          break;

        case 'sewing1': case 'sewing2': case 'cutting': {
          const orders = G.Orders.openSew();
          if (orders.length) {
            const order = orders[0];
            const have = (G.S.fabrics[order.fabric] || 0) > 0;
            if (!have) {
              G.UI.say('Mari', [`I'm out of ${G.FABRICS[order.fabric].name}! I can buy a bolt at the counter ledger. 📒`]);
              return;
            }
            G.S.fabrics[order.fabric] -= 1; G.save();
            G.setMode('sewing', { order, back: 'interior' });
          } else if (h.id === 'cutting') {
            const order = G.makeSewOrder('the practice basket', 0, true);
            G.UI.say('Mari', [
              `No orders waiting — but practice makes perfect. Grandmother's rule: one seam a day.`,
              `Let's cut a ${order.garment} in ${G.FABRICS[order.fabric].name}.`,
            ], () => {
              if ((G.S.fabrics[order.fabric] || 0) > 0) {
                G.S.fabrics[order.fabric] -= 1; G.save();
                G.Orders.add(order);
                G.setMode('sewing', { order, back: 'interior' });
              } else {
                G.UI.say('Mari', [`...except I have no ${G.FABRICS[order.fabric].name}. The ledger at the counter sells bolts.`]);
              }
            });
          } else {
            G.UI.say('Mari', ['No sewing orders right now. The cutting table has practice patterns, or I can wait for the bell.']);
          }
          break;
        }

        case 'mannequin1': case 'mannequin2': case 'mannequin3': case 'rack': {
          const orders = G.Orders.openOutfit();
          G.setMode('wardrobe', { order: orders[0] || null, back: 'interior' });
          break;
        }

        case 'counter':
          G.UI.openLedgerPanel();
          break;

        case 'fabrics':
          G.UI.openFabricsPanel();
          break;

        case 'coffee':
          if (this.customer && this.customer.state === 'waiting') {
            const coffee = G.Management.serveCoffee(this.customer);
            G.UI.say('Mari', [coffee.message]);
            G.UI.updateHUD();
          } else G.UI.say('Mari', G.INTERIOR_FLAVOR.coffee);
          break;

        case 'sofa':
          if (!G.S.memoriesSeen.grandmother) G.setMode('flashback', { memory: 'grandmother', back: 'interior' });
          else G.UI.say('Mari', G.INTERIOR_FLAVOR.sofa_after);
          break;

        case 'hearth':
          if (!G.S.memoriesSeen.factory) G.setMode('flashback', { memory: 'factory', back: 'interior' });
          else G.UI.say('Mari', G.INTERIOR_FLAVOR.hearth_after);
          break;

        case 'painting':
          if (!G.S.memoriesSeen.royal) G.setMode('flashback', { memory: 'royal', back: 'interior' });
          else G.UI.say('Mari', G.INTERIOR_FLAVOR.painting_after);
          break;
      }
    },

    draw(ctx) {
      drawLetterbox(ctx);
      const D = G.INTERIOR, v = this.view();
      ctx.drawImage(G.images[D.img], v.ox, v.oy, D.w * v.s, D.h * v.s);

      const near = this.hotspotNear();
      for (const h of this.allHotspots()) {
        const sy = v.oy + h.y * v.s;
        if (sy < -40 || sy > G.H + 40) continue;
        if (h !== near) drawMarker(ctx, v.ox + h.x * v.s, sy, this.t + h.x);
      }

      // draw actors in y order
      const actors = [{ kind: 'player', y: this.player.y }];
      if (this.customer) actors.push({ kind: 'cust', y: this.customer.y });
      actors.sort((a, b) => a.y - b.y);
      for (const a of actors) {
        if (a.kind === 'player') {
          const p = this.player;
          G.drawSprite(ctx, G.Sprites.mari, v.ox + p.x * v.s, v.oy + p.y * v.s, D.playerH * v.s,
            { walking: p.walking, flip: p.flip, view: p.dir, time: this.t });
        } else {
          const c = this.customer;
          G.drawSprite(ctx, G.Sprites.customers[c.lookIdx], v.ox + c.x * v.s, v.oy + c.y * v.s, D.playerH * v.s,
            { walking: c.walking, flip: c.flip, view: c.dir, time: this.t });
          if (c.state === 'waiting' || c.state === 'asking')
            drawNamePill(ctx, v.ox + c.x * v.s, v.oy + (c.y - D.playerH - 18) * v.s, c.name + (c.state === 'waiting' ? ' ⏳' : ''));
        }
      }

      if (near && !G.UI.busy()) drawPrompt(ctx, v.ox + near.x * v.s, v.oy + near.y * v.s - 30, near.icon, near.label, this.t);

      drawVignette(ctx);
      G.drawFade(ctx);
    },
  };

  G.modes.exterior = Ext;
  G.modes.interior = Int;

})();
