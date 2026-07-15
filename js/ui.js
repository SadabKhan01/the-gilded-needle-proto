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
    hydrate() {
      this.list = Array.isArray(G.S.orders) ? G.S.orders : [];
      const highestId = this.list.reduce((max, order) => Math.max(max, Number(order.id) || 0), 0);
      this.nextId = Math.max(Number(G.S.nextOrderId) || 1, highestId + 1);
      G.S.orders = this.list;
      G.S.nextOrderId = this.nextId;
    },
    persist() {
      G.S.orders = this.list;
      G.S.nextOrderId = this.nextId;
      G.save();
      G.UI.updateHUD();
    },
    add(o) {
      if (!o.id) o.id = this.nextId++;
      else this.nextId = Math.max(this.nextId, Number(o.id) + 1);
      this.list.push(o);
      this.persist();
    },
    remove(o) {
      this.list = this.list.filter(x => x !== o && x.id !== o.id);
      this.persist();
    },
    openSew() { return this.list.filter(o => o.kind === 'sew' && (o.status === 'open' || o.status === 'cutting')); },
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
          <div class="chip btn map-chip" id="btn-map">🗺 <b>Map</b></div>
          <div class="chip" id="coins-chip">🪙 <b>0</b></div>
          <div class="chip" id="day-chip">Day <b>1</b> · 8:00</div>
          <div class="chip btn" id="btn-orders">📜 Orders <b id="order-count">0</b></div>
          <div class="chip btn" id="btn-fabrics">🧵 Fabrics</div>
          <div class="chip btn" id="btn-condition">🧹 <b>82</b>% · 💭 <span>18</span>%</div>
        </div>
        <div id="toasts"></div>
        <div id="dialogue">
          <div class="name"></div>
          <div class="text"></div>
          <div class="hint">click / space ▸</div>
        </div>`;
      hud = $('#hud'); dlg = $('#dialogue'); toasts = $('#toasts');

      $('#btn-map').addEventListener('click', () => this.openMapPanel());
      $('#btn-orders').addEventListener('click', () => this.openOrdersPanel());
      $('#btn-fabrics').addEventListener('click', () => this.openFabricsPanel());
      $('#btn-condition').addEventListener('click', () => this.openLedgerPanel());
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
      if (G.Management) {
        const m = G.Management.ensure();
        $('#day-chip b').textContent = m.day;
        $('#day-chip').lastChild.textContent = ' · ' + G.Management.clock();
        $('#btn-condition b').textContent = Math.round(m.cleanliness);
        $('#btn-condition span').textContent = Math.round(m.stress);
        $('#btn-condition').classList.toggle('warning', m.cleanliness < 45 || m.stress > 75);
      }
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
        const materialStatus = o.kind === 'sew' ? G.Management.orderMaterialStatus(o) : null;
        const materialList = materialStatus ? materialStatus.rows.map(req =>
          `<span class="material-pill ${req.ready || o.materialsReserved ? 'ready' : 'missing'}">${req.icon} ${req.name} ${o.materialsReserved ? 'reserved' : `${req.stock}/${req.qty}`}</span>`).join('') : '';
        const what = o.kind === 'sew'
          ? `Sew a <b>${o.garment}</b> in <b>${G.FABRICS[o.fabric].name}</b>`
          : `Pick a top: <b>${o.wantText}</b>`;
        const whereNote = o.kind === 'sew' ? 'use a sewing machine' : 'use a mannequin or the wardrobe';
        rows += `<div class="row ${o.status === 'sewn' ? 'done' : ''}">
          <div class="grow">${what}<div class="meta">for ${o.name} — quote 🪙${o.pay}, deposit 🪙${o.deposit || 0} — due day ${o.dueDay || '?'} — ${whereNote}</div>${materialList ? `<div class="material-list">${materialList}</div>` : ''}</div>
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
      const notions = Object.keys(G.MATERIALS).map(k => {
        const item = G.MATERIALS[k];
        return `<div class="row"><div class="supply-icon">${item.icon}</div><div class="grow">${item.name}<div class="meta">finishing material</div></div><b>× ${G.S.materials[k] || 0}</b></div>`;
      }).join('');
      this._openPanel(`<h2>🧵 Workroom Materials</h2><div class="sub">Custom garments need cloth plus every listed notion. Use the town map to restock.</div>${rows}<h2 class="section-title">Notions</h2>${notions}`);
    },

    openMapPanel() {
      const pins = G.MAP_LOCATIONS.map(loc =>
        `<button class="map-pin ${G.S.currentLocation === loc.id ? 'current' : ''}" data-map-location="${loc.id}" style="left:${loc.x}%;top:${loc.y}%" title="${loc.note}"><span>${loc.icon}</span><b>${loc.title}</b></button>`).join('');
      const el = this._openPanel(
        `<h2>🗺 Auberlin Town Map</h2><div class="sub">Choose a destination. Suppliers sell the cloth and notions required by made-from-scratch orders.</div>
         <div class="town-map"><img src="assets/reference/auberlin-town-map.png" alt="Illustrated Auberlin town map">${pins}</div>`);
      el.classList.add('map-panel');
      el.querySelectorAll('[data-map-location]').forEach(pin => pin.addEventListener('click', () => this.openMapLocation(pin.dataset.mapLocation)));
    },

    openMapLocation(id) {
      const location = G.MAP_LOCATIONS.find(loc => loc.id === id);
      if (!location) return;
      G.S.currentLocation = id;
      G.save();
      if (location.action === 'tailor') {
        this.closePanel();
        G.transition(() => G.setMode('exterior', { fromDoor: true }));
      } else if (location.action === 'home') {
        this.closePanel();
        G.transition(() => G.setMode('home', { fromMap: true }));
      }
      else if (location.action === 'brickworks') this.openBrickworksPanel();
      else if (location.supplier) this.openSupplierPanel(location.supplier);
    },

    openSupplierPanel(supplierId) {
      const supplier = G.SUPPLIERS[supplierId];
      if (!supplier) return;
      const itemRow = (type, id) => {
        const def = type === 'fabric' ? G.FABRICS[id] : G.MATERIALS[id];
        const price = Math.max(1, Math.ceil(def.price * supplier.modifier));
        const stock = type === 'fabric' ? (G.S.fabrics[id] || 0) : (G.S.materials[id] || 0);
        return `<div class="row">${type === 'fabric' ? `<div class="swatch" style="${this.swatchStyle(id)}"></div>` : `<div class="supply-icon">${def.icon}</div>`}<div class="grow">${def.name}<div class="meta">workroom stock × ${stock}</div></div><button data-buy-supply="${type}:${id}" ${G.S.coins < price ? 'disabled' : ''}>🪙 ${price}</button></div>`;
      };
      const fabrics = supplier.fabrics.map(id => itemRow('fabric', id)).join('');
      const materials = supplier.materials.map(id => itemRow('material', id)).join('');
      const el = this._openPanel(
        `<button class="panel-back" data-back-map>← Map</button><h2>${supplier.portrait} ${supplier.title}</h2><div class="sub">${supplier.desc}</div>
         <h2 class="section-title">Cloth</h2>${fabrics}<h2 class="section-title">Notions</h2>${materials}`);
      el.querySelector('[data-back-map]').addEventListener('click', () => this.openMapPanel());
      el.querySelectorAll('[data-buy-supply]').forEach(button => button.addEventListener('click', () => {
        const [type, id] = button.dataset.buySupply.split(':');
        const result = G.Management.buySupply(supplierId, type, id);
        G.Audio.play(result.ok ? 'coin' : 'error');
        this.toast(result.message);
        this.updateHUD();
        this.openSupplierPanel(supplierId);
      }));
    },

    openHomePanel() {
      const m = G.Management.ensure();
      const owned = Object.keys(G.Management.homeItems).filter(id => m.home[id]).map(id => G.Management.homeItems[id].name);
      const itemRows = Object.keys(G.Management.homeItems).map(id => {
        const item = G.Management.homeItems[id];
        const has = !!m.home[id];
        const icon = item.kind === 'kitchen' ? '🍳' : item.kind === 'memory' ? '🧵' : '🪑';
        return `<div class="row ${has ? 'done' : ''}"><div class="supply-icon">${icon}</div><div class="grow"><b>${item.name}</b><div class="meta">${item.desc} Comfort +${item.comfort}</div></div>${has ? '<b>✓ home</b>' : `<button data-home-buy="${id}" ${G.S.coins < item.price ? 'disabled' : ''}>🪙 ${item.price}</button>`}</div>`;
      }).join('');
      const fromHome = G.modeName === 'home';
      const el = this._openPanel(
        `<button class="panel-back" data-home-back>← ${fromHome ? 'Room' : 'Map'}</button><h2>🏠 Home Essentials</h2><div class="sub">The bed and oil light are all they begin with. Kitchen appliances and comforts must be bought from shop earnings.</div>
         <div class="family-card"><div class="elise-portrait"></div><div><b>Elise Thimm · Mother</b><p>${G.Management.motherLabel()} · health ${Math.round(m.mother.health)}%</p><p>Home comfort ${m.homeComfort}. ${owned.length ? 'At home: ' + owned.join(', ') + '.' : 'The kitchen is bare and the room has almost nothing.'}</p></div></div>
         <h2 class="section-title">Things the home still needs</h2>${itemRows}`);
      el.querySelector('[data-home-back]').addEventListener('click', () => fromHome ? this.closePanel() : this.openMapPanel());
      el.querySelectorAll('[data-home-buy]').forEach(button => button.addEventListener('click', () => {
        const result = G.Management.buyHome(button.dataset.homeBuy);
        G.Audio.play(result.ok ? 'success' : 'error');
        this.toast(result.message);
        this.updateHUD();
        this.openHomePanel();
      }));
    },

    openBrickworksPanel() {
      const el = this._openPanel(
        `<button class="panel-back" data-back-map>← Map</button><h2>🧱 Ashford Brickworks</h2><div class="sub">The chimneys are still visible from every road into Auberlin.</div>
         <div class="story-card">Mari and Elise carried bricks here while the tea-tin savings slowly grew. The works now supplies sturdy customers who need aprons, waistcoats, and repairable clothes—not a punishment loop, but part of the family's history.</div>`);
      el.querySelector('[data-back-map]').addEventListener('click', () => this.openMapPanel());
    },

    openLedgerPanel() {
      const m = G.Management.ensure();
      const billRow = (id, label) => {
        const b = m.bills[id];
        const state = b.paid ? '✓ set aside' : `🪙 ${b.amount}`;
        return `<div class="row ${b.paid ? 'done' : ''}">
          <div class="grow">${label}<div class="meta">due day ${b.dueDay}</div></div>
          <button data-mgmt="pay-${id}" ${b.paid || G.S.coins < b.amount ? 'disabled' : ''}>${state}</button>
        </div>`;
      };
      const condition = `
        <div class="status-grid">
          <div><span>Cleanliness</span><b>${Math.round(m.cleanliness)}%</b><i><em style="width:${m.cleanliness}%"></em></i></div>
          <div><span>Stress</span><b>${Math.round(m.stress)}%</b><i class="stress"><em style="width:${m.stress}%"></em></i></div>
          <div><span>Coffee</span><b>${m.coffeeStock} cups</b></div>
          <div><span>Home comfort</span><b>${m.homeComfort}</b></div>
          <div><span>Mother</span><b>${G.Management.motherLabel()}</b></div>
          <div><span>Today</span><b>+${m.daily.income} / -${m.daily.expenses}</b></div>
        </div>`;
      const homeRows = Object.keys(G.Management.homeItems).map(id => {
        const item = G.Management.homeItems[id];
        const owned = !!m.home[id];
        return `<div class="row ${owned ? 'done' : ''}">
          <div class="grow">${item.name}<div class="meta">${item.desc} Comfort +${item.comfort}</div></div>
          ${owned ? '<b>✓ home</b>' : `<button data-mgmt="home-${id}" ${G.S.coins < item.price ? 'disabled' : ''}>🪙 ${item.price}</button>`}
        </div>`;
      }).join('');
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
        `<h2>📒 Shop Ledger · Day ${m.day}</h2><div class="sub">Necessities before wants. Coins: 🪙 ${G.S.coins} — orders completed: ${G.S.ordersDone}</div>
         ${condition}
         <h2 class="section-title">Today & essentials</h2>
         <div class="row"><div class="grow">Deep-clean shop<div class="meta">Clear all cups, scraps, and dust. Stress +3.</div></div><button data-mgmt="clean">🧹 Clean</button></div>
         <div class="row"><div class="grow">Coffee supplies<div class="meta">8 cups; each sale earns 🪙2 and buys patience.</div></div><button data-mgmt="coffee" ${G.S.coins < 6 ? 'disabled' : ''}>🪙 6</button></div>
         ${billRow('rent', 'Shop rent')}${billRow('electricity', 'Electricity')}
         <div class="row"><div class="grow">Close for the day<div class="meta">Food costs 🪙5; helper wage costs 🪙6. Rest restores stress.</div></div><button data-mgmt="close-day">🌙 Close</button></div>
         <h2 class="section-title">Home stability</h2>${homeRows}
         <h2 class="section-title">Help</h2>
         <div class="row ${m.staff.helper ? 'done' : ''}"><div class="grow">Lina · cleaner & coffee helper<div class="meta">Unlock after 4 orders. First wages 🪙30, then 🪙6/day.</div></div>${m.staff.helper ? '<b>✓ hired</b>' : `<button data-mgmt="hire" ${G.S.ordersDone < 4 || G.S.coins < 30 ? 'disabled' : ''}>Hire</button>`}</div>
         <h2 style="font-size:17px;border:none;margin-top:8px">Buy fabric</h2>${fabricRows}
         <h2 style="font-size:17px;border:none;margin-top:10px">Improvements</h2>${upgRows}`);
      el.querySelectorAll('[data-mgmt]').forEach(b => b.addEventListener('click', () => {
        const action = b.dataset.mgmt;
        let result;
        if (action === 'clean') result = G.Management.deepClean();
        else if (action === 'coffee') result = G.Management.restockCoffee();
        else if (action === 'pay-rent') result = G.Management.payBill('rent');
        else if (action === 'pay-electricity') result = G.Management.payBill('electricity');
        else if (action.indexOf('home-') === 0) result = G.Management.buyHome(action.slice(5));
        else if (action === 'hire') result = G.Management.hireHelper();
        else if (action === 'close-day') {
          const report = G.Management.closeDay();
          this.closePanel();
          if (G.modes.interior) {
            G.modes.interior.customer = null;
            G.modes.interior.nextCustomerIn = 7;
          }
          G.transition(() => G.setMode('exterior', { fromDoor: true }));
          this.toast(`🌙 Day closed · income ${report.income} · expenses ${report.expenses}`);
          this.updateHUD();
          return;
        }
        G.Audio.play(result.ok ? 'success' : 'error');
        this.toast(result.message);
        this.updateHUD();
        this.openLedgerPanel();
      }));
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
