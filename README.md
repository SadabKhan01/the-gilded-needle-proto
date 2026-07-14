# The Gilded Needle — Image-Backed Prototype

A cozy 2D tailor-shop RPG prototype. The three painted scenes (`assets/`) are used as
full-screen backgrounds; the playable character, hotspots, customers, mini-games and UI
are layered on top — no tile engine.

**Story:** Auberlin, 1972. Mari Thimm — daughter of servants at Harrowgate House,
secretly taught to sew by her grandmother Brida, six years a carrier at the Ashford
brickworks — finally opens her own shop.

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
| Exterior scene | shop front — door, chalkboard, sign, windows, lavender, Mr. Buttons the sparrow |
| Interior scene | full walkable shop with furniture collision + vertical camera |
| Customers | doorbell rings, customer walks to the counter, places a sew or outfit order |
| Sewing mini-game | cut the pins in order, then time the stitches — quality affects pay |
| Wardrobe mini-game | dress-up screen over the wardrobe painting; find the requested top |
| Shop management | coins, fabric bolts, order book, ledger with fabric purchases + 3 upgrades |
| Memories | 3 story flashbacks: Grandmother Brida, the brickworks, the servants' stair |

## Files

- `js/engine.js` — canvas, input, WebAudio synth, save/load, mode loop
- `js/data.js` — all content: hotspot coordinates (image space), wardrobe catalog, fabrics, dialogue, memories
- `js/sprites.js` — procedural chibi sprites (Mari + customers)
- `js/scenes.js` — exterior/interior modes, movement, collision, customer flow
- `js/minigames.js` — title, intro, flashbacks, wardrobe dress-up, sewing game
- `js/ui.js` — DOM HUD, dialogue box, panels, toasts, order book

## Next locations (planned)

Brick factory, Harrowgate House, fabric market, Grandmother's cottage, town streets.
