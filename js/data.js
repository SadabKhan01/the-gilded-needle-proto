'use strict';
/* The Gilded Needle prototype — content data.
   All positions are in IMAGE-SPACE pixels of the background art:
   Spindle Square 1672x941, interior.png 941x1672, wardrobe.png 1122x1402. */
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
    wool_sage:      { name: 'Sage Wool',       color: '#71845f', alt: '#e3e6d5', price: 9 },
    silk_rose:      { name: 'Rose Silk',       color: '#b96f7e', alt: '#fae5e8', price: 12 },
  };

  G.GARMENTS = ['Sunday dress', 'work apron', 'waistcoat', 'summer blouse', 'winter shawl', 'tea gown', 'picnic skirt'];

  G.MATERIALS = {
    thread:  { name: 'Strong Thread', icon: '🧵', price: 2 },
    buttons: { name: 'Button Card', icon: '🔘', price: 3 },
    lace:    { name: 'Lace Trim', icon: '〰️', price: 4 },
    ribbon:  { name: 'Ribbon Roll', icon: '🎀', price: 3 },
    zipper:  { name: 'Dress Zipper', icon: '🤐', price: 4 },
  };

  G.GARMENT_NOTIONS = {
    'Sunday dress': ['thread', 'lace', 'zipper'],
    'work apron': ['thread', 'buttons'],
    'waistcoat': ['thread', 'buttons'],
    'summer blouse': ['thread', 'buttons'],
    'winter shawl': ['thread', 'ribbon'],
    'tea gown': ['thread', 'lace', 'ribbon'],
    'picnic skirt': ['thread', 'zipper'],
  };

  // Positions are percentages over the supplied illustrated town map.
  G.MAP_LOCATIONS = [
    { id: 'tailor', title: 'The Gilded Needle', logo: 'assets/logos/tailor.svg', x: 39, y: 48, walkX: 43, walkY: 49, action: 'tailor', note: 'Return to Mari and Elise at Spindle Square.' },
    { id: 'sheep_farm', title: 'Briar Sheep Farm', logo: 'assets/logos/sheep-farm.svg', x: 17, y: 21, walkX: 24, walkY: 27, supplier: 'sheep_farm', note: 'Local wool and sturdy green plaid.' },
    { id: 'muslin_factory', title: 'Auberlin Muslin Works', logo: 'assets/logos/muslin-factory.svg', x: 46, y: 12, walkX: 43, walkY: 24, supplier: 'muslin_factory', note: 'Cotton, linen, and dependable thread.' },
    { id: 'fabric_store', title: 'Ribbon Row Fabrics', logo: 'assets/logos/fabric-store.svg', x: 35, y: 43, walkX: 37, walkY: 44, supplier: 'fabric_store', note: 'Everyday cloth, buttons, ribbon, and zippers.' },
    { id: 'charity_store', title: 'Second Stitch Charity Shop', logo: 'assets/logos/charity-store.svg', x: 54, y: 42, walkX: 55, walkY: 48, supplier: 'charity_store', note: 'Small discounted bundles with limited choice.' },
    { id: 'brickworks', title: 'Ashford Brickworks', logo: 'assets/logos/brickworks.svg', x: 82, y: 14, walkX: 72, walkY: 24, action: 'brickworks', note: 'The old works where Mari and Elise saved for the shop.' },
    { id: 'home', title: 'Thimm Family Home', logo: 'assets/logos/home.svg', x: 44, y: 69, walkX: 45, walkY: 63, action: 'home', note: 'Check on Mother and the comfort of home.' },
    { id: 'ship_deck', title: 'Madder Quay Imports', logo: 'assets/logos/ship-deck.svg', x: 84, y: 78, walkX: 76, walkY: 76, supplier: 'ship_deck', note: 'Imported silk, lace, ribbon, and fine fastenings.' },
  ];

  // Auberlin is a camera-scrolling town rather than a row of menu destinations.
  // Roads are stored as normalized coordinates so the world can grow without
  // repainting the traversal code. Broad radii include pavements and squares.
  G.WORLD = {
    img: 'world', w: 2508, h: 1412, playerH: 160, roadRadius: 70,
    roadNodes: [
      [24, 27], [24, 18], [32, 24], [43, 24], [50, 29], [31, 40],
      [37, 44], [43, 49], [55, 48], [65, 42], [72, 24], [83, 28],
      [84, 44], [53, 57], [45, 63], [34, 63], [25, 66], [18, 75],
      [43, 82], [61, 74], [76, 76], [76, 57], [17, 43], [25, 50],
      [40, 32], [61, 28], [68, 34], [66, 83], [70, 67], [59, 47]
    ],
    roadEdges: [
      [0, 1], [1, 2], [2, 3], [3, 4], [0, 22], [22, 23], [23, 5],
      [5, 6], [6, 24], [24, 3], [24, 7], [7, 8], [8, 29], [29, 9],
      [9, 26], [26, 25], [25, 4], [26, 10], [10, 11], [11, 12],
      [12, 21], [21, 9], [7, 13], [13, 14], [14, 15], [15, 23],
      [15, 16], [16, 17], [17, 18], [18, 14], [13, 29], [13, 19],
      [19, 28], [28, 21], [28, 20], [20, 27], [27, 19], [27, 18]
    ]
  };

  // Version-one city structure, rebuilt with street-level painted scenes.
  // Spindle Square remains the hub; the four district roads connect both back
  // to the square and around an outer loop. The illustrated town map is UI only.
  G.STREETS = {
    cinder: {
      name: 'Cinder Row', subtitle: 'The western working street', img: 'street_cinder',
      w: 1672, h: 941, groundY: 850, minX: 55, maxX: 1617, playerH: 160,
      left: { district: 'ribbon', spawn: 'right', label: 'Ribbon Row' },
      right: { mode: 'exterior', spawn: 'left', label: 'Spindle Square' },
      shops: [
        { x: 135, title: 'Hearth & Loaf Bakery', desc: 'Warm bread, currant buns, and yesterday’s loaves sold fairly.' },
        { x: 365, title: 'Klee Laundry & Mending', desc: 'Pressed linen, honest patches, and Cinder Row news.' },
        { x: 595, title: 'Chestnut Grocer', desc: 'Crates of apples, roots, herbs, and kitchen staples.' },
        { x: 825, title: 'The Last & Awl', desc: 'Work boots and careful repairs for long days on cobbles.' },
        { x: 1060, title: 'Mallow Apothecary', desc: 'Soap, liniment, lavender, and practical remedies.' },
        { x: 1300, title: 'Old Lamp Books', desc: 'Secondhand novels, ledgers, and pattern catalogues.' },
        { x: 1530, title: 'Second Stitch', supplier: 'charity_store', desc: 'Donated garments and useful remnants given another life.' },
      ]
    },
    ribbon: {
      name: 'Ribbon Row', subtitle: 'Auberlin’s cloth and notions market', img: 'street_ribbon',
      w: 1672, h: 941, groundY: 850, minX: 55, maxX: 1617, playerH: 160,
      left: { district: 'crownway', spawn: 'right', label: 'Crownway' },
      right: { district: 'cinder', spawn: 'left', label: 'Cinder Row' },
      shops: [
        { x: 125, title: 'Ribbon Row Fabrics', supplier: 'fabric_store', desc: 'Bolts of gingham, plaid, linen, and dependable everyday cloth.' },
        { x: 350, title: 'The Ribbon Cabinet', supplier: 'fabric_store', desc: 'Ribbons, trims, fastenings, and bright finishing touches.' },
        { x: 585, title: 'Second Stitch Arcade', supplier: 'charity_store', desc: 'A tidy rail of pre-loved clothes and discounted remnants.' },
        { x: 820, title: 'Madame Orla’s Millinery', desc: 'Hats for rain, weddings, market days, and being noticed.' },
        { x: 1055, title: 'Button & Bone', supplier: 'fabric_store', desc: 'Drawers of buttons, buckles, hooks, and dress fastenings.' },
        { x: 1300, title: 'Rosehip Tea Room', desc: 'Tea, little cakes, and two tables always saved for working women.' },
        { x: 1530, title: 'Form & Figure', desc: 'Dress forms, display stands, and carved wooden hangers.' },
      ]
    },
    larkspur: {
      name: 'Larkspur Boulevard', subtitle: 'The eastern promenade', img: 'street_larkspur',
      w: 1672, h: 941, groundY: 850, minX: 55, maxX: 1617, playerH: 160,
      left: { mode: 'exterior', spawn: 'right', label: 'Spindle Square' },
      right: { district: 'crownway', spawn: 'left', label: 'Crownway' },
      shops: [
        { x: 125, title: 'Violet Glass Perfumery', desc: 'Small cut-glass bottles and scents named after gardens.' },
        { x: 350, title: 'Larkspur Flowers', desc: 'A narrow conservatory full of roses, ferns, and climbing jasmine.' },
        { x: 590, title: 'Marchand Fine Shoes', desc: 'Hand-lasted shoes displayed like little sculptures.' },
        { x: 825, title: 'Blue Finch Jewellers', desc: 'Cameos, lockets, watch chains, and restrained goldwork.' },
        { x: 1060, title: 'Alba & Sons Atelier', desc: 'A gleaming rival dress atelier whose mannequins never slouch.' },
        { x: 1300, title: 'Heron Porcelain', desc: 'Tea sets, serving plates, and painted keepsake boxes.' },
        { x: 1530, title: 'The Gilt Leaf', desc: 'New books, society papers, and imported fashion folios.' },
      ]
    },
    crownway: {
      name: 'Crownway', subtitle: 'The northern civic avenue', img: 'street_crownway',
      w: 1672, h: 941, groundY: 850, minX: 55, maxX: 1617, playerH: 160,
      left: { district: 'larkspur', spawn: 'right', label: 'Larkspur Boulevard' },
      right: { district: 'ribbon', spawn: 'left', label: 'Ribbon Row' },
      shops: [
        { x: 125, title: 'Bell & Balance Clockmakers', desc: 'Clocks, watches, and patient repairs beneath the city bell.' },
        { x: 350, title: 'Quill & Seal Stationers', desc: 'Paper, ink, ledgers, invitations, and sealing wax.' },
        { x: 590, title: 'Auberlin Music House', desc: 'Violins, brass horns, sheet music, and practice-room gossip.' },
        { x: 825, title: 'Crownway Uniforms', desc: 'Ceremonial coats cut sharply and built to last.' },
        { x: 1060, title: 'The Plum Parasol', desc: 'Umbrellas and walking canes for every kind of weather.' },
        { x: 1300, title: 'Atlas & Copper Prints', desc: 'Town plans, engravings, landscapes, and framed maps.' },
        { x: 1530, title: 'Campanile Café', desc: 'Strong coffee served within earshot of the great clock.' },
      ]
    }
  };

  G.SUPPLIERS = {
    sheep_farm: {
      title: 'Briar Sheep Farm', logo: 'assets/logos/sheep-farm.svg', modifier: 0.9,
      desc: 'Farm wool is strong, warm, and cheaper when Mari makes the trip herself.',
      fabrics: ['wool_sage', 'plaid_green'], materials: ['thread'],
    },
    muslin_factory: {
      title: 'Auberlin Muslin Works', logo: 'assets/logos/muslin-factory.svg', modifier: 0.9,
      desc: 'Factory ends and dependable bolts for everyday commissions.',
      fabrics: ['linen_cream', 'cotton_lavender', 'gingham_blue'], materials: ['thread', 'buttons'],
    },
    fabric_store: {
      title: 'Ribbon Row Fabrics', logo: 'assets/logos/fabric-store.svg', modifier: 1,
      desc: 'The broadest practical selection in town, sold one dress-length at a time.',
      fabrics: ['gingham_red', 'gingham_blue', 'gingham_pink', 'plaid_brown', 'plaid_green'], materials: ['thread', 'buttons', 'ribbon', 'zipper'],
    },
    charity_store: {
      title: 'Second Stitch Charity Shop', logo: 'assets/logos/charity-store.svg', modifier: 0.7,
      desc: 'Donated remnants are inexpensive, but the selection is never guaranteed.',
      fabrics: ['gingham_red', 'plaid_brown', 'linen_cream'], materials: ['buttons', 'lace'],
    },
    ship_deck: {
      title: 'Madder Quay Imports', logo: 'assets/logos/ship-deck.svg', modifier: 1.25,
      desc: 'Fine imported cloth and finishing notions for customers who expect something special.',
      fabrics: ['silk_rose', 'cotton_lavender'], materials: ['lace', 'ribbon', 'zipper'],
    },
  };

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
    'I need a {garment} made from scratch in {fabric}. I know it is not ready yet — could you sew it for me?',
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

  // ---------- EXTERIOR scene (supplied Spindle Square artwork 1672x941) ----------
  G.EXTERIOR = {
    img: 'exterior',
    w: 1672, h: 941,
    groundY: 858,          // player's feet line
    minX: 55, maxX: 1615,
    playerH: 160,
    start: { x: 610 },
    hotspots: [
      { id: 'door', label: 'Enter the tailor shop', x: 360, y: 805, r: 110, icon: '🚪' },
      { id: 'chalkboard', label: 'Read the chalkboard', x: 125, y: 815, r: 85, icon: '📋' },
      { id: 'sign', label: 'Admire the tailor sign', x: 92, y: 610, r: 78, icon: '🪧' },
      { id: 'window_left', label: 'Study the window display', x: 220, y: 780, r: 90, icon: '🧵' },
      { id: 'carriage', label: 'Take Crownway', x: 715, y: 790, r: 105, icon: '↟' },
      { id: 'fountain', label: 'Take Ribbon Row', x: 1010, y: 820, r: 115, icon: '↓' },
      { id: 'flowers', label: 'Visit the flower conservatory', x: 1470, y: 790, r: 115, icon: '💐' },
    ],
  };

  G.EXTERIOR_FLAVOR = {
    chalkboard: ['"Custom Fit — Timeless Style." Mother held the board while I chalked it. Both our hands were shaking a little.'],
    sign: ['My own sign. Six years of brick dust bought that little painted coat.', 'Grandmother Brida\'s thimble is buried in the mortar under it. For luck.'],
    window_left: ['The display suit took me three weeks. The Duke himself couldn\'t buy it — it\'s not for sale.'],
    carriage: ['A delivery carriage from Madder Quay. Perhaps there is rose silk on board — if the order book can justify it.'],
    fountain: ['Spindle Square looks grand in the sunlight. Grandmother would have called it showing off. Mother simply calls it beautiful.'],
    flowers: ['The conservatory is full of climbing roses. Elise trades coffee grounds for bruised blooms at closing time.'],
  };

  // ---------- INTERIOR scene (interior.png 941x1672) ----------
  G.INTERIOR = {
    img: 'interior',
    w: 941, h: 1672,
    playerH: 154,
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
      { id: 'mother', label: 'Talk to Mother', x: 610, y: 790, r: 90, icon: '💚' },
      { id: 'sofa', label: 'Rest on the sofa', x: 320, y: 520, r: 95, icon: '🛋️' },
      { id: 'hearth', label: 'The hearth', x: 300, y: 300, r: 95, icon: '🔥' },
      { id: 'painting', label: 'Framed picture', x: 860, y: 420, r: 85, icon: '🖼️' },
      { id: 'fabrics', label: 'Fabric shelves', x: 110, y: 1080, r: 90, icon: '🧵' },
    ],
  };

  G.INTERIOR_FLAVOR = {
    coffee: ['Cheap coffee keeps waiting customers warm. Mother calls it good business. Grandmother would have asked for two sugars.'],
    mother: ['Elise smooths her apron. "Do not promise a dress until you have counted the thread as well as the cloth, Mari."', '"Use the town map when the shelves run low. A good order starts before the first cut."'],
    hearth_after: ['The fire pops. The brick dust is behind me now — but I keep a few rough bricks by the hearth, so I never forget the weight of them.'],
    sofa_after: ['I could almost hear her: "Watch the needle, Mari, not your fingers."'],
    painting_after: ['Mother in cream linen. The best seam I ever closed.'],
  };

  // ---------- HOME scene (generated bare-home artwork 1672x941) ----------
  G.HOME = {
    img: 'home',
    w: 1672, h: 941,
    playerH: 156,
    bounds: { minX: 150, maxX: 1515, minY: 325, maxY: 815 },
    start: { x: 835, y: 790 },
    blocks: [
      [135, 265, 390, 440],      // single bed
      [1010, 230, 520, 320],     // bare kitchen counter and basin
    ],
    hotspots: [
      { id: 'exit', label: 'Return to the town map', x: 835, y: 825, r: 95, icon: '🚪' },
      { id: 'bed', label: 'The only bed', x: 390, y: 595, r: 130, icon: '🛏️' },
      { id: 'lamp', label: 'The oil light', x: 270, y: 245, r: 90, icon: '💡' },
      { id: 'kitchen', label: 'Empty kitchen', x: 1260, y: 500, r: 175, icon: '🪙' },
    ],
  };

  G.HOME_FLAVOR = {
    bed: ['One bed for two people. Mother takes it when she is ill; I make a pallet from coats beside her.'],
    lamp: ['One flame, one room. Oil is cheaper when we remember to turn it low.'],
    kitchen: ['A counter, a basin, and empty spaces. A stove and icebox will come when the shop can pay for them.'],
  };

})();
