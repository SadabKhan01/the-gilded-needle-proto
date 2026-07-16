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
    const dressWeighted = ['Sunday dress', 'tea gown', 'picnic skirt', 'Sunday dress', 'tea gown'].concat(G.GARMENTS);
    const garment = G.pick(dressWeighted);
    const notions = (G.GARMENT_NOTIONS[garment] || ['thread']).map(id => ({ id, qty: 1 }));
    const pay = practice ? 8 : 18 + notions.length * 3 + Math.floor(Math.random() * 7);
    const text = G.pick(G.SEW_LINES)
      .replace('{garment}', garment)
      .replace('{fabric}', G.FABRICS[fabric].name);
    const order = { kind: 'sew', name, lookIdx, fabric, garment, materials: notions, pay, text, status: 'open', practice: !!practice };
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

  // ---------------- OPEN TOWN ----------------
  const World = {
    t: 0,
    player: { x: 0, y: 0, flip: false, walking: false, dir: 'front' },
    target: null,
    people: [],

    point(percent) {
      return { x: percent[0] * G.WORLD.w / 100, y: percent[1] * G.WORLD.h / 100 };
    },

    location(id) { return G.MAP_LOCATIONS.find(loc => loc.id === id); },

    locationPoint(loc, marker) {
      const x = marker ? loc.x : (loc.walkX ?? loc.x);
      const y = marker ? loc.y : (loc.walkY ?? loc.y);
      return { x: x * G.WORLD.w / 100, y: y * G.WORLD.h / 100 };
    },

    enter(opts) {
      this.t = 0;
      const loc = this.location(opts.location || G.S.currentLocation) || G.MAP_LOCATIONS[0];
      const p = this.locationPoint(loc);
      this.player.x = p.x; this.player.y = p.y;
      this.player.walking = false; this.target = null;
      G.S.currentLocation = loc.id;
      G.save();
      G.UI.showHUD(true);
      if (!this.people.length) this.seedPeople();
      if (!this._welcomed) {
        this._welcomed = true;
        setTimeout(() => G.UI.say('Mari', [
          'Auberlin is open to us now — every road from Briar Farm to Madder Quay.',
          'Walk with the arrow keys or click a road. The crests mark shops, home, and places that supply our workroom.'
        ]), 350);
      }
    },

    seedPeople() {
      const starts = [1, 3, 7, 10, 12, 16];
      const names = ['Nell · seamstress', 'Mr. Briar · farmer', 'Amir · clerk', 'Mrs. Bell · matron', 'Ren · merchant', 'Lady Elowen'];
      this.people = starts.map((node, i) => {
        const p = this.point(G.WORLD.roadNodes[node]);
        return { x: p.x, y: p.y, node, next: this.neighbor(node, -1), lookIdx: i, name: names[i], flip: false, dir: 'front', walking: true, speed: 72 + i * 7 };
      });
    },

    neighbors(node) {
      const list = [];
      G.WORLD.roadEdges.forEach(edge => {
        if (edge[0] === node) list.push(edge[1]);
        else if (edge[1] === node) list.push(edge[0]);
      });
      return list;
    },

    neighbor(node, previous) {
      const choices = this.neighbors(node).filter(n => n !== previous);
      const pool = choices.length ? choices : this.neighbors(node);
      return pool[Math.floor(Math.random() * pool.length)] ?? node;
    },

    view() {
      const D = G.WORLD;
      const s = Math.max(G.W / 1500, G.H / 900);
      const visW = G.W / s, visH = G.H / s;
      const camX = G.clamp(this.player.x - visW * 0.5, 0, Math.max(0, D.w - visW));
      const camY = G.clamp(this.player.y - visH * 0.55, 0, Math.max(0, D.h - visH));
      return { s, ox: -camX * s, oy: -camY * s };
    },

    segmentDistance(px, py, ax, ay, bx, by) {
      const vx = bx - ax, vy = by - ay;
      const len2 = vx * vx + vy * vy || 1;
      const t = G.clamp(((px - ax) * vx + (py - ay) * vy) / len2, 0, 1);
      return Math.hypot(px - (ax + vx * t), py - (ay + vy * t));
    },

    onRoad(x, y) {
      const D = G.WORLD;
      if (x < 35 || y < 30 || x > D.w - 35 || y > D.h - 35) return false;
      for (const edge of D.roadEdges) {
        const a = this.point(D.roadNodes[edge[0]]), b = this.point(D.roadNodes[edge[1]]);
        if (this.segmentDistance(x, y, a.x, a.y, b.x, b.y) <= D.roadRadius) return true;
      }
      return G.MAP_LOCATIONS.some(loc => {
        const p = this.locationPoint(loc);
        return G.dist(x, y, p.x, p.y) < 92;
      });
    },

    movePlayer(ax, ay, dt) {
      const p = this.player;
      const mag = Math.hypot(ax, ay) || 1;
      const dx = ax / mag * 235 * dt, dy = ay / mag * 235 * dt;
      let moved = false;
      if (this.onRoad(p.x + dx, p.y)) { p.x += dx; moved = true; }
      if (this.onRoad(p.x, p.y + dy)) { p.y += dy; moved = true; }
      return moved;
    },

    updatePeople(dt) {
      for (const person of this.people) {
        const dest = this.point(G.WORLD.roadNodes[person.next]);
        const dx = dest.x - person.x, dy = dest.y - person.y, d = Math.hypot(dx, dy);
        if (d < 7) {
          const old = person.node;
          person.node = person.next;
          person.next = this.neighbor(person.node, old);
          continue;
        }
        person.x += dx / d * person.speed * dt;
        person.y += dy / d * person.speed * dt;
        person.flip = dx < 0;
        person.dir = dy < -0.35 ? 'back' : 'front';
      }
    },

    hotspotNear(range) {
      let best = null, bd = Infinity;
      for (const loc of G.MAP_LOCATIONS) {
        const q = this.locationPoint(loc);
        const d = G.dist(this.player.x, this.player.y, q.x, q.y);
        if (d < (range || 115) && d < bd) { best = loc; bd = d; }
      }
      return best;
    },

    update(dt) {
      this.t += dt;
      G.updateFade(dt);
      if (!G.UI.busy() && G.Fade.dir === 0) this.updatePeople(dt);
      if (G.UI.busy() || G.Fade.dir !== 0) { this.player.walking = false; return; }
      const p = this.player, v = this.view();
      let ax = G.Input.axis().x, ay = G.Input.axis().y;

      if (G.Input.mouse.clicked) {
        const ix = (G.Input.mouse.x - v.ox) / v.s;
        const iy = (G.Input.mouse.y - v.oy) / v.s;
        if (this.onRoad(ix, iy)) this.target = { x: ix, y: iy };
        else { this.target = null; G.UI.toast('Stay to Auberlin\'s roads and garden paths.'); }
      }
      if (ax || ay) this.target = null;
      if (this.target) {
        const dx = this.target.x - p.x, dy = this.target.y - p.y, d = Math.hypot(dx, dy);
        if (d < 9) { this.target = null; ax = 0; ay = 0; }
        else { ax = dx / d; ay = dy / d; }
      }
      p.walking = !!(ax || ay) && this.movePlayer(ax, ay, dt);
      if (p.walking) {
        if (ax) p.flip = ax < 0;
        p.dir = ay < -0.3 ? 'back' : 'front';
      } else if (this.target) this.target = null;

      if (G.Input.pressed('KeyE') || G.Input.pressed('Space')) {
        const loc = this.hotspotNear();
        if (loc) this.interact(loc);
      }
    },

    interact(loc) {
      G.Audio.play('click');
      G.S.currentLocation = loc.id;
      G.save();
      if (loc.action === 'tailor') G.transition(() => G.setMode('exterior', { fromTown: true }));
      else if (loc.action === 'home') G.transition(() => G.setMode('home', { fromTown: true }));
      else if (loc.action === 'brickworks') G.UI.openBrickworksPanel();
      else if (loc.supplier) G.UI.openSupplierPanel(loc.supplier);
    },

    drawLocation(ctx, loc, v, near) {
      const p = this.locationPoint(loc, true);
      const sx = v.ox + p.x * v.s, sy = v.oy + p.y * v.s;
      if (sx < -100 || sy < -100 || sx > G.W + 100 || sy > G.H + 100) return;
      const size = (near ? 68 : 54) * v.s;
      ctx.save();
      ctx.shadowColor = near ? 'rgba(255,224,143,.95)' : 'rgba(42,24,9,.65)';
      ctx.shadowBlur = near ? 20 : 8;
      const logo = G.images['logo_' + loc.id];
      if (logo) ctx.drawImage(logo, sx - size / 2, sy - size, size, size);
      ctx.restore();
      drawNamePill(ctx, sx, sy - size - 11, loc.title);
      if (near && !G.UI.busy()) {
        ctx.save();
        ctx.font = 'italic 14px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff0c8';
        ctx.shadowColor = '#2b1608'; ctx.shadowBlur = 5;
        ctx.fillText('Press E to visit', sx, sy + 18);
        ctx.restore();
      }
    },

    draw(ctx) {
      drawLetterbox(ctx);
      const D = G.WORLD, v = this.view();
      ctx.drawImage(G.images[D.img], v.ox, v.oy, D.w * v.s, D.h * v.s);
      const near = this.hotspotNear();
      G.MAP_LOCATIONS.forEach(loc => this.drawLocation(ctx, loc, v, loc === near));

      const actors = this.people.map(person => ({ type: 'npc', y: person.y, person }));
      actors.push({ type: 'player', y: this.player.y, person: this.player });
      actors.sort((a, b) => a.y - b.y).forEach(actor => {
        const person = actor.person;
        const sprite = actor.type === 'player' ? G.Sprites.mari : G.Sprites.customers[person.lookIdx];
        G.drawSprite(ctx, sprite, v.ox + person.x * v.s, v.oy + person.y * v.s, D.playerH * v.s, {
          walking: actor.type === 'player' ? person.walking : true,
          flip: person.flip, view: person.dir, time: this.t + (person.lookIdx || 0) * .17
        });
        if (actor.type === 'npc' && G.dist(this.player.x, this.player.y, person.x, person.y) < 170)
          drawNamePill(ctx, v.ox + person.x * v.s, v.oy + (person.y - D.playerH - 17) * v.s, person.name);
      });

      ctx.save();
      const title = 'AUBERLIN  ·  OPEN TOWN';
      ctx.font = 'small-caps bold 18px Georgia, serif';
      const tw = ctx.measureText(title).width;
      G.rrect(ctx, G.W - tw - 54, 18, tw + 34, 38, 18);
      ctx.fillStyle = 'rgba(48,29,16,.86)'; ctx.fill();
      ctx.strokeStyle = '#d0aa65'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#f6e5bc'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(title, G.W - tw / 2 - 37, 37);
      ctx.restore();
      drawVignette(ctx);
      G.drawFade(ctx);
    }
  };

  // ---------------- STREET-LEVEL OPEN WORLD ----------------
  // The illustrated town map is deliberately not used here. Version one's
  // hub-and-portals structure is rebuilt as connected, street-level panoramas.
  const StreetWorld = {
    t: 0,
    district: 'ribbon',
    player: { x: 835, flip: false, walking: false },
    target: null,
    people: [],

    data() { return G.STREETS[this.district]; },

    enter(opts) {
      opts = opts || {};
      this.t = 0;
      this.district = G.STREETS[opts.district] ? opts.district : 'ribbon';
      if (document.body) document.body.dataset.district = this.district;
      const D = this.data();
      this.player.x = Number.isFinite(opts.x) ? G.clamp(opts.x, D.minX, D.maxX)
        : opts.spawn === 'left' ? D.minX + 72
        : opts.spawn === 'right' ? D.maxX - 72 : D.w / 2;
      this.player.walking = false;
      this.target = null;
      this.seedPeople();
      G.UI.showHUD(true);
    },

    seedPeople() {
      const base = { cinder: 0, ribbon: 2, larkspur: 4, crownway: 1 }[this.district] || 0;
      this.people = [0, 1, 2].map(i => ({
        x: 330 + i * 500,
        dir: i % 2 ? -1 : 1,
        speed: 34 + i * 9,
        lookIdx: (base + i) % G.Sprites.customers.length,
        name: ['local shopper', 'shopkeeper', 'morning visitor'][i]
      }));
    },

    view() {
      const D = this.data();
      const s = Math.min(G.W / D.w, G.H / D.h);
      return { s, ox: (G.W - D.w * s) / 2, oy: (G.H - D.h * s) / 2 };
    },

    shopNear(x, range) {
      let best = null, distance = Infinity;
      for (const shop of this.data().shops) {
        const d = Math.abs((x ?? this.player.x) - shop.x);
        if (d < (range || 92) && d < distance) { best = shop; distance = d; }
      }
      return best;
    },

    travel(link) {
      if (!link || G.Fade.dir !== 0) return;
      G.Audio.play('door');
      G.transition(() => {
        if (link.mode === 'exterior') G.setMode('exterior', { fromStreet: link.spawn });
        else G.setMode('world', { district: link.district, spawn: link.spawn });
      });
    },

    interact(shop) {
      G.Audio.play('click');
      if (shop.supplier) G.UI.openSupplierPanel(shop.supplier);
      else G.UI.say(shop.title, [shop.desc]);
    },

    updatePeople(dt) {
      const D = this.data();
      this.people.forEach(person => {
        person.x += person.dir * person.speed * dt;
        if (person.x < D.minX + 100) { person.x = D.minX + 100; person.dir = 1; }
        if (person.x > D.maxX - 100) { person.x = D.maxX - 100; person.dir = -1; }
      });
    },

    update(dt) {
      this.t += dt;
      G.updateFade(dt);
      if (!G.UI.busy() && G.Fade.dir === 0) this.updatePeople(dt);
      if (G.UI.busy() || G.Fade.dir !== 0) { this.player.walking = false; return; }
      const D = this.data(), p = this.player, v = this.view();
      let dx = G.Input.axis().x;

      if (G.Input.mouse.clicked) {
        if (G.Input.mouse.x < 54) { this.travel(D.left); return; }
        if (G.Input.mouse.x > G.W - 54) { this.travel(D.right); return; }
        const ix = G.clamp((G.Input.mouse.x - v.ox) / v.s, D.minX, D.maxX);
        const clicked = this.shopNear(ix, 70), near = this.shopNear();
        if (clicked && clicked === near) this.interact(clicked);
        else this.target = ix;
      }
      if (dx) this.target = null;
      if (this.target != null) {
        const delta = this.target - p.x;
        if (Math.abs(delta) < 7) {
          this.target = null; dx = 0;
          const shop = this.shopNear(); if (shop) this.interact(shop);
        } else dx = Math.sign(delta);
      }

      p.walking = dx !== 0;
      if (dx) {
        p.flip = dx < 0;
        p.x += dx * 285 * dt;
        if (p.x <= D.minX) { p.x = D.minX; this.travel(D.left); }
        else if (p.x >= D.maxX) { p.x = D.maxX; this.travel(D.right); }
      }
      if (G.Input.pressed('KeyE') || G.Input.pressed('Space')) {
        const shop = this.shopNear(); if (shop) this.interact(shop);
      }
    },

    drawShopMarker(ctx, shop, v, near) {
      const sx = v.ox + shop.x * v.s;
      const sy = v.oy + (this.data().groundY - 150) * v.s;
      const pulse = near ? 1 + Math.sin(this.t * 4) * .06 : 1;
      ctx.save();
      ctx.translate(sx, sy); ctx.scale(pulse, pulse);
      ctx.beginPath(); ctx.arc(0, 0, near ? 19 : 14, 0, Math.PI * 2);
      ctx.fillStyle = near ? 'rgba(252,236,195,.97)' : 'rgba(55,33,20,.78)';
      ctx.fill(); ctx.strokeStyle = near ? '#8a4b4f' : '#c9a45f'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = near ? '#6b303d' : '#f3dfb5';
      ctx.font = `${near ? 17 : 13}px Georgia, serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(shop.title.charAt(0), 0, 1);
      ctx.restore();
      if (near) {
        drawNamePill(ctx, sx, sy - 36, shop.title);
        ctx.save(); ctx.font = 'italic 13px Georgia, serif'; ctx.textAlign = 'center';
        ctx.fillStyle = '#fff0c8'; ctx.shadowColor = '#2b1608'; ctx.shadowBlur = 4;
        ctx.fillText('Press E to visit', sx, sy + 43); ctx.restore();
      }
    },

    drawEdge(ctx, side, link) {
      const x = side === 'left' ? 18 : G.W - 18;
      ctx.save(); ctx.font = 'bold 15px Georgia, serif'; ctx.textBaseline = 'middle';
      ctx.textAlign = side === 'left' ? 'left' : 'right';
      ctx.fillStyle = '#f6e5bc'; ctx.shadowColor = '#2b1608'; ctx.shadowBlur = 5;
      ctx.fillText(side === 'left' ? `← ${link.label}` : `${link.label} →`, x, G.H - 28);
      ctx.restore();
    },

    draw(ctx) {
      drawLetterbox(ctx);
      const D = this.data(), v = this.view(), near = this.shopNear();
      ctx.drawImage(G.images[D.img], v.ox, v.oy, D.w * v.s, D.h * v.s);
      D.shops.forEach(shop => this.drawShopMarker(ctx, shop, v, shop === near));

      const actors = this.people.map(person => ({ npc: true, x: person.x, person }));
      actors.push({ npc: false, x: this.player.x, person: this.player });
      actors.sort((a, b) => a.x - b.x).forEach(actor => {
        const person = actor.person;
        const sprite = actor.npc ? G.Sprites.customers[person.lookIdx] : G.Sprites.mari;
        G.drawSprite(ctx, sprite, v.ox + person.x * v.s, v.oy + D.groundY * v.s, D.playerH * v.s, {
          walking: actor.npc ? true : person.walking,
          flip: actor.npc ? person.dir < 0 : person.flip,
          view: 'front', time: this.t + (person.lookIdx || 0) * .2
        });
      });

      this.drawEdge(ctx, 'left', D.left); this.drawEdge(ctx, 'right', D.right);
      ctx.save();
      ctx.font = 'small-caps bold 19px Georgia, serif';
      const title = `${D.name}  ·  ${D.subtitle}`;
      const tw = ctx.measureText(title).width;
      G.rrect(ctx, G.W - tw - 38, 66, tw + 24, 34, 16);
      ctx.fillStyle = 'rgba(48,29,16,.86)'; ctx.fill(); ctx.strokeStyle = '#d0aa65'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#f6e5bc'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(title, G.W - tw / 2 - 26, 83); ctx.restore();
      drawVignette(ctx); G.drawFade(ctx);
    }
  };

  // ---------------- EXTERIOR ----------------
  const Ext = {
    t: 0,
    player: { x: G.EXTERIOR.start.x, flip: false, walking: false },
    target: null,

    enter(opts) {
      this.t = 0;
      if (document.body) delete document.body.dataset.district;
      this.player.x = opts.fromStreet === 'left' ? G.EXTERIOR.minX + 85
        : opts.fromStreet === 'right' ? G.EXTERIOR.maxX - 85
        : opts.fromDoor ? G.EXTERIOR.hotspots[0].x : G.EXTERIOR.start.x;
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
        if (G.Input.mouse.x < 54) {
          G.transition(() => G.setMode('world', { district: 'cinder', spawn: 'right' }));
          return;
        }
        if (G.Input.mouse.x > G.W - 54) {
          G.transition(() => G.setMode('world', { district: 'larkspur', spawn: 'left' }));
          return;
        }
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
      if (dx !== 0) {
        p.flip = dx < 0;
        const nx = p.x + dx * speed * dt;
        if (nx < D.minX) {
          p.x = D.minX;
          G.transition(() => G.setMode('world', { district: 'cinder', spawn: 'right' }));
        } else if (nx > D.maxX) {
          p.x = D.maxX;
          G.transition(() => G.setMode('world', { district: 'larkspur', spawn: 'left' }));
        } else p.x = nx;
      }

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
      } else if (h.id === 'fountain') {
        G.transition(() => G.setMode('world', { district: 'ribbon' }));
      } else if (h.id === 'carriage') {
        G.transition(() => G.setMode('world', { district: 'crownway' }));
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

      StreetWorld.drawEdge(ctx, 'left', { label: 'Cinder Row' });
      StreetWorld.drawEdge(ctx, 'right', { label: 'Larkspur Boulevard' });

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
      const order = Math.random() < 0.72 ? G.makeSewOrder(c.name, c.lookIdx) : G.makeOutfitOrder(c.name, c.lookIdx);
      c.order = order;
      G.Orders.add(order);
      G.Management.recordDeposit(order.deposit);
      const concern = G.Management.customerConcern(order);
      const hint = order.kind === 'sew'
        ? 'A made-from-scratch order! I need to collect every listed material, then cut and sew it at a machine. The 🗺 Map leads to suppliers.'
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
            const reservation = G.Management.reserveOrderMaterials(order);
            if (!reservation.ok) {
              G.UI.say('Mari', [reservation.message]);
              return;
            }
            G.setMode('sewing', { order, back: 'interior' });
          } else if (h.id === 'cutting') {
            const order = G.makeSewOrder('the practice basket', 0, true);
            G.UI.say('Mari', [
              `No orders waiting — but practice makes perfect. Grandmother's rule: one seam a day.`,
              `Let's cut a ${order.garment} in ${G.FABRICS[order.fabric].name}.`,
            ], () => {
              G.Orders.add(order);
              const reservation = G.Management.reserveOrderMaterials(order);
              if (reservation.ok) {
                G.setMode('sewing', { order, back: 'interior' });
              } else {
                G.UI.say('Mari', [reservation.message]);
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

        case 'mother':
          G.UI.say('Elise', G.INTERIOR_FLAVOR.mother);
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
      const actors = [{ kind: 'player', y: this.player.y }, { kind: 'mother', y: 790 }];
      if (this.customer) actors.push({ kind: 'cust', y: this.customer.y });
      actors.sort((a, b) => a.y - b.y);
      for (const a of actors) {
        if (a.kind === 'player') {
          const p = this.player;
          G.drawSprite(ctx, G.Sprites.mari, v.ox + p.x * v.s, v.oy + p.y * v.s, D.playerH * v.s,
            { walking: p.walking, flip: p.flip, view: p.dir, time: this.t });
        } else {
          if (a.kind === 'mother') {
            G.drawSprite(ctx, G.Sprites.elise, v.ox + 610 * v.s, v.oy + 790 * v.s, D.playerH * v.s,
              { walking: false, view: 'front', time: this.t + 1.8 });
            drawNamePill(ctx, v.ox + 610 * v.s, v.oy + (790 - D.playerH - 20) * v.s, 'Elise · Mother');
            continue;
          }
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

  // ---------------- FAMILY HOME ----------------
  const Home = {
    t: 0,
    player: { x: 835, y: 790, flip: false, walking: false, dir: 'back' },
    target: null,

    enter() {
      const D = G.HOME;
      this.t = 0;
      this.player.x = D.start.x; this.player.y = D.start.y;
      this.target = null;
      G.S.currentLocation = 'home';
      G.save();
      G.UI.showHUD(true);
      if (!this._welcomed) {
        this._welcomed = true;
        setTimeout(() => G.UI.say('Mari', [
          'Home. One bed, one oil light, and a kitchen with nothing in it yet.',
          'The empty spaces are not shameful. They are a list of what the shop will buy us next.',
        ]), 350);
      }
    },

    view() {
      const D = G.HOME;
      const s = Math.min(G.W / D.w, G.H / D.h);
      return { s, ox: (G.W - D.w * s) / 2, oy: (G.H - D.h * s) / 2 };
    },

    blocked(x, y) {
      const D = G.HOME;
      if (x < D.bounds.minX || x > D.bounds.maxX || y < D.bounds.minY || y > D.bounds.maxY) return true;
      const blocks = D.blocks.slice();
      if (G.Management.ensure().home.chair) blocks.push([690, 420, 145, 145]);
      for (const b of blocks) {
        if (x > b[0] && x < b[0] + b[2] && y > b[1] && y < b[1] + b[3]) return true;
      }
      return false;
    },

    move(dx, dy, dt) {
      const p = this.player, step = 305 * dt;
      let moved = false;
      const nx = p.x + dx * step;
      if (dx && !this.blocked(nx, p.y)) { p.x = nx; moved = true; }
      const ny = p.y + dy * step;
      if (dy && !this.blocked(p.x, ny)) { p.y = ny; moved = true; }
      return moved;
    },

    hotspotNear() {
      const p = this.player;
      let best = null, bd = 1e9;
      for (const h of G.HOME.hotspots) {
        const d = G.dist(p.x, p.y, h.x, h.y);
        if (d < h.r + 45 && d < bd) { best = h; bd = d; }
      }
      return best;
    },

    hotspotAt(x, y) {
      let best = null, bd = 1e9;
      for (const h of G.HOME.hotspots) {
        const d = G.dist(x, y, h.x, h.y);
        if (d < h.r && d < bd) { best = h; bd = d; }
      }
      return best;
    },

    update(dt) {
      this.t += dt;
      G.updateFade(dt);
      if (G.UI.busy() || G.Fade.dir !== 0) { this.player.walking = false; return; }
      const p = this.player, v = this.view();
      let ax = G.Input.axis().x, ay = G.Input.axis().y;
      if (G.Input.mouse.clicked) {
        const ix = (G.Input.mouse.x - v.ox) / v.s;
        const iy = (G.Input.mouse.y - v.oy) / v.s;
        const clicked = this.hotspotAt(ix, iy), near = this.hotspotNear();
        if (clicked && clicked === near) this.interact(clicked);
        else this.target = { x: ix, y: iy };
      }
      if (ax || ay) this.target = null;
      if (this.target) {
        const dx = this.target.x - p.x, dy = this.target.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 10) { this.target = null; const h = this.hotspotNear(); if (h) this.interact(h); }
        else { ax = dx / d; ay = dy / d; }
      }
      p.walking = !!(ax || ay) && this.move(ax, ay, dt);
      if (p.walking) {
        if (ax) p.flip = ax < 0;
        p.dir = ay < -0.3 ? 'back' : 'front';
      }
      if (G.Input.pressed('KeyE') || G.Input.pressed('Space')) {
        const h = this.hotspotNear(); if (h) this.interact(h);
      }
    },

    interact(h) {
      G.Audio.play('click');
      if (h.id === 'exit') {
        G.Audio.play('door');
        G.transition(() => G.setMode('exterior', { fromHome: true }));
      } else if (h.id === 'kitchen') {
        G.UI.openHomePanel();
      } else if (h.id === 'bed' && G.Management.ensure().mother.status !== 'working') {
        G.UI.say('Elise', ['I am resting, truly. Show me the order book later and I will help you count tomorrow\'s work.']);
      } else {
        G.UI.say('Mari', G.HOME_FLAVOR[h.id] || ['There is not much here yet, but it is ours.']);
      }
    },

    drawUpgrades(ctx, v) {
      const home = G.Management.ensure().home;
      ctx.save();
      ctx.translate(v.ox, v.oy); ctx.scale(v.s, v.s);
      const sheet = G.images.home_upgrades, q = 627;
      const prop = (owned, sx, sy, x, y, size) => {
        if (owned) ctx.drawImage(sheet, sx, sy, q, q, x, y, size, size);
      };
      prop(home.chair, 0, 0, 720, 390, 280);
      prop(home.stove, q, 0, 965, 235, 345);
      prop(home.icebox, 0, q, 1260, 240, 330);
      prop(home.brida_corner, q, q, 450, 230, 300);
      ctx.restore();
    },

    draw(ctx) {
      drawLetterbox(ctx);
      const D = G.HOME, v = this.view(), p = this.player;
      ctx.drawImage(G.images[D.img], v.ox, v.oy, D.w * v.s, D.h * v.s);
      this.drawUpgrades(ctx, v);
      const near = this.hotspotNear();
      for (const h of D.hotspots) {
        if (h !== near) drawMarker(ctx, v.ox + h.x * v.s, v.oy + h.y * v.s, this.t + h.x);
      }
      const motherHome = G.Management.ensure().mother.status !== 'working';
      const actors = [{ kind: 'player', x: p.x, y: p.y }];
      if (motherHome) actors.push({ kind: 'mother', x: 525, y: 695 });
      actors.sort((a, b) => a.y - b.y).forEach(actor => {
        const sprite = actor.kind === 'mother' ? G.Sprites.elise : G.Sprites.mari;
        G.drawSprite(ctx, sprite, v.ox + actor.x * v.s, v.oy + actor.y * v.s, D.playerH * v.s,
          { walking: actor.kind === 'player' && p.walking, flip: actor.kind === 'player' && p.flip, view: actor.kind === 'player' ? p.dir : 'front', time: this.t });
        if (actor.kind === 'mother') drawNamePill(ctx, v.ox + actor.x * v.s, v.oy + (actor.y - D.playerH - 18) * v.s, 'Elise · resting');
      });
      if (near && !G.UI.busy()) drawPrompt(ctx, v.ox + near.x * v.s, v.oy + near.y * v.s - 30, near.icon, near.label, this.t);
      drawVignette(ctx);
      G.drawFade(ctx);
    },
  };

  G.modes.world = StreetWorld;
  G.modes.exterior = Ext;
  G.modes.interior = Int;
  G.modes.home = Home;

})();
