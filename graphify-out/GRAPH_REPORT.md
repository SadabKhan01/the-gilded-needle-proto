# Graph Report - .  (2026-07-14)

## Corpus Check
- Large corpus: 23 files · ~632,436 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 367 nodes · 550 edges · 21 communities (20 shown, 1 thin omitted)
- Extraction: 74% EXTRACTED · 26% INFERRED · 0% AMBIGUOUS · INFERRED: 142 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Production Roadmap and Canon|Production Roadmap and Canon]]
- [[_COMMUNITY_Sunny Spindle Square|Sunny Spindle Square]]
- [[_COMMUNITY_Overcast Commercial Street|Overcast Commercial Street]]
- [[_COMMUNITY_Wardrobe and Clothing Catalog|Wardrobe and Clothing Catalog]]
- [[_COMMUNITY_Shop Management Systems|Shop Management Systems]]
- [[_COMMUNITY_Interface and Order Persistence|Interface and Order Persistence]]
- [[_COMMUNITY_Auberlin Town Geography|Auberlin Town Geography]]
- [[_COMMUNITY_Scene and Customer Flow|Scene and Customer Flow]]
- [[_COMMUNITY_Reference Art Pipeline|Reference Art Pipeline]]
- [[_COMMUNITY_Tailor Shop Exterior Details|Tailor Shop Exterior Details]]
- [[_COMMUNITY_Grandmother Character Reference|Grandmother Character Reference]]
- [[_COMMUNITY_Prototype Runtime Architecture|Prototype Runtime Architecture]]
- [[_COMMUNITY_Tailoring Mini-Games|Tailoring Mini-Games]]
- [[_COMMUNITY_Tailor Atelier Interior|Tailor Atelier Interior]]
- [[_COMMUNITY_Marielle Character Reference|Marielle Character Reference]]
- [[_COMMUNITY_Management Smoke Tests|Management Smoke Tests]]
- [[_COMMUNITY_Engine Input and Audio|Engine Input and Audio]]
- [[_COMMUNITY_Wardrobe Navigation|Wardrobe Navigation]]

