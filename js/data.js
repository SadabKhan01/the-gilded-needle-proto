'use strict';
/* The Gilded Needle prototype — content data.
   All positions are in IMAGE-SPACE pixels of the background art:
   exterior.png 1254x1254, interior.png 941x1672, wardrobe.png 1122x1402. */
window.G = window.G || {};

(function () {

  // ---------- fabrics ----------
  G.FABRICS = {
    gingham_red:    { name: 'Red Gingham',     color: '#c0392b', alt: '#f6e7d7', price: 5 },
    gingham_blue:   { name: 'Blue Gingham',    color: '#3d6fa8', alt: '#eef2f7', price: 5 },
    gingham_pink:   { name: 'Pink Gingham',    color: '#d97b9c', alt: '#fbeef2', price: 6 },
    plaid_brown:    { name: 'Brown Plaid',     color: '#7a5230', alt: '#d8c39a', price: 6 },
    plaid_green:    { name: 'Green Plaid',     color: '#5d7a45', alt: '#e4e8d2', price: 7 },
    linen_cream:    { name: 'Cream Linen',     color: '#e8dcc0', alt: '#f6efdd', price: 4 },
    cotton_lavender:{ name: 'Lavender Cotton', color: '#9a86b8', alt: '#efe9f6', price: 7 },
  };

  G.GARMENTS = ['Sunday dress', 'work apron', 'waistcoat', 'summer blouse', 'winter shawl', 'tea gown', 'picnic skirt'];

  // ---------- upgrades ----------
  G.UPGRADES = {
    shears:  { name: 'Sharper Shears',  desc: 'Bigger cutting marks — easier to snip true.', price: 40 },
    machine: { name: 'Oiled Machine',   desc: 'A smoother wheel — wider stitching sweet spot.', price: 60 },
    display: { name: 'Window Display',  desc: 'Passers-by pay 25% more for your work.', price: 100 },
  };

  // ---------- wardrobe catalog (5 cols x 7 rows on wardrobe.png) ----------
  // grid geometry in wardrobe image space
  G.WARDROBE_GRID = {
    colX: [131, 274, 417, 560, 703],
    rowY: [228, 418, 600, 772, 942, 1108, 1258],
    cellW: 132, cellH: 158,
  };
  // per-row [color, pattern], then 5 style entries per row
  const ROWS = [
    { color: 'red',   pattern: 'gingham', styles: ['halter', 'puff-sleeve', 'lace corset', 'wrap', 'bow-front'] },
    { color: 'pink',  pattern: 'gingham', styles: ['puff-sleeve', 'sweetheart', 'collared vest', 'ruffle-strap', 'buttoned'] },
    { color: 'blue',  pattern: 'gingham', styles: ['puff-sleeve', 'bow-front', 'ruched tube', 'buttoned', 'smocked'] },
    { color: 'yellow',pattern: 'gingham', styles: ['bow-strap', 'off-shoulder', 'green vest', 'strap', 'halter vest'] },
    { color: 'brown', pattern: 'plaid',   styles: ['halter-bow', 'ruffle', 'halter', 'vest', 'smocked'] },
    { color: 'black', pattern: 'plaid',   styles: ['puff-sleeve', 'buttoned', 'smocked', 'halter', 'strap'] },
    { color: 'maroon',pattern: 'plaid',   styles: ['lace-trim', 'laced', 'off-shoulder', 'tie-front', 'buttoned'] },
  ];
  // a few cells deviate from the row theme — patch them so requests stay honest
  const CELL_OVERRIDES = {
    '0,3': { color: 'pink', pattern: 'stripe' },   // row 0 col 3: pink striped halter
    '0,4': { color: 'pink', pattern: 'gingham' },
    '1,1': { color: 'red' },                       // red gingham sweetheart among the pinks
    '1,2': { pattern: 'plaid' },                   // pink plaid collared vest
    '2,3': { color: 'navy', pattern: 'plaid' },
    '2,4': { color: 'navy', pattern: 'plaid' },
    '3,2': { color: 'green', pattern: 'plaid' },
    '3,3': { color: 'green', pattern: 'gingham' },
    '3,4': { color: 'green', pattern: 'plaid' },
    '5,0': { pattern: 'gingham' },                 // black gingham puff-sleeve
    '5,2': { pattern: 'gingham' },                 // black gingham smocked
    '6,2': { color: 'red', pattern: 'gingham' },
  };
  G.TOPS = [];
  ROWS.forEach((row, r) => {
    row.styles.forEach((style, c) => {
      const o = CELL_OVERRIDES[r + ',' + c] || {};
      G.TOPS.push({
        id: 't' + r + c, row: r, col: c,
        color: o.color || row.color,
        pattern: o.pattern || row.pattern,
        style,
        x: G.WARDROBE_GRID.colX[c], y: G.WARDROBE_GRID.rowY[r],
      });
    });
  });
  // wardrobe doll spot (feedback bubble anchor)
  G.WARDROBE_DOLL = { x: 940, y: 620 };

  // ---------- customers ----------
  G.CUSTOMER_NAMES = ['Mrs. Tansy', 'Odile Marchand', 'Berta Klee', 'Sylvie Marsh', 'Pim', 'Iva', 'Countess Elowen', 'Mr. Corvin Alba', 'Steward Quill'];
  G.CUSTOMER_LOOKS = [
    { hair: '#5a3a22', dress: '#7d9bb8', skin: '#f6d7bc' },
    { hair: '#2e2620', dress: '#a86868', skin: '#eec39d' },
    { hair: '#8a8a8a', dress: '#6f7d5a', skin: '#f6d7bc' },
    { hair: '#a8683a', dress: '#8f6fa8', skin: '#fbe3cd' },
    { hair: '#3a3a52', dress: '#c9a266', skin: '#eec39d' },
  ];

  G.SEW_LINES = [
    'Could you sew me a {garment} from {fabric}? Nothing fancy — just made with care.',
    'My old {garment} finally gave up. A new one in {fabric}, please?',
    "I saw your window and thought: {fabric}! A {garment}, if you'd be so kind.",
    'The fair is on Sunday and I have nothing to wear. A {garment} in {fabric}?',
  ];
  G.OUTFIT_LINES = [
    "I'm after a ready-made top — {want}. May I see the wardrobe?",
    'Something off the shelf today: {want}, I think.',
    'My niece wants {want}. You always know the one.',
  ];
  G.THANKS_LINES = [
    'Oh, it\'s lovely! Grandmother Brida would be proud of you.',
    'Perfect fit. I\'ll tell everyone on Ribbon Row about this place.',
    'Beautiful work, dear. Worth every coin.',
    'Stitched like a dream. Thank you, Mari!',
  ];

  // ---------- flashbacks ----------
  G.MEMORIES = {
    grandmother: {
      title: "Brida's Lessons",
      trigger: 'the old sofa',
      pages: [
        'The sofa smells faintly of chamomile and machine oil — like Grandmother Brida\'s lap.',
        'Four of us shared two rooms in Cinder Row. When Mother worked late, Brida would light one stub of candle and turn the kitchen table into a sewing room.',
        '"Watch the needle, Mari, not your fingers," she\'d whisper. "A straight seam is a small honest thing. Enough small honest things make a life."',
        'She could make one good shirt from two worn ones. She called it thrift. I know now it was a kind of courage.',
      ],
      reward: 5,
    },
    factory: {
      title: 'Brick Dust',
      trigger: 'the firewood by the hearth',
      pages: [
        'The rough clay bricks by the fire still make my palms ache, just to look at them.',
        'Six years at the Ashford brickworks with Mother and Tomas. Carrying, stacking, counting. Ten hours a day, and every seventh coin into the tea tin under my cot.',
        'The other girls thought I was saving for a dowry. I was saving for a shop sign. On the worst days I would sketch dresses in the brick dust with a stick, and the foreman would shout, and I would smile and wipe them away.',
        'I already had every one of them by heart. Tomas used to keep watch for the foreman. I still write to him now; recovery asks for honest work of its own.',
      ],
      reward: 5,
    },
    royal: {
      title: 'The Servants\' Stair',
      trigger: 'the framed picture',
      pages: [
        'A little framed print of a grand house. It could almost be Harrowgate.',
        'I remember delivery carts from Larkspur Boulevard rolling past the brickworks — silk like poured cream, and my mother\'s red hands lifting another load.',
        '"One day," I told her, "I\'ll make dresses like that, and YOU will wear one in our own warm home."',
        'Mother laughed. But last spring, on her birthday, she stood in this very shop in cream linen and lavender cotton, and she cried, and so did I.',
      ],
      reward: 5,
    },
  };

  G.INTRO_PAGES = [
    'Auberlin, 1972.',
    'Mari Thimm — Brida\'s granddaughter, Elise\'s daughter, six long years a brick-carrier at the Ashford works —',
    '— finally turns her own key, in her own door, under her own sign:',
    'THE GILDED NEEDLE.\n\nEvery spare coin in the tea tin bought this key. The rent is due Friday. Mother is already making coffee.',
    'Help Mari and Elise serve customers, keep the lights on, care for their home, and turn Brida\'s lessons into a future.',
  ];

  // ---------- EXTERIOR scene (exterior.png 1254x1254) ----------
  G.EXTERIOR = {
    img: 'exterior',
    w: 1254, h: 1254,
    groundY: 1168,          // player's feet line
    minX: 70, maxX: 1190,
    playerH: 165,
    start: { x: 200 },
    hotspots: [
      { id: 'door', label: 'Enter the shop', x: 640, y: 1130, r: 120, icon: '🚪' },
      { id: 'chalkboard', label: 'Read the chalkboard', x: 295, y: 1140, r: 95, icon: '📋' },
      { id: 'sign', label: 'Admire the sign', x: 232, y: 1100, r: 80, icon: '🪧' },
      { id: 'window_left', label: 'Peek in the window', x: 440, y: 1120, r: 95, icon: '🧵' },
      { id: 'window_right', label: 'Peek at the fabrics', x: 865, y: 1120, r: 95, icon: '🧶' },
      { id: 'lavender', label: 'Smell the lavender', x: 1060, y: 1150, r: 95, icon: '💐' },
      { id: 'bird', label: 'Greet the sparrow', x: 150, y: 1120, r: 80, icon: '🐦' },
    ],
  };

  G.EXTERIOR_FLAVOR = {
    chalkboard: ['"Custom Fit — Timeless Style." Mother held the board while I chalked it. Both our hands were shaking a little.'],
    sign: ['My own sign. Six years of brick dust bought that little painted coat.', 'Grandmother Brida\'s thimble is buried in the mortar under it. For luck.'],
    window_left: ['The display suit took me three weeks. The Duke himself couldn\'t buy it — it\'s not for sale.'],
    window_right: ['Bolts of gingham and good wool plaid. Every one chosen at the Ribbon Row market at dawn.'],
    lavender: ['Lavender keeps the moths from the wool — and it smells like a promise.'],
    bird: ['The sparrow was here the day I signed the lease. I call him Mr. Buttons.', 'Mr. Buttons tilts his head. No crumbs today, sir — paying customers first.'],
  };

  // ---------- INTERIOR scene (interior.png 941x1672) ----------
  G.INTERIOR = {
    img: 'interior',
    w: 941, h: 1672,
    playerH: 118,
    bounds: { minX: 78, maxX: 872, minY: 120, maxY: 1610 },
    start: { x: 465, y: 1520 },     // just inside the door
    doorSpot: { x: 465, y: 1590 },
    counterSpot: { x: 590, y: 1240 }, // where customers stand
    // blocking furniture rectangles [x, y, w, h]
    blocks: [
      [0, 40, 300, 270],        // fireplace
      [90, 350, 280, 340],      // sofa + coffee table + rug edge
      [405, 280, 165, 390],     // cutting table (green mat)
      [418, 600, 140, 80],      // shelf under cutting table
      [610, 90, 170, 390],      // coffee / espresso counter column
      [770, 320, 171, 400],     // right-wall clothes rack shelf
      [300, 95, 130, 60],       // mannequin (red gingham, top wall)
      [683, 605, 82, 120],      // mannequin (pink, centre-right)
      [800, 850, 110, 150],     // mannequin (brown plaid, right)
      [115, 735, 235, 200],     // sewing table 1
      [115, 1000, 235, 205],    // sewing table 2
      [0, 860, 80, 420],        // left wall fabric shelves
      [395, 995, 170, 455],     // big work table (centre-low)
      [648, 925, 130, 600],     // checkout counter (computer)
      [838, 1020, 103, 560],    // right wall lower shelves
      [95, 1255, 165, 180],     // mannequin (pink, bottom-left) + rug
      [60, 1480, 270, 140],     // bottom-left fabric rolls
      [660, 1520, 281, 152],    // bottom-right shelf strip
    ],
    hotspots: [
      { id: 'exit', label: 'Leave the shop', x: 465, y: 1600, r: 90, icon: '🚪' },
      { id: 'sewing1', label: 'Sewing machine', x: 235, y: 950, r: 100, icon: '🪡' },
      { id: 'sewing2', label: 'Sewing machine', x: 235, y: 1215, r: 100, icon: '🪡' },
      { id: 'cutting', label: 'Cutting table', x: 487, y: 700, r: 100, icon: '✂️' },
      { id: 'mannequin1', label: 'Dress the mannequin', x: 340, y: 175, r: 95, icon: '👗' },
      { id: 'mannequin2', label: 'Dress the mannequin', x: 724, y: 745, r: 90, icon: '👗' },
      { id: 'mannequin3', label: 'Dress the mannequin', x: 175, y: 1230, r: 95, icon: '👗' },
      { id: 'rack', label: 'Browse the wardrobe', x: 800, y: 545, r: 100, icon: '👚' },
      { id: 'counter', label: 'Shop ledger', x: 600, y: 1240, r: 95, icon: '📒' },
      { id: 'coffee', label: 'Coffee corner', x: 590, y: 500, r: 90, icon: '☕' },
      { id: 'sofa', label: 'Rest on the sofa', x: 320, y: 520, r: 95, icon: '🛋️' },
      { id: 'hearth', label: 'The hearth', x: 300, y: 300, r: 95, icon: '🔥' },
      { id: 'painting', label: 'Framed picture', x: 860, y: 420, r: 85, icon: '🖼️' },
      { id: 'fabrics', label: 'Fabric shelves', x: 110, y: 1080, r: 90, icon: '🧵' },
    ],
  };

  G.INTERIOR_FLAVOR = {
    coffee: ['Cheap coffee keeps waiting customers warm. Mother calls it good business. Grandmother would have asked for two sugars.'],
    hearth_after: ['The fire pops. The brick dust is behind me now — but I keep a few rough bricks by the hearth, so I never forget the weight of them.'],
    sofa_after: ['I could almost hear her: "Watch the needle, Mari, not your fingers."'],
    painting_after: ['Mother in cream linen. The best seam I ever closed.'],
  };

})();
