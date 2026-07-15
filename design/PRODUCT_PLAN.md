# The Gilded Needle - Product and Game Design Plan

Status: production canon, July 2026  
Target: browser-first 2D story and shop-management game  
Design pillars: dignity, craft, family, gradual stability, readable decisions

## 1. Concept

Marielle Thimm is a young tailor from Auberlin's Cinder Row. After years carrying bricks beside her mother Elise and saving coins in a tea tin, she buys a worn shop on Spindle Square. Her late grandmother Brida taught her to sew; the shop is Marielle's livelihood and the living continuation of those lessons. Elise helps with customers and supplies when her health allows. Marielle's brother Tomas is serving a sentence after addiction-related trouble and appears only through humane, optional letters.

The player runs each day as a chain of choices: care for the home, open and clean the shop, accept orders, source materials, sew garments, manage patience, pay necessities, and decide when growth is safe. Success is not becoming rich quickly. It is making the home warmer, making work sustainable, and building a respected atelier without abandoning Cinder Row.

## 2. Canon merge decisions

The user's family and shop-management premise overrides the older inheritance/train premise. Claude's strongest work remains canon where it supports that premise:

- Auberlin, Cinder Row, Ribbon Row, Larkspur Boulevard, Crownway, and Spindle Square remain.
- Marielle, Brida, the Gilded Needle, the procedural pixel-art engine, The Seam minigame, fabric/garment catalog, customers, reputation tiers, and coronation capstone remain.
- Marielle bought the shop with brick-factory savings. She did not inherit it or arrive with a one-way ticket.
- Elise Thimm is Marielle's mother and working partner. Her illness creates capacity constraints, not punishment.
- Tomas Thimm is Marielle's brother. His recovery is conveyed through letters; substance use is never shown or gamified.
- Gathering zones become procurement destinations with purchase, salvage, favors, and limited cozy hazards. Combat is optional flavor, not the economic center.
- Home comfort and essentials come before prestige shop upgrades.
- Poverty is represented through constrained choices and community networks, never dirt-as-morality or misery spectacle.

## 3. Player promise

In a 20-30 minute session, the player should be able to complete one meaningful garment, resolve one customer story, and make one visible improvement to either stability, home, skill, or community standing.

## 4. Core loops

### Daily loop

1. Wake at home; read the day card, mother status, bills, and orders due.
2. Choose food/medicine/rest priorities and a material route.
3. Travel to the shop and clean or restock before opening.
4. Accept, decline, or renegotiate customer orders.
5. Check pattern and material requirements.
6. Source missing materials personally or assign Elise/a hired runner.
7. Cut and sew using The Seam; quality depends on preparation and execution.
8. Deliver ready orders; handle tips, underpayment, lateness, or charity decisions.
9. Close the shop; pay essentials, purchase a home item, or save.
10. End the day with a short household scene, letter, memory, or quiet summary.

### Long loop

Stability -> dependable neighborhood shop -> sustainable team -> respected atelier -> coronation commission. Reputation unlocks customers, but household stability unlocks the emotional ending.

## 5. Day structure

| Phase | Time | Main pressure | Player agency |
|---|---:|---|---|
| Morning | 06:00-08:00 | health and necessities | budget, route, delegation |
| Shop hours | 08:00-18:00 | customers and deadlines | accept, price, clean, sew, serve |
| Procurement | flexible | time and material cost | buy, salvage, favor, substitute |
| Evening | 18:00-22:00 | fatigue and bills | close early, finish urgent work, go home |
| Night | sleep | recovery | save, household scene, next-day preview |

The player may close early without a fail state. The cost is opportunity, not shame.

## 6. Orders

Every order stores customer, garment, fabric, notions, quantity, accepted day, due time, base pay, deposit, patience, quality target, cleanliness sensitivity, budget class, and story tags.

Order types:

- Simple blouse: low complexity, tutorial-friendly.
- Peplum top: pattern accuracy emphasis.
- Gingham dress: matching/cutting emphasis.
- Repair: low material use, short deadline, community value.
- Custom dress: measurements plus fabric choice.
- Bulk order: capacity planning and delegation.
- Urgent order: premium pay with stress cost.
- High-class commission: strict quality and cleanliness.
- Charity request: low cash reward, strong relationship/reputation reward.