## God Nodes (most connected - your core abstractions)
1. `The Gilded Needle Product and Game Design Plan` - 23 edges
2. `ensure()` - 21 edges
3. `Spindle Square Overcast Scene` - 18 edges
4. `Auberlin Town Map` - 16 edges
5. `The Gilded Needle Image-Backed Prototype` - 15 edges
6. `Hanging Tops Collection` - 13 edges
7. `Art Asset Manifest and Curation Plan` - 12 edges
8. `clamp()` - 11 edges
9. `Tailor Shop Storefront` - 11 edges
10. `European Town Square` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Mari Thimm` --semantically_similar_to--> `Marielle Thimm`  [AMBIGUOUS] [semantically similar]
  README.md → design/PRODUCT_PLAN.md
- `Prototype Shop Management` --semantically_similar_to--> `Daily Shop and Household Loop`  [INFERRED] [semantically similar]
  README.md → design/PRODUCT_PLAN.md
- `Sewing Mini-Game` --semantically_similar_to--> `The Seam`  [INFERRED] [semantically similar]
  README.md → design/PRODUCT_PLAN.md
- `Planned Locations` --semantically_similar_to--> `Auberlin District Map`  [INFERRED] [semantically similar]
  README.md → design/PRODUCT_PLAN.md
- `Runtime Reference Exclusion` --semantically_similar_to--> `Reference and Runtime Art Separation`  [INFERRED] [semantically similar]
  assets/reference/README.md → design/ASSET_MANIFEST.md

## Import Cycles
- 1-file cycle: `tests/management-smoke.js -> tests/management-smoke.js`

## Hyperedges (group relationships)
- **Prototype and Vertical Slice Alignment** — readme_the_gilded_needle_prototype, design_issues_milestone_1_management_vertical_slice, design_product_plan_vertical_slice [INFERRED 0.85]
- **Art Reference to Runtime Production Pipeline** — assets_reference_readme_reference_art_provenance, design_asset_manifest_reference_runtime_separation, design_asset_manifest_curation_checklist, design_issues_milestone_6_art_audio_and_ux [INFERRED 0.95]
- **Core Shop Day System** — design_product_plan_daily_loop, design_product_plan_order_system, design_product_plan_tailoring_pipeline, design_product_plan_procurement_network, design_product_plan_cleanliness_system, design_product_plan_capacity_and_stress [EXTRACTED 1.00]
- **Textile Production and Retail** — assets_reference_auberlin_town_map_muslin_factory, assets_reference_auberlin_town_map_north_fabric_store, assets_reference_auberlin_town_map_south_fabric_store [INFERRED 0.85]
- **Industrial Periphery** — assets_reference_auberlin_town_map_muslin_factory, assets_reference_auberlin_town_map_northeast_brick_factory, assets_reference_auberlin_town_map_southwest_brick_factory [INFERRED 0.85]
- **Residential Stratification** — assets_reference_auberlin_town_map_slum_1, assets_reference_auberlin_town_map_slum_2, assets_reference_auberlin_town_map_slum_3, assets_reference_auberlin_town_map_residential_town, assets_reference_auberlin_town_map_west_high_class_society, assets_reference_auberlin_town_map_east_high_class_society, assets_reference_auberlin_town_map_her_house [INFERRED 0.85]
- **Grandmother Expression and Pose Set** — assets_reference_grandmother_character_sheet_cheerful_expression, assets_reference_grandmother_character_sheet_cup_holding_pose, assets_reference_grandmother_character_sheet_sad_expression, assets_reference_grandmother_character_sheet_gentle_smile, assets_reference_grandmother_character_sheet_front_facing_stance [EXTRACTED 1.00]
- **Character Production Consistency** — assets_reference_grandmother_character_sheet_chibi_grandmother, assets_reference_grandmother_character_sheet_green_layered_outfit, assets_reference_grandmother_character_sheet_expression_pose_reference [INFERRED 0.85]
- **Romantic Commercial Square Ensemble** — assets_reference_spindle_square_sunny_central_pink_building, assets_reference_spindle_square_sunny_tailor_shop, assets_reference_spindle_square_sunny_flower_shop, assets_reference_spindle_square_sunny_ornamental_fountain, assets_reference_spindle_square_sunny_romantic_floral_motif [INFERRED 0.85]
- **Period Streetscape Cues** — assets_reference_spindle_square_sunny_pastel_rowhouses, assets_reference_spindle_square_sunny_mansard_roofs, assets_reference_spindle_square_sunny_chimney_skyline, assets_reference_spindle_square_sunny_gas_style_streetlamps, assets_reference_spindle_square_sunny_horse_drawn_carriage [INFERRED 0.85]
- **Game Environment Readability System** — assets_reference_spindle_square_sunny_central_landmark_composition, assets_reference_spindle_square_sunny_foreground_fountain_anchor, assets_reference_spindle_square_sunny_converging_street_perspective, assets_reference_spindle_square_sunny_navigation_landmarking, assets_reference_spindle_square_sunny_environmental_storytelling [INFERRED 0.85]
- **Color-Sorted Garment Catalog** — assets_wardrobe_red_pink_rows, assets_wardrobe_blue_row, assets_wardrobe_yellow_green_row, assets_wardrobe_brown_row, assets_wardrobe_black_row, assets_wardrobe_red_plaid_bottom_row [INFERRED 0.95]
- **Top Style Taxonomy** — assets_wardrobe_corset_tops, assets_wardrobe_puff_sleeve_blouses, assets_wardrobe_tailored_vests, assets_wardrobe_halter_camisole_tops [INFERRED 0.95]
- **Cozy Dress-Up Aesthetic** — assets_wardrobe_coquette_cottagecore_style, assets_wardrobe_decorative_frame, assets_wardrobe_warm_beige_palette, assets_wardrobe_character_accessories [INFERRED 0.85]

## Communities (21 total, 1 thin omitted)

### Community 0 - "Production Roadmap and Canon"
Cohesion: 0.08
Nodes (41): Production Style Lock, Milestone 0 Foundation and Canon, Milestone 1 Management Vertical Slice, Milestone 2 Household and Family, Milestone 3 Town and Procurement, Milestone 4 Tailoring Depth, Milestone 5 Customers Quests and Staff, Milestone 7 Quality and Release (+33 more)

### Community 1 - "Sunny Spindle Square"
Cohesion: 0.07
Nodes (36): Art Nouveau Facade, Belle Époque Fantasy Streetscape, Blue Sky and Cumulus Clouds, Central Landmark Composition, Central Pink Landmark Building, Chimney-Rich Skyline, Cobblestone Plaza, Converging Street Perspective (+28 more)

### Community 2 - "Overcast Commercial Street"
Cohesion: 0.09
Nodes (32): Abundant Flower Planters, Artisanal Commercial District, Belle Époque Fantasy Architecture, Café de Fleur, Central Architectural Emphasis, Cobblestone Square, Environmental Storytelling, Eye-Level Wide Establishing Shot (+24 more)

### Community 3 - "Wardrobe and Clothing Catalog"
Cohesion: 0.08
Nodes (31): Black Monochrome Row, Blue Check Row, Brown Earth-Tone Row, Hair Clip, Star Clips, Socks, and Mary Janes, Character Preview Panel Use, Large-Eyed Chibi Girl Character, Selectable Clothing Catalog Use, Coquette Cottagecore Style (+23 more)

### Community 4 - "Shop Management Systems"
Cohesion: 0.21
Nodes (23): addTrash(), buyHome(), clamp(), cleanTrash(), clock(), closeDay(), customerConcern(), deepClean() (+15 more)

### Community 5 - "Interface and Order Persistence"
Cohesion: 0.18
Nodes (19): add(), advance(), busy(), closePanel(), coinToast(), dialogueOpen(), init(), openFabricsPanel() (+11 more)

### Community 6 - "Auberlin Town Geography"
Cohesion: 0.18
Nodes (22): Auberlin Town Map, Central Commercial Core, Charity Store, Class-Stratified Residential Layout, Coastal Trade Access, East High Class Society, Her House, Muslin Factory (+14 more)

### Community 7 - "Scene and Customer Flow"
Cohesion: 0.19
Nodes (19): allHotspots(), blocked(), customerAsk(), draw(), drawLetterbox(), drawMarker(), drawNamePill(), drawPrompt() (+11 more)

### Community 8 - "Reference Art Pipeline"
Cohesion: 0.14
Nodes (20): Auberlin Town Map Reference, Grandmother Character Sheet, Imported File 2 PDF, Marielle Character Sheet, Reference Art Provenance, Runtime Reference Exclusion, Spindle Square Overcast Reference, Spindle Square Sunny Reference (+12 more)

### Community 9 - "Tailor Shop Exterior Details"
Cohesion: 0.16
Nodes (16): Climbing Flowering Vines, Custom Fit Timeless Style Chalkboard, Tailoring Display Windows, Tailor Shop Exterior Illustration, Fabric Bolts, Lavender Flower Boxes, Handmade with Care Sign, Hanging Tailor Sign (+8 more)

### Community 10 - "Grandmother Character Reference"
Cohesion: 0.12
Nodes (15): node:assert/strict, node:fs, node:path, node:vm, assert, customer, fs, notices (+7 more)

### Community 11 - "Prototype Runtime Architecture"
Cohesion: 0.16
Nodes (14): Four-Panel Grandmother Character Sheet, Cheerful Open-Mouth Expression, Chibi Grandmother Character, Gentle Smile While Holding a Small Cup, Expression and Pose Consistency Reference, Front-Facing Hands-in-Pockets Stance, Calm Gentle Smile Expression, Gray Hair in High Bun with Loose Curls (+6 more)

### Community 12 - "Tailoring Mini-Games"
Cohesion: 0.21
Nodes (14): CSS Style Sheet, Prototype Game Page, Data Script, Engine Script, Main Script, Mini-Games Script, Scenes Script, Sprites Script (+6 more)

### Community 13 - "Tailor Atelier Interior"
Cohesion: 0.30
Nodes (12): cellAt(), close(), draw(), drawCenteredPage(), drawPageOverlay(), fabricPattern(), matches(), panel() (+4 more)

### Community 14 - "Marielle Character Reference"
Cohesion: 0.22
Nodes (13): Central Cutting Table, Coffee Station, Dress Forms and Mannequins, Finished Dress Rack, Fabric Storage, Fireplace Lounge Area, Indoor Plants, Garment Patterns and Fashion Sketches (+5 more)

### Community 15 - "Management Smoke Tests"
Cohesion: 0.15
Nodes (13): Small Black Shoes, Young Feminine Chibi Design with Large Head and Eyes, Front-Facing Standing Pose with Hands Clasped at Waist, Concerned Expression with Downturned Mouth, Production Use: Character and Costume Consistency Reference, Production Use: Expression Reference, Gentle Closed-Mouth Smile, Long Wavy Dark-Brown Hair, Large Brown Eyes, and Rosy Cheeks (+5 more)

### Community 16 - "Engine Input and Audio"
Cohesion: 0.38
Nodes (4): endFrame(), frame(), play(), tone()

## Ambiguous Edges - Review These
- `Mari Thimm` → `Marielle Thimm`  [AMBIGUOUS]
  README.md · relation: semantically_similar_to
- `Bottom Dress and Bow Icon Controls` → `Wardrobe Category Navigation`  [AMBIGUOUS]
  assets/wardrobe.png · relation: implements

## Knowledge Gaps
- **80 isolated node(s):** `assert`, `fs`, `path`, `vm`, `root` (+75 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Mari Thimm` and `Marielle Thimm`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `Bottom Dress and Bow Icon Controls` and `Wardrobe Category Navigation`?**
  _Edge tagged AMBIGUOUS (relation: implements) - confidence is low._
- **Why does `The Gilded Needle Product and Game Design Plan` connect `Production Roadmap and Canon` to `Reference Art Pipeline`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `The Gilded Needle Image-Backed Prototype` connect `Tailoring Mini-Games` to `Reference Art Pipeline`, `Production Roadmap and Canon`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `Art Asset Manifest and Curation Plan` connect `Reference Art Pipeline` to `Production Roadmap and Canon`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `Spindle Square Overcast Scene` (e.g. with `Environmental Storytelling` and `Eye-Level Wide Establishing Shot`) actually correct?**
  _`Spindle Square Overcast Scene` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `assert`, `fs`, `path` to the rest of the system?**
  _91 weakly-connected nodes found - possible documentation gaps or missing edges._