# The Gilded Needle — Image-Backed Prototype

A cozy 2D tailor-shop RPG prototype. The three painted scenes (`assets/`) are used as
full-screen backgrounds; the playable character, hotspots, customers, mini-games and UI
are layered on top — no tile engine.

**Story:** Auberlin, 1972. Mari Thimm grew up in Cinder Row and spent six years carrying
bricks beside her mother Elise and brother Tomas. Taught to sew by her late grandmother
Brida, she finally spends the tea-tin savings on a shop of her own. The work now has to
support the family without swallowing the life they are trying to build.

## Run

Any static server from this folder, e.g.:

```
python3 -m http.server 8642
```

then open http://localhost:8642. No build step, no dependencies.

## Controls

- **WASD / arrows** — walk (or click/tap a spot to walk there)
- **E / Space / click** — interact with the nearest highlighted object
- **Esc** — leave the wardrobe
- **R on the title screen** — reset the save (localStorage)

## What's in the prototype

| Feature | Where |
|---|---|
| Exterior scene | supplied sunny Spindle Square painting with the tailor shop, fountain, carriage, and flower conservatory |
| Interior scene | full walkable shop with furniture collision + vertical camera |
| Illustrated characters | Mari and Elise are runtime cutouts from the supplied character-sheet references |
| Town navigation | top-left map bar opens the supplied Auberlin map with eight clickable destinations |
| Customers | doorbell rings, customer walks to the counter, places a persistent sew or outfit order |
| Custom garment orders | collect cloth, thread, buttons, lace, ribbon, or zippers before cutting and sewing |
| Sewing mini-game | reserve materials, cut the pins in order, then time the stitches — quality affects pay |
| Suppliers | sheep farm, muslin works, Ribbon Row, charity store, and ship-deck market |
| Wardrobe mini-game | dress-up screen over the wardrobe painting; find the requested top |
| Shop management | coins, fabric bolts, order book, ledger with fabric purchases + 3 upgrades |
| Daily pressure | cleanliness, coffee stock, stress, rent, electricity, food, fair wages |
| Family stability | mother health, home comfort purchases, end-of-day recovery |
| Memories | 3 story flashbacks: Grandmother Brida, the brickworks, the servants' stair |

## Files

- `js/engine.js` — canvas, input, WebAudio synth, save/load, mode loop
- `js/data.js` — all content: hotspot coordinates (image space), wardrobe catalog, fabrics, dialogue, memories
- `js/management.js` — clock, bills, cleanliness, coffee, home comfort, staffing and mother health
- `js/sprites.js` — supplied-sheet cutout sprites for Mari/Elise plus procedural customers
- `js/scenes.js` — exterior/interior modes, movement, collision, customer flow
- `js/minigames.js` — title, intro, flashbacks, wardrobe dress-up, sewing game
- `js/ui.js` — DOM HUD, dialogue box, panels, toasts, order book

## Production map

- `design/PRODUCT_PLAN.md` — product canon, core loops, milestones and acceptance criteria
- `design/ISSUES.md` — layered implementation backlog using `GN-xxx` issue IDs
- `design/ASSET_MANIFEST.md` — every planned image, priority, generation recipe and curation gate
- `graphify-out/GRAPH_REPORT.md` — architecture and content-relationship audit
- `graphify-out/graph.html` — interactive knowledge graph for code, design and reference art
- `tests/management-smoke.js` — save/load and management-system smoke coverage

## Next locations (planned)

Brick factory, current family home, sheep farm, fabric market, charity shop, docks, town streets.