Acceptance choices are Accept, Renegotiate, Substitute, Refer, Charity, and Decline kindly. Deposits prevent catastrophic material losses. Customers who underpay become dialogue decisions; the game does not randomly erase earned income.

## 7. Customer behavior

Customers have patience, budget, expectations, mess likelihood, coffee preference, reliability, and relationship. Archetypes guide behavior but never map wealth to kindness.

- Rushed commuter: short patience, tips for on-time work.
- Proud neighbor: low budget, values repair and discretion.
- Demanding patron: high quality, high pay, sensitive to mess.
- Kind regular: flexible deadline, brings referrals.
- Haggler: negotiates before acceptance, never after finished work without a player response.
- Charity client: accepts substitutions and can repay through favors.
- Bulk buyer: creates staffing and inventory pressure.

## 8. Tailoring pipeline

Measure -> choose pattern -> choose fabric -> cut -> sew -> finish -> inspect -> package.

MVP uses one interactive minigame, The Seam, and menu decisions for the other stages. Full game adds pattern placement, fabric-direction matching, button/zipper finishing, and fitting corrections. Preparation creates wider timing windows; stress and poor tools narrow them. Accessibility mode can replace timing with hold-to-stitch.

Completion always shows `MANUFACTURING COMPLETE`, garment quality, material waste, delivery deadline, and an optional retry before packaging.

## 9. Materials and procurement

| Destination | Primary goods | Method | Tradeoff |
|---|---|---|---|
| Sheep farm | wool, yarn | buy/help/shear | cheap, time-heavy |
| Weftworks/muslin factory | muslin, cotton | mill lots/salvage | dust and limited stock |
| Ribbon Row fabric stores | gingham, plaid, notions | reliable purchase | higher price |
| Madder docks | imported lace, zippers, silk | auction/salvage | rare, volatile stock |
| Charity store | second-hand cloth/buttons | discounted bundles | inconsistent colors |
| Brickworks | story quests, workwear clients | relationships | emotional history |

Materials track quantity, quality, color/pattern, supplier, ethical tag, and reserved amount. Accepted orders reserve stock so crafting cannot consume it accidentally.

## 10. Shop systems

### Cleanliness

Dust, cups, tissues, scraps, and thread reduce cleanliness. The shop has visible trash nodes in the full implementation. Below 60, patience falls; below 35, cleanliness-sensitive customers refuse new orders. Cleaning costs time/stamina and can be delegated. Cleanliness is a service condition, not a judgment about Marielle's class.

### Coffee

Coffee costs stock, adds small income, and grants waiting customers patience. Cups add mess. Later upgrades add reusable cups and a helper. A dirty coffee station blocks service until cleaned.

### Capacity and stress

Stress rises with simultaneous customers, late orders, low cash, illness, and long workdays. It falls through rest, meals, completed promises, home comfort, and staff. High stress reduces perfect-stitch windows but never causes random failure. At 100, Marielle closes safely for the day and recovers; no punitive collapse.

## 11. Household and home progression

Home comfort is both visual and mechanical. Essentials are presented before wants.

| Tier | Items | Effect |
|---|---|---|
| Bare | mattress, small table, kitchen corner | starting state |
| Secure | pantry, stove, better bed, storage | lower daily expense/stress |
| Warm | curtains, rug, lamp, dining table | stronger recovery and scenes |
| Shared | sofa, wardrobe, guest chair | relationship scenes |
| Remembered | Brida's sewing corner | memory quests and ending flag |

No item is described as fixing poverty. Items represent safety, rest, privacy, and belonging.

## 12. Mother health

Elise has stable, tired, resting, and ill states. The next day's risk is telegraphed. Rest and medicine reduce duration; they do not guarantee a cure. While resting, Elise is visible at home and contributes advice. While ill, she does not gather, clean, serve, or run coffee. The player may close early, postpone orders, or use hired help. Customers react with empathy more often than irritation.

## 13. Hiring

Hiring unlocks after the player has both recurring revenue and a basic home stability threshold.

| Role | Work | Limitation |
|---|---|---|
| Junior tailor | simple garments | needs training and inspection |
| Cleaner/helper | dirt and coffee cups | does not craft |
| Material runner | procurement route | limited carry capacity |
| Coffee helper | patience and sales | consumes stock |
| Customer assistant | intake and pickup | cannot negotiate story orders |

