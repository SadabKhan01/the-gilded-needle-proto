'use strict';
/* The Gilded Needle prototype - shop pressure, bills, home comfort, and mother health. */
window.G = window.G || {};

(function () {
  const HOME_ITEMS = {
    chair: { name: 'A proper chair', price: 25, comfort: 8, kind: 'furniture', desc: 'A place for Mother to rest without climbing into bed.' },
    stove: { name: 'Small iron stove', price: 55, comfort: 14, kind: 'kitchen', desc: 'The first real appliance: warm meals instead of cold bread.' },
    icebox: { name: 'Wooden icebox', price: 70, comfort: 16, kind: 'kitchen', desc: 'Keeps milk and vegetables safe for more than a day.' },
    brida_corner: { name: "Brida's sewing corner", price: 90, comfort: 20, kind: 'memory', desc: 'Her notes, thimble, and green cardigan together.' },
  };

  const TRASH_SPOTS = [
    { x: 555, y: 1325, kind: 'coffee cup', icon: '☕' },
    { x: 405, y: 880, kind: 'fabric scraps', icon: '🧵' },
    { x: 610, y: 1450, kind: 'tissue', icon: '🧻' },
    { x: 365, y: 1180, kind: 'pattern paper', icon: '📄' },
    { x: 520, y: 760, kind: 'loose thread', icon: '🧶' },
  ];

  function defaults() {
    return {
      day: 1, minute: 480, cleanliness: 82, stress: 18, coffeeStock: 6,
      homeComfort: 5, trash: [], home: {}, staff: {},
      mother: { health: 82, status: 'working', illDays: 0 },
      bills: {
        rent: { amount: 35, dueDay: 7, period: 7, paid: false },
        electricity: { amount: 16, dueDay: 5, period: 5, paid: false },
      },
      daily: { income: 0, expenses: 0, coffeeIncome: 0, customers: 0 },
      lateBills: 0,
    };
  }

  function fill(dst, src) {
    Object.keys(src).forEach(k => {
      if (dst[k] === undefined) dst[k] = src[k];
      else if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k])) fill(dst[k], src[k]);
    });
    return dst;
  }

  function clamp(v) { return Math.max(0, Math.min(100, v)); }
  function money(n) { return '🪙 ' + n; }

  G.Management = {
    homeItems: HOME_ITEMS,

    ensure() {
      if (!G.S.management) G.S.management = defaults();
      fill(G.S.management, defaults());
      return G.S.management;
    },

    clock() {
      const m = this.ensure().minute;
      const h = Math.floor(m / 60);
      return h + ':' + String(Math.floor(m % 60)).padStart(2, '0');
    },

    motherLabel() {
      const mum = this.ensure().mother;
      if (mum.status === 'ill') return 'Mother ill - resting';
      if (mum.status === 'resting') return 'Mother resting';
      return 'Mother working';
    },

    tick(dt, customer) {
      const m = this.ensure();
      m.minute = Math.min(1080, m.minute + dt * 2);
      const busy = customer && customer.state !== 'leaving';
      if (busy) m.stress = clamp(m.stress + dt * (m.mother.status === 'working' ? 0.18 : 0.32));
      else m.stress = clamp(m.stress - dt * 0.035);
      if (m.cleanliness < 40) m.stress = clamp(m.stress + dt * 0.08);
      if (m.staff.helper) m.cleanliness = clamp(m.cleanliness + dt * 0.07);
    },

    enrichOrder(order) {
      const m = this.ensure();
      if (!Array.isArray(order.materials)) order.materials = [];
      order.acceptedDay = m.day;
      order.dueDay = m.day + (order.practice ? 0 : 1);
      order.patience = 100;
      order.qualityExpectation = order.pay >= 16 ? 'fine' : 'any';
      order.cleanlinessSensitivity = Math.random() < 0.35 ? 'high' : 'normal';
      order.deposit = order.practice ? 0 : Math.max(2, Math.round(order.pay * 0.25));
      return order;
    },

    orderRequirements(order) {
      const requirements = [];
      if (order && order.kind === 'sew' && order.fabric) {
        requirements.push({ type: 'fabric', id: order.fabric, qty: 1, name: G.FABRICS[order.fabric].name, icon: '🧶' });
        (order.materials || []).forEach(req => {
          const def = G.MATERIALS[req.id];
          if (def) requirements.push({ type: 'material', id: req.id, qty: req.qty || 1, name: def.name, icon: def.icon });
        });
      }
      return requirements;
    },

    orderMaterialStatus(order) {
      const requirements = this.orderRequirements(order);
      const rows = requirements.map(req => {
        const stock = req.type === 'fabric' ? (G.S.fabrics[req.id] || 0) : (G.S.materials[req.id] || 0);
        return Object.assign({}, req, { stock, ready: stock >= req.qty });
      });
      return { ready: rows.every(row => row.ready), rows, missing: rows.filter(row => !row.ready) };
    },

    reserveOrderMaterials(order) {
      if (order.materialsReserved) return { ok: true, message: 'Materials are already cut and reserved.' };
      const status = this.orderMaterialStatus(order);
      if (!status.ready) {
        return { ok: false, message: 'Missing ' + status.missing.map(row => `${row.name} (${row.stock}/${row.qty})`).join(', ') + '. Open the town map to visit a supplier.' };
      }
      status.rows.forEach(req => {
        if (req.type === 'fabric') G.S.fabrics[req.id] -= req.qty;
        else G.S.materials[req.id] -= req.qty;
      });
      order.materialsReserved = true;
      order.status = 'cutting';
      G.Orders.persist();
      return { ok: true, message: 'Cloth and notions reserved for the order.' };
    },

    buySupply(supplierId, type, itemId) {
      const supplier = G.SUPPLIERS[supplierId];
      const catalog = type === 'fabric' ? supplier && supplier.fabrics : supplier && supplier.materials;
      const def = type === 'fabric' ? G.FABRICS[itemId] : G.MATERIALS[itemId];
      if (!supplier || !def || !catalog.includes(itemId)) return { ok: false, message: 'That supplier does not carry this item.' };
      const price = Math.max(1, Math.ceil(def.price * supplier.modifier));
      if (G.S.coins < price) return { ok: false, message: `You need 🪙${price} for ${def.name}.` };
      G.S.coins -= price;
      const shelf = type === 'fabric' ? G.S.fabrics : G.S.materials;
      shelf[itemId] = (shelf[itemId] || 0) + 1;
      this.ensure().daily.expenses += price;
      G.save();
      return { ok: true, message: `${def.name} added to the work basket.`, price };
    },

    onCustomerSpawn(customer) {
      const m = this.ensure();
      m.daily.customers += 1;
      if (m.coffeeStock > 0) {
        m.coffeeStock -= 1;
        m.daily.coffeeIncome += 2;
        m.daily.income += 2;
        G.S.coins += 2;
        customer.hadCoffee = true;
        G.UI.toast('☕ Coffee served - patience +15, ' + money(2));
      }
      this.addTrash(Math.random() < 0.6 ? null : 'fabric scraps');
      m.cleanliness = clamp(m.cleanliness - (customer.hadCoffee ? 5 : 3));
      G.UI.updateHUD();
    },

    customerConcern(order) {
      const m = this.ensure();
      if (m.cleanliness < 35 && order.cleanlinessSensitivity === 'high') {
        order.patience -= 25;
        return 'I hope you do not mind me saying - the floor is rather untidy today.';
      }
      if (m.cleanliness < 60) return 'Busy morning? I can see the thread has been flying.';
      return null;
    },

    recordDeposit(amount) {
      if (!amount) return;
      const m = this.ensure();
      G.S.coins += amount;
      m.daily.income += amount;
      G.save();
      G.UI.coinToast(amount);
      G.UI.toast('Deposit recorded on the order card.');
    },

    onOrderComplete(order, quality, pay) {
      const m = this.ensure();
      m.daily.income += pay;
      m.stress = clamp(m.stress - (quality === 'perfect' ? 8 : 4));
      m.cleanliness = clamp(m.cleanliness - 2);
      if (quality === 'rough' && order.qualityExpectation === 'fine') m.stress = clamp(m.stress + 5);
      G.UI.updateHUD();
    },

    addTrash(forcedKind) {
      const m = this.ensure();
      if (m.trash.length >= TRASH_SPOTS.length) return;
      const used = new Set(m.trash.map(t => t.spot));
      const options = TRASH_SPOTS.map((s, i) => ({ s, i })).filter(x => !used.has(x.i));
      if (!options.length) return;
      const pick = options[Math.floor(Math.random() * options.length)];
      m.trash.push({ id: Date.now() + '-' + pick.i, spot: pick.i, kind: forcedKind || pick.s.kind });
    },

    trashHotspots() {
      return this.ensure().trash.map(t => {
        const s = TRASH_SPOTS[t.spot];
        return { id: 'trash:' + t.id, label: 'Clean ' + t.kind, x: s.x, y: s.y, r: 70, icon: s.icon };
      });
    },

    cleanTrash(id) {
      const m = this.ensure();
      const before = m.trash.length;
      m.trash = m.trash.filter(t => String(t.id) !== String(id));
      if (m.trash.length === before) return false;
      m.cleanliness = clamp(m.cleanliness + 18);
      m.stress = clamp(m.stress - 2);
      G.save();
      G.UI.toast('🧹 One small job done. Cleanliness +' + 18);
      G.UI.updateHUD();
      return true;
    },

    deepClean() {
      const m = this.ensure();
      m.trash = [];
      m.cleanliness = 100;
      m.stress = clamp(m.stress + 3);
      G.save();
      return { ok: true, message: 'The shop is ready for anyone.' };
    },

    restockCoffee() {
      const m = this.ensure();
      if (G.S.coins < 6) return { ok: false, message: 'Not enough coins for coffee supplies.' };
      G.S.coins -= 6;
      m.coffeeStock += 8;
      m.daily.expenses += 6;
      G.save();
      return { ok: true, message: 'Coffee restocked: +8 cups.' };
    },

    serveCoffee(customer) {
      const m = this.ensure();
      if (!customer || customer.state !== 'waiting') return { ok: false, message: 'No waiting customer needs a cup.' };
      if (customer.hadCoffee) return { ok: false, message: 'They already have a warm cup.' };
      if (m.coffeeStock < 1) return { ok: false, message: 'The coffee shelf is empty.' };
      m.coffeeStock -= 1;
      customer.hadCoffee = true;
      if (customer.order) customer.order.patience = Math.min(100, customer.order.patience + 15);
      G.S.coins += 2;
      m.daily.coffeeIncome += 2;
      m.daily.income += 2;
      this.addTrash('coffee cup');
      m.cleanliness = clamp(m.cleanliness - 4);
      G.save();
      return { ok: true, message: 'Coffee served. Their shoulders soften a little. ' + money(2) };
    },

    payBill(kind) {
      const m = this.ensure();
      const bill = m.bills[kind];
      if (!bill) return { ok: false, message: 'Unknown bill.' };
      if (bill.paid) return { ok: false, message: 'Already set aside for this cycle.' };
      if (G.S.coins < bill.amount) return { ok: false, message: 'Not enough coins yet.' };
      G.S.coins -= bill.amount;
      bill.paid = true;
      m.daily.expenses += bill.amount;
      m.stress = clamp(m.stress - 6);
      G.save();
      return { ok: true, message: (kind === 'rent' ? 'Rent' : 'Electricity') + ' set aside.' };
    },

    buyHome(id) {
      const m = this.ensure();
      const item = HOME_ITEMS[id];
      if (!item) return { ok: false, message: 'Unknown home item.' };
      if (m.home[id]) return { ok: false, message: 'Already at home.' };
      if (G.S.coins < item.price) return { ok: false, message: 'Necessities first - not enough coins.' };
      G.S.coins -= item.price;
      m.home[id] = true;
      m.homeComfort += item.comfort;
      m.daily.expenses += item.price;
      m.stress = clamp(m.stress - 5);
      G.save();
      return { ok: true, message: item.name + ' will be waiting at home.' };
    },

    hireHelper() {
      const m = this.ensure();
      if (m.staff.helper) return { ok: false, message: 'Lina is already on the rota.' };
      if (G.S.ordersDone < 4) return { ok: false, message: 'Complete 4 orders before promising steady wages.' };
      if (G.S.coins < 30) return { ok: false, message: 'Keep 30 coins for her first wages.' };
      G.S.coins -= 30;
      m.staff.helper = true;
      m.daily.expenses += 30;
      m.stress = clamp(m.stress - 12);
      G.save();
      return { ok: true, message: 'Lina joins as cleaner and coffee helper. Wage: 6/day.' };
    },

    closeDay() {
      const m = this.ensure();
      let essentials = 5 + (m.staff.helper ? 6 : 0);
      if (G.S.coins >= essentials) {
        G.S.coins -= essentials;
        m.daily.expenses += essentials;
      } else {
        essentials -= G.S.coins;
        G.S.coins = 0;
        m.stress = clamp(m.stress + 12);
      }

      ['rent', 'electricity'].forEach(kind => {
        const b = m.bills[kind];
        if (m.day >= b.dueDay) {
          if (!b.paid) { m.lateBills += 1; m.stress = clamp(m.stress + 16); }
          b.paid = false;
          b.dueDay += b.period;
        }
      });

      const mum = m.mother;
      if (mum.illDays > 0) {
        mum.illDays -= 1;
        mum.health = clamp(mum.health + 9 + m.homeComfort * 0.08);
      } else {
        mum.health = clamp(mum.health - 2 + m.homeComfort * 0.05);
        if (Math.random() < 0.12 && mum.health < 88) mum.illDays = 2;
      }
      mum.status = mum.illDays > 1 ? 'ill' : (mum.illDays === 1 ? 'resting' : 'working');

      const report = { income: m.daily.income, expenses: m.daily.expenses, lateBills: m.lateBills };
      m.day += 1;
      m.minute = 480;
      m.cleanliness = clamp(m.cleanliness - 4);
      m.stress = clamp(m.stress - (10 + m.homeComfort * 0.18));
      m.daily = { income: 0, expenses: 0, coffeeIncome: 0, customers: 0 };
      G.save();
      return report;
    },
  };

  G.Management.ensure();
})();
