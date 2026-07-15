# Production Issue Backlog

Issues are ordered for a layered build. Each item is small enough to become a GitHub issue. `P0` blocks the vertical slice; `P1` completes it; `P2` expands the full game.

## Milestone 0 - foundation and canon

- [x] GN-001 P0 Preserve and publish the standalone Claude prototype.
- [x] GN-002 P0 Separate the standalone proto from the rejected fuller Claude branch and preserve the latter only as a legacy remote.
- [x] GN-003 P0 Merge prompt, PDF character sheets, town references, and Graphify findings into one canon.
- [x] GN-004 P0 Write product plan, scope, tone guardrails, and source provenance.
- [x] GN-005 P0 Replace legacy train/inheritance dialogue with bought-shop/family backstory throughout runtime.
- [ ] GN-006 P0 Add content-schema validation for characters, garments, orders, suppliers, and quests.
- [ ] GN-007 P0 Add automated smoke harness for title -> new game -> shop -> craft -> save.
- [ ] GN-008 P1 Add reduced motion, timing assist, remapping, and text-speed settings.

## Milestone 1 - management vertical slice

- [x] GN-100 P0 Persist accepted orders and their stable IDs across reloads.
- [x] GN-101 P0 Add persistent cleanliness, stress, coffee stock, mother status, bills, home comfort, and staff state.
- [x] GN-102 P0 Add shop ledger UI with cleaning, restocking, bills, home items, and hiring actions.
- [x] GN-103 P0 Connect customers to coffee patience, litter, cleanliness, and stress.
- [x] GN-104 P0 Process food, rent, electricity, wages, illness, and recovery at day end.
- [ ] GN-105 P0 Build order entity with intake, deposit, deadline, quality, reservation, and pickup states.
- [ ] GN-106 P0 Replace ready-stock-only sales with Accept/Renegotiate/Substitute/Decline intake.
- [ ] GN-107 P0 Add Manufacturing Complete result card and order packaging.
- [x] GN-108 P0 Add visible litter nodes and direct cleaning interaction.
- [ ] GN-109 P0 Add open/closed sign and player-controlled shop hours.
- [ ] GN-110 P0 Add explicit daily summary with revenue, expenses, stress, and tomorrow preview.
- [ ] GN-111 P1 Add underpayment resolution based on signed quote/deposit.
- [ ] GN-112 P1 Add bulk and urgent order capacity calculations.
- [ ] GN-113 P1 Add repair garment path with low material consumption.
- [ ] GN-114 P1 Add coffee-station dirt and reusable-cup upgrade.
- [ ] GN-115 P1 Add stress effects to Seam timing with accessibility-safe floor.
- [x] GN-116 P0 Freeze the management clock and customer pressure while dialogue, panels, or transitions are open.

## Milestone 2 - household and family

- [x] GN-201 P0 Create walkable current-home map and evening transition.
- [x] GN-202 P0 Render home items by upgrade state.
- [ ] GN-203 P0 Add Elise NPC, portrait, apron sprites, shop tasks, and home rest state.
- [ ] GN-204 P0 Add telegraphed mother-health schedule and medicine/rest choices.
- [ ] GN-205 P0 Implement Brida memory corner and tutorial-note collection.
- [ ] GN-206 P1 Add Tomas letter inbox, content warnings, response boundaries, and optionality.
- [ ] GN-207 P1 Add 20 household micro-scenes keyed to comfort and story flags.
- [ ] GN-208 P1 Add pantry/stove/bed mechanical benefits.
- [ ] GN-209 P1 Add safe overwork closure sequence instead of punitive collapse.

## Milestone 3 - town and procurement

- [x] GN-301 P0 Rebuild city portals to match the supplied town map's readable district structure.
- [x] GN-302 P0 Add sheep farm procurement map and wool supplier.
- [x] GN-303 P0 Reframe Weftworks as muslin/cotton supplier with salvage and purchase routes.
- [x] GN-304 P0 Add Ribbon Row fabric store and notions catalog.
- [x] GN-305 P0 Reframe Madder docks as ship-deck import market.
- [x] GN-306 P1 Add charity store with inconsistent discounted bundles.
- [ ] GN-307 P1 Add Ashford Brickworks story location and workwear questline.
- [ ] GN-308 P1 Add supplier stock calendars, price bands, and relationship discounts.
- [ ] GN-309 P1 Add material reservation and provenance fields.
- [ ] GN-310 P2 Add route planning and hireable material runner.

## Milestone 4 - tailoring depth

- [ ] GN-401 P0 Add blouse, peplum top, gingham dress, repair, and custom-order recipes.
- [ ] GN-402 P0 Add measurements and pattern selection to order setup.
- [ ] GN-403 P0 Add fabric substitution rules and customer consent.
- [ ] GN-404 P1 Port wardrobe visual-matching minigame from `codex/proto-checkpoint`.
- [ ] GN-405 P1 Add pattern-layout/cutting minigame.
- [x] GN-406 P1 Add finishing notions: buttons, zippers, lace, ribbon, thread.
- [ ] GN-407 P1 Add fitting correction loop.
- [ ] GN-408 P2 Add 40-garment content catalog and seasonal styles.

## Milestone 5 - customers, quests, and staff

- [ ] GN-501 P0 Author six behavior archetypes without class-morality coupling.
- [ ] GN-502 P0 Implement first ten canonical quests.
- [ ] GN-503 P0 Add junior tailor/cleaner as first hire with schedule and wages.
- [ ] GN-504 P1 Add material runner, coffee helper, and customer assistant.
- [ ] GN-505 P1 Add training, assignment, and fair-wage screens.
- [ ] GN-506 P1 Add named-customer relationship memory.
- [ ] GN-507 P1 Rewrite legacy quest arc to bridge neighborhood stability into court commissions.
- [ ] GN-508 P2 Add 25 named customer arcs and five staff arcs.

## Milestone 6 - art, audio, and UX

- [x] GN-601 P0 Curate supplied town and character references into the repository.
- [x] GN-602 P0 Produce final Marielle working sprite/portrait based on the supplied sheet.
- [ ] GN-603 P0 Produce Elise and Brida portrait/emotion sheets.
- [ ] GN-604 P0 Produce home bare/secure/warm visual states.
- [ ] GN-605 P0 Add shop dirt, coffee, order, bill, health, stress, and comfort icons.
- [x] GN-606 P1 Add illustrated district-map overlay based on supplied map.
- [x] GN-607 P1 Add cinematic shopfront/title art consistent with supplied street references.
- [ ] GN-608 P1 Add mother, home, brickworks, and letter musical motifs.
- [ ] GN-609 P1 Add mobile/touch layout and responsive UI.
- [ ] GN-610 P1 Add localization-safe layout and externalized narrative strings.

## Milestone 7 - quality and release

- [ ] GN-701 P0 Unit-test bills, orders, inventory reservations, illness, and saves.
- [ ] GN-702 P0 Test save migration from both Claude branches.
- [ ] GN-703 P0 Run full keyboard, mouse, touch, and screen-size matrix.
- [ ] GN-704 P0 Run narrative sensitivity review for poverty, illness, addiction, and incarceration.
- [ ] GN-705 P0 Balance ten-day slice with three player styles: cautious, ambitious, community-first.
- [ ] GN-706 P1 Add analytics-free local debug telemetry and balance export.
- [ ] GN-707 P1 Optimize first load, sprite caches, and reference-asset exclusion from runtime.
- [ ] GN-708 P1 Create release build, itch.io page, screenshots, trailer, and credits.
