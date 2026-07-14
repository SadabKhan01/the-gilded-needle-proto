'use strict';
/* The Gilded Needle prototype — DOM UI: HUD, dialogue, panels, toasts, order book */
window.G = window.G || {};

(function () {

  const $ = (sel) => document.querySelector(sel);
  let ui, hud, dlg, toasts;

  // ---------------- orders ----------------
  G.Orders = {
    list: [],          // { id, kind:'sew'|'outfit', name, lookIdx, text, want, fabric, garment, pay, status:'open'|'sewn' }
    nextId: 1,
    add(o) { o.id = this.nextId++; this.list.push(o); G.UI.updateHUD(); },
    remove(o) { this.list = this.list.filter(x => x !== o); G.UI.updateHUD(); },
    openSew() { return this.list.filter(o => o.kind === 'sew' && o.status === 'open'); },
    openOutfit() { return this.list.filter(o => o.kind === 'outfit' && o.status === 'open'); },
  };

  G.payFor = function (base, quality) {
    let pay = Math.round(base * (quality === 'perfect' ? 1.3 : quality === 'fine' ? 1 : 0.6));
    if (G.S.upgrades.display) pay = Math.round(pay * 1.25);
    return pay;
  };

  // ---------------- UI ----------------
  G.UI = {
    init() {
      ui = $('#ui');
      ui.innerHTML = `
        <div id="hud" style="display:none">
          <div class="chip" id="coins-chip">🪙 <b>0</b></div>
          <div class="chip btn" id="btn-orders">📜 Orders <b id="order-count">0</b></div>
          <div class="chip btn" id="btn-fabrics">🧵 Fabrics</div>
        </div>
        <div id="toasts"></div>
        <div id="dialogue">
          <div class="name"></div>
          <div class="text"></div>
          <div class="hint">click / space ▸</div>
        </div>`;
      hud = $('#hud'); dlg = $('#dialogue'); toasts = $('#toasts');

      $('#btn-orders').addEventListener('click', () => this.openOrdersPanel());
      $('#btn-fabrics').addEventListener('click', () => this.openFabricsPanel());
      dlg.addEventListener('click', () => this.advance());
      window.addEventListener('keydown', (e) => {
        if ((e.code === 'Space' || e.code === 'KeyE' || e.code === 'Enter') && this._dlgActive) {
          e.preventDefault();
          this.advance();
        }
      });
      this.updateHUD();
    },

    showHUD(v) { hud.style.display = v ? 'flex' : 'none'; },

    updateHUD() {
      if (!hud) return;
      $('#coins-chip b').textContent = G.S.coins;
      $('#order-count').textContent = G.Orders.list.length;
    },

    toast(msg) {
      const el = document.createElement('div');
      el.className = 'toast';
      el.innerHTML = msg;
      toasts.appendChild(el);
      setTimeout(() => el.remove(), 3400);
    },

    coinToast(n) {
      G.Audio.play('coin');
      this.toast(`🪙 +${n} coins`);
      this.updateHUD();
    },

    // ---- dialogue ----
    _queue: [], _cb: null, _dlgActive: false,
    _typeTimer: null, _fullText: '',

    say(name, lines, cb) {
      this._queue = Array.isArray(lines) ? lines.slice() : [lines];
      this._cb = cb || null;
      this._name = name;
      this._dlgActive = true;
      dlg.classList.add('open');
      dlg.querySelector('.name').textContent = name;
      dlg.querySelector('.name').style.display = name ? '' : 'none';
      this._showLine();
    },

    _showLine() {
      const text = this._queue.shift();
      this._fullText = text;
      const el = dlg.querySelector('.text');
      el.textContent = '';
      let i = 0;
      clearInterval(this._typeTimer);
      this._typeTimer = setInterval(() => {
        i += 2;
        el.textContent = text.slice(0, i);
        if (i >= text.length) clearInterval(this._typeTimer);
      }, 14);
    },

    advance() {
      if (!this._dlgActive) return;
      const el = dlg.querySelector('.text');
      if (el.textContent.length < this._fullText.length) {   // finish typing first
        clearInterval(this._typeTimer);
        el.textContent = this._fullText;
        return;
      }
      G.Audio.play('page');
      if (this._queue.length) { this._showLine(); return; }
      this._dlgActive = false;
      dlg.classList.remove('open');
      const cb = this._cb; this._cb = null;
      if (cb) cb();
    },

    dialogueOpen() { return this._dlgActive; },

    // ---- panels ----
    _panel: null,
    closePanel() { if (this._panel) { this._panel.remove(); this._panel = null; } },
    panelOpen() { return !!this._panel; },

    _openPanel(html) {
      this.closePanel();
      const el = document.createElement('div');
      el.className = 'panel';
      el.innerHTML = `<div class="close">✕</div>` + html;
      ui.appendChild(el);
      el.querySelector('.close').addEventListener('click', () => this.closePanel());
      this._panel = el;
      G.Audio.play('click');
      return el;
    },

    swatchStyle(fabId) {
      const f = G.FABRICS[fabId];
      return `background-color:${f.alt};background-image:` +
        `linear-gradient(${f.color}88 50%, transparent 50%),` +
        `linear-gradient(90deg, ${f.color}88 50%, transparent 50%);`;
    },

    openOrdersPanel() {
      let rows = '';
      if (!G.Orders.list.length) rows = `<div class="empty-note">No orders yet. Wait for the doorbell — or take practice work at the cutting table.</div>`;
      G.Orders.list.forEach(o => {
        const what = o.kind === 'sew'
          ? `Sew a <b>${o.garment}</b> in <b>${G.FABRICS[o.fabric].name}</b>`
          : `Pick a top: <b>${o.wantText}</b>`;
        const whereNote = o.kind === 'sew' ? 'use a sewing machine' : 'use a mannequin or the wardrobe';
        rows += `<div class="row ${o.status === 'sewn' ? 'done' : ''}">
          <div class="grow">${what}<div class="meta">for ${o.name} — pays ~🪙${o.pay} — ${whereNote}</div></div>
        </div>`;
      });
      this._openPanel(`<h2>📜 Order Book</h2><div class="sub">Orders completed so far: ${G.S.ordersDone}</div>${rows}`);
    },

    openFabricsPanel() {
      let rows = '';
      const owned = Object.keys(G.S.fabrics).filter(k => G.S.fabrics[k] > 0);
      if (!owned.length) rows = `<div class="empty-note">The shelves are bare! Buy bolts at the counter ledger.</div>`;
      owned.forEach(k => {
        rows += `<div class="row">
          <div class="swatch" style="${this.swatchStyle(k)}"></div>
          <div class="grow">${G.FABRICS[k].name}<div class="meta">bolts in stock</div></div>
          <b>× ${G.S.fabrics[k]}</b>
        </div>`;
      });
      this._openPanel(`<h2>🧵 Fabric Shelf</h2><div class="sub">Sewing an order uses one matching bolt.</div>${rows}`);
    },

    openLedgerPanel() {
      const fabricRows = Object.keys(G.FABRICS).map(k => {
        const f = G.FABRICS[k];
        const afford = G.S.coins >= f.price;
        return `<div class="row">
          <div class="swatch" style="${this.swatchStyle(k)}"></div>
          <div class="grow">${f.name}<div class="meta">you have × ${G.S.fabrics[k] || 0}</div></div>
          <button data-buy-fabric="${k}" ${afford ? '' : 'disabled'}>🪙 ${f.price}</button>
        </div>`;
      }).join('');
      const upgRows = Object.keys(G.UPGRADES).map(k => {
        const u = G.UPGRADES[k];
        const owned = !!G.S.upgrades[k];
        return `<div class="row ${owned ? 'done' : ''}">
          <div class="grow">${u.name}<div class="meta">${u.desc}</div></div>
          ${owned ? '<b>✓ owned</b>' : `<button data-buy-upg="${k}" ${G.S.coins >= u.price ? '' : 'disabled'}>🪙 ${u.price}</button>`}
        </div>`;
      }).join('');
      const el = this._openPanel(
        `<h2>📒 Shop Ledger</h2><div class="sub">Coins: 🪙 ${G.S.coins} — orders completed: ${G.S.ordersDone}</div>
         <h2 style="font-size:17px;border:none;margin-top:8px">Buy fabric</h2>${fabricRows}
         <h2 style="font-size:17px;border:none;margin-top:10px">Improvements</h2>${upgRows}`);
      el.querySelectorAll('[data-buy-fabric]').forEach(b => b.addEventListener('click', () => {
        const k = b.dataset.buyFabric, f = G.FABRICS[k];
        if (G.S.coins < f.price) return;
        G.S.coins -= f.price;
        G.S.fabrics[k] = (G.S.fabrics[k] || 0) + 1;
        G.save(); G.Audio.play('coin');
        this.updateHUD(); this.openLedgerPanel();
      }));
      el.querySelectorAll('[data-buy-upg]').forEach(b => b.addEventListener('click', () => {
        const k = b.dataset.buyUpg, u = G.UPGRADES[k];
        if (G.S.coins < u.price || G.S.upgrades[k]) return;
        G.S.coins -= u.price;
        G.S.upgrades[k] = true;
        G.save(); G.Audio.play('success');
        this.toast(`✨ ${u.name} purchased!`);
        this.updateHUD(); this.openLedgerPanel();
      }));
    },

    busy() { return this.dialogueOpen() || this.panelOpen(); },
  };

})();
