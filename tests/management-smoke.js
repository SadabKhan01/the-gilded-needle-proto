'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const storage = new Map();
const sandbox = {
  console,
  Math,
  Date,
  setTimeout,
  clearTimeout,
  localStorage: {
    getItem: k => storage.has(k) ? storage.get(k) : null,
    setItem: (k, v) => storage.set(k, String(v)),
    removeItem: k => storage.delete(k),
  },
  document: { getElementById: () => null },
  requestAnimationFrame: () => {},
};
sandbox.window = sandbox;
sandbox.window.addEventListener = () => {};
vm.createContext(sandbox);

for (const file of ['js/engine.js', 'js/data.js', 'js/management.js', 'js/ui.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox, { filename: file });
}

const G = sandbox.G;
const notices = [];
G.UI = {
  toast: text => notices.push(text),
  coinToast: n => notices.push('coins:' + n),
  updateHUD: () => {},
};
G.Audio = { play: () => {} };

G.resetSave();
G.Management.ensure();
assert.equal(G.S.management.day, 1);
assert.equal(G.S.management.cleanliness, 82);
assert.equal(G.S.materials.thread, 4);
assert.equal(G.MAP_LOCATIONS.length, 8);
assert.ok(G.MAP_LOCATIONS.every(loc => loc.logo.endsWith('.svg')));
assert.ok(G.MAP_LOCATIONS.every(loc => Number.isFinite(loc.walkX) && Number.isFinite(loc.walkY)));
assert.deepEqual(Object.keys(G.STREETS), ['cinder', 'ribbon', 'larkspur', 'crownway']);
assert.equal(Object.values(G.STREETS).reduce((sum, street) => sum + street.shops.length, 0), 28);
assert.ok(Object.values(G.STREETS).every(street => street.left && street.right));
assert.equal(G.STREETS.cinder.left.district, 'ribbon');
assert.equal(G.STREETS.ribbon.left.district, 'crownway');
assert.equal(G.STREETS.crownway.left.district, 'larkspur');
assert.equal(G.STREETS.larkspur.left.mode, 'exterior');
for (const loc of G.MAP_LOCATIONS) assert.ok(fs.existsSync(path.join(root, loc.logo)), `missing crest: ${loc.logo}`);
assert.ok(fs.existsSync(path.join(root, 'assets/auberlin-npcs.png')));
for (const file of ['street-cinder-row.png', 'street-ribbon-row.png', 'street-larkspur.png', 'street-crownway.png']) {
  assert.ok(fs.existsSync(path.join(root, 'assets', file)), `missing street: ${file}`);
}

const dressOrder = {
  kind: 'sew', status: 'open', name: 'Material test', fabric: 'gingham_red',
  materials: [{ id: 'thread', qty: 1 }, { id: 'zipper', qty: 1 }],
};
G.Orders.add(dressOrder);
const redBefore = G.S.fabrics.gingham_red;
const threadBefore = G.S.materials.thread;
assert.equal(G.Management.orderMaterialStatus(dressOrder).ready, true);
assert.equal(G.Management.reserveOrderMaterials(dressOrder).ok, true);
assert.equal(G.S.fabrics.gingham_red, redBefore - 1);
assert.equal(G.S.materials.thread, threadBefore - 1);
assert.equal(dressOrder.materialsReserved, true);
G.Orders.remove(dressOrder);

G.S.coins = 20;
const laceBefore = G.S.materials.lace;
assert.equal(G.Management.buySupply('ship_deck', 'material', 'lace').ok, true);
assert.equal(G.S.materials.lace, laceBefore + 1);

G.S.coins = 100;
const comfortBeforeIcebox = G.S.management.homeComfort;
assert.equal(G.Management.buyHome('icebox').ok, true);
assert.equal(G.S.management.home.icebox, true);
assert.equal(G.S.management.homeComfort, comfortBeforeIcebox + G.Management.homeItems.icebox.comfort);

G.Orders.add({ kind: 'sew', status: 'open', name: 'Reload test' });
const persistedOrderId = G.Orders.list[0].id;
G.Orders.list = [];
G.load();
assert.equal(G.Orders.list.length, 1);
assert.equal(G.Orders.list[0].id, persistedOrderId);
G.Orders.remove(G.Orders.list[0]);
assert.equal(G.S.orders.length, 0);

const order = G.Management.enrichOrder({ pay: 20, practice: false });
assert.equal(order.dueDay, 2);
assert.equal(order.deposit, 5);
const coinsBeforeDeposit = G.S.coins;
G.Management.recordDeposit(order.deposit);
assert.equal(G.S.coins, coinsBeforeDeposit + 5);

const customer = { state: 'entering' };
G.Management.onCustomerSpawn(customer);
assert.equal(G.S.management.daily.customers, 1);
assert.ok(G.S.management.cleanliness < 82);
assert.ok(G.S.management.trash.length > 0);

const trashId = G.S.management.trash[0].id;
const dirty = G.S.management.cleanliness;
assert.equal(G.Management.cleanTrash(trashId), true);
assert.ok(G.S.management.cleanliness > dirty);

G.S.coins = 100;
assert.equal(G.Management.payBill('rent').ok, true);
assert.equal(G.S.management.bills.rent.paid, true);
assert.equal(G.Management.buyHome('chair').ok, true);
assert.equal(G.S.management.home.chair, true);
assert.ok(G.S.management.homeComfort > 5);

G.S.ordersDone = 4;
assert.equal(G.Management.hireHelper().ok, true);
assert.equal(G.S.management.staff.helper, true);

const previousDay = G.S.management.day;
const report = G.Management.closeDay();
assert.equal(G.S.management.day, previousDay + 1);
assert.equal(G.S.management.minute, 480);
assert.equal(typeof report.income, 'number');

console.log('management smoke test: ok');