Staff have fixed wages, schedules, strengths, and short personal arcs. No exploitative unpaid labor system.

## 14. Map

Auberlin is one readable town with district shortcuts. The supplied illustrated town map is spatial reference, not a literal collision map.

- Cinder Row: former slum home, charity store, community repairs.
- Ashford Brickworks: family history and workwear clients.
- Spindle Square: tailor shop, flower shop, cafe, fountain hub.
- Current home: modest residential lane between Cinder Row and the square.
- Ribbon Row: fabric stores, notions, dye merchant.
- Sheep farm: town edge, wool procurement.
- Weftworks: muslin/cotton factory and salvage zone.
- Madder docks: ship deck and imports.
- Larkspur Boulevard: wealthy customers.
- Crownway: late-game court commissions.

## 15. Characters

- Marielle Thimm, 22: observant, capable, wry under pressure. Visual anchor: long dark hair/bun, practical dress, cream apron, measuring-tape sash.
- Elise Thimm, 49: mother, former brickworker, greying dark hair, tired posture, dry humor. She is a partner, not a quest object.
- Brida Thimm, deceased: grandmother and mentor. Appears through notes, tutorial memories, and the green cardigan character reference.
- Tomas Thimm, 25: brother in prison after addiction-related offenses. Optional letters focus on accountability, recovery, and boundaries.
- Berta Klee: Cinder Row connector and repair client.
- Sylvie Marsh: fabric/dye supplier and friend.
- Countess Elowen: demanding but fair patron with a lonely household.
- Odile Marchand: retired tailor and business mentor, no longer landlady-owner.
- Corvin Alba: rival whose insecurity creates obstacles without cartoon villainy.

## 16. First ten quests

1. Our Own Key: clean three shop spots, inspect Brida's notes, open the door.
2. First Honest Order: repair Mrs. Tansy's coat and show Manufacturing Complete.
3. Tea Tin Arithmetic: earn rent while paying food and electricity.
4. Brick Dust: return to Ashford, deliver three work aprons, unlock Marielle's memory.
5. A Day of Two Pairs of Hands: learn delegation with Elise.
6. The Empty Chair: Elise rests; run one full shop day alone.
7. Cups and Scraps: serve coffee, clean the resulting mess, keep satisfaction above 60.
8. Ribbon Fair Dress: source gingham, sew a custom dress, complete a fitting.
9. A Letter from Tomas: choose a bounded, compassionate reply; no gameplay penalty for refusing money.
10. Room to Breathe: buy one essential home upgrade and hire the first helper.

## 17. Tutorial flow

The first 25 minutes teach movement, inspection, cleaning, order intake, inventory reservation, The Seam, pickup/payment, ledger, and sleep. Brida's notes provide tailoring instruction; Elise teaches practical shop flow. Each tutorial creates an actual persistent result. Prompts fade after first success and remain available in Help.

## 18. Example scenarios

- A factory worker needs a torn cuff repaired before the night shift. Repair earns little cash but unlocks a discounted muslin lot.
- A wealthy patron arrives while the floor is dirty. The player can clean while she waits with coffee, ask her to return, or accept with a cleanliness warning.
- Elise wakes tired on a bulk-order day. The player can reduce the order, pay a runner, or close walk-ins.
- A customer disputes the quote. The signed order card shows the deposit; the player can stand firm, offer installments, or convert part to community credit.
- A charity client brings excellent second-hand lace. Careful substitution can raise quality while keeping the price low.

## 19. Scope

### Vertical slice

Ten in-game days, shop and home, three procurement locations, eight garment types, six customer archetypes, cleanliness, coffee, bills, stress, mother health, three home items, one hire, first ten quests, save slots, keyboard/mouse/touch, and one polished ending beat.

### Full game

Four seasons, all Auberlin districts, 40+ garments, 25 named customers, five staff arcs, 30 household scenes, Tomas letter arc, supplier relationships, accessibility settings, localization-ready text, achievements, and coronation finale.

## 20. Success metrics and guardrails

- A new player completes a first order within 15 minutes.
- The ledger communicates the next three obligations without opening a wiki.
- A typical day offers at least two viable plans.
- Missing a deadline creates recovery play, not save-file ruin.
- Home improvements produce visible scene changes.
- Illness never appears without advance signal or a reasonable response.
- No dialogue equates wealth with virtue or cleanliness with human worth.

