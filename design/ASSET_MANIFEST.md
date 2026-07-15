# Art Asset Manifest and Curation Plan

The playable build uses painterly illustrated backgrounds with transparent full-body character cutouts and code-native SVG crests. Supplied high-resolution images remain the visual canon and are only used at runtime where explicitly listed below.

## Supplied and curated

| File | Role | Keep | Notes |
|---|---|---:|---|
| `assets/reference/spindle-square-sunny.png` | shopfront lighting/composition | yes | optimistic title/campaign reference |
| `assets/reference/spindle-square-overcast.png` | muted palette/facade reference | yes | closer to day-to-day tone |
| `assets/reference/auberlin-town-map.png` | location and district reference | yes | labels are conceptual, not final UI copy |
| `assets/reference/grandmother-character-sheet.png` | Brida silhouette/emotions | yes | PDF page 1; green cardigan, bun, glasses |
| `assets/reference/marielle-character-sheet.png` | Marielle face/hair/dress reference | yes | PDF page 2; choose bottom-right calm expression as base |

The PDF's third page is blank and is intentionally not retained. The PDF had no extractable text.

## Production style lock

- Warm painterly pixel art with readable silhouettes at 16x24 characters.
- Old European working town: cobbles, brick, plaster, iron lamps, autumn foliage.
- Muted indigo, moss, terracotta, walnut, cream, plum, and thread-gold accents.
- Feminine through textiles, flowers, craft, and warmth - not excessive pink or ornament.
- Working-class areas are maintained, lived-in, and proud; no grime caricature.
- UI uses linen cards, walnut frames, running-stitch borders, and direct iconography.

## P0 generated/created assets

0. Open-world Auberlin background: label-free, road-connected town painting derived from the supplied map and curated as `assets/auberlin-open-world.png`.
0. Victorian townspeople sheet: six equal-height full-body residents on transparency, curated as `assets/auberlin-npcs.png`.
0. Location crest family: eight original code-native SVG emblems in `assets/logos/` for the tailor, farm, muslin works, fabric shop, charity shop, brickworks, home, and quay.

1. Marielle portrait sheet: neutral, smile, worried, focused, tired, relieved; cream apron and tape sash.
2. Marielle pixel sheet: four directions, walk, sewing, cleaning, coffee, carrying materials.
3. Elise portrait sheet: neutral, wry smile, tired, ill/resting, proud; grey strands and work apron.
4. Elise pixel sheet: serving, cleaning, carrying, resting.
5. Brida memory portrait sheet: four supplied expressions translated into the game palette.
6. Bare home background: one narrow bed, one oil light, empty kitchen counter and basin, worn walls, and clear upgrade spaces. Generated as `assets/home-bare.png`.
7. Home upgrade props: chair, iron stove, wooden icebox, and Brida sewing chest on a transparent sprite sheet at `assets/home-upgrades.png`.
7. Shop dirt set: tissue, coffee cup, thread pile, fabric scraps, paper pattern, dust patch.
8. Management icon set: rent, electricity, food, medicine, coffee, clean, stress, health, comfort, wage.
9. Order card garment silhouettes: blouse, peplum, gingham dress, repair, custom dress, bulk box.
10. Manufacturing Complete card: stitched seal, quality stars, wrapped parcel.

### Open-world Auberlin

Use case: stylized-concept/edit. Asset: 16:9 isometric town exploration background. Primary request: remove every title, banner, label, and UI element from the supplied Auberlin map while preserving its recognizable geography; widen and connect the cobbled roads between sheep farm, muslin works, both brickworks, eastern working districts, estates, central shops, residences, and southeast ship deck. Rich hand-painted Victorian/Belle Époque atmosphere, autumn greenery, readable roads, no people, no text, no watermark. Generated with the built-in ChatGPT image-generation tool and curated into `assets/auberlin-open-world.png`.

### Auberlin townspeople

Use case: character-sheet. Asset: transparent 3x2 full-body NPC sheet. Primary request: six distinct Victorian residents — Black middle-aged seamstress, older sheep farmer, brown-skinned muslin clerk, charity-shop matron, East Asian dock merchant, and young aristocratic customer — in the same warm illustrated chibi language and apparent height. Strong silhouettes, detailed period workwear, no text or props crossing cells. Generated against a flat chroma background, background-removed with the bundled image tool, and curated into `assets/auberlin-npcs.png`.

## P1 assets

1. Home secure/warm/shared states and Brida memory corner.
2. Sheep farm, Weftworks, Ribbon Row store, charity shop, brickworks, and ship-deck tiles/props.
3. Illustrated district-map overlay with accessible hover labels.
4. Title/shopfront cinematic using the overcast street palette and sunny image's inviting composition.
5. Five staff portrait/pixel sets.
6. Tomas letter portrait cameo, optional and non-carceral in presentation.
7. Twenty-five customer portraits across age, body, skin tone, class, and disability.
8. Seasonal exterior overlays and shop-window displays.

## Generation prompt recipes

### Marielle portrait sheet

Use case: illustration-story. Asset: six-expression visual-novel portrait sheet. Primary request: a hardworking 22-year-old European-town tailor, long dark brown hair gathered partly back, large warm brown eyes, practical indigo dress, cream work apron, measuring tape sash. Use the supplied Marielle sheet for identity and the grandmother sheet for family resemblance. Warm ink outlines, parchment background, muted terracotta/indigo/moss palette. Six evenly spaced busts: neutral, small smile, worried, focused, tired, relieved. No text, no watermark, no modern fashion, no glamour pose.

### Elise portrait sheet

Use case: illustration-story. Asset: six-expression visual-novel portrait sheet. Primary request: Marielle's 49-year-old mother and shop partner, dark hair with visible grey, gentle wrinkles, strong hands, tired posture, green-grey dress and cream apron. Warm, dignified, capable. Expressions: neutral, dry amusement, concern, fatigue, resting while ill, proud tears. No hospital imagery, no text, no watermark.

### Home background

Use case: stylized-concept. Asset: 16:9 playable game background. Primary request: modest old-European apartment in 1972 with exactly one narrow bed, one wall-mounted oil light, bare kitchen counter, empty shelves, wash basin, worn plaster, and wood floor. Leave a clear walking path and obvious appliance/furniture upgrade spaces. No people, text, luxury objects, chairs, tables, decorations, food, dishes, cookware, stove, oven, refrigerator, kettle, or modern technology. Generated with the built-in ChatGPT image-generation tool and curated into `assets/home-bare.png`.

### Title/shopfront

Use case: historical-scene. Asset: 16:9 title background. Primary request: The Gilded Needle tailor shop on a cobbled old-European square, working neighborhood meeting a graceful flower shop and cafe, warm lamps under an overcast sky, autumn leaves, restrained flowers. Marielle and Elise are small figures opening the door together. Use supplied street images for architecture and palette. Leave negative space in the upper center for a title. No rendered text, no car, no royal palace emphasis, no watermark.

## Curation checklist

- Silhouette reads at target resolution.
- Aprons and measuring tools identify the profession.
- Character age and family resemblance remain consistent.
- No accidental modern objects, illegible text, extra limbs, or costume drift.
- Background composition preserves walkable/readable areas.
- Pixel conversion uses manual cleanup; do not downsample generated paintings blindly.
- Every runtime bitmap has an optimized WebP/PNG and source provenance entry.
- Reference images remain excluded from runtime preload and release download where practical.
