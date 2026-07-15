# Graph Report - .  (2026-07-14)

## Corpus Check
- 11 files · ~634,449 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 391 nodes · 555 edges · 34 communities (21 shown, 13 thin omitted)
- Extraction: 77% EXTRACTED · 23% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Art Production Plan|Art Production Plan]]
- [[_COMMUNITY_Sunny Square Reference|Sunny Square Reference]]
- [[_COMMUNITY_Overcast Shopfront Reference|Overcast Shopfront Reference]]
- [[_COMMUNITY_Wardrobe Catalog Reference|Wardrobe Catalog Reference]]
- [[_COMMUNITY_Interface and Map UI|Interface and Map UI]]
- [[_COMMUNITY_Management and Materials|Management and Materials]]
- [[_COMMUNITY_Auberlin Town Geography|Auberlin Town Geography]]
- [[_COMMUNITY_Scene Interaction Runtime|Scene Interaction Runtime]]
- [[_COMMUNITY_Tailor Exterior Details|Tailor Exterior Details]]
- [[_COMMUNITY_Elise Character Reference|Elise Character Reference]]
- [[_COMMUNITY_Tailoring Mini-Games|Tailoring Mini-Games]]
- [[_COMMUNITY_Atelier Interior Design|Atelier Interior Design]]
- [[_COMMUNITY_Marielle Character Reference|Marielle Character Reference]]
- [[_COMMUNITY_Management Smoke Tests|Management Smoke Tests]]
- [[_COMMUNITY_Runtime Art Roadmap|Runtime Art Roadmap]]
- [[_COMMUNITY_Order and Procurement Roadmap|Order and Procurement Roadmap]]
- [[_COMMUNITY_Prototype Application Files|Prototype Application Files]]
- [[_COMMUNITY_Game Engine Loop|Game Engine Loop]]
- [[_COMMUNITY_Reference Sprite Pipeline|Reference Sprite Pipeline]]
- [[_COMMUNITY_Wardrobe Navigation|Wardrobe Navigation]]
- [[_COMMUNITY_Layered Project Roadmap|Layered Project Roadmap]]
- [[_COMMUNITY_Core Game Characters|Core Game Characters]]
- [[_COMMUNITY_Sheep Farm Issue|Sheep Farm Issue]]
- [[_COMMUNITY_Muslin Supplier Issue|Muslin Supplier Issue]]
- [[_COMMUNITY_Notions Supplier Issue|Notions Supplier Issue]]
- [[_COMMUNITY_Ship Market Issue|Ship Market Issue]]
- [[_COMMUNITY_Charity Store Issue|Charity Store Issue]]
- [[_COMMUNITY_Reference Curation Issue|Reference Curation Issue]]
- [[_COMMUNITY_Management Milestone|Management Milestone]]
- [[_COMMUNITY_Tailoring Milestone|Tailoring Milestone]]
- [[_COMMUNITY_Elise Mother NPC|Elise Mother NPC]]
- [[_COMMUNITY_Family Stability System|Family Stability System]]

## God Nodes (most connected - your core abstractions)
1. `The Gilded Needle Product and Game Design Plan` - 23 edges
2. `ensure()` - 22 edges
3. `Spindle Square Overcast Scene` - 18 edges
4. `Auberlin Town Map` - 15 edges
5. `Hanging Tops Collection` - 13 edges
6. `Art Asset Manifest and Curation Plan` - 12 edges
7. `Tailor Shop Storefront` - 11 edges
8. `European Town Square` - 11 edges
9. `clamp()` - 11 edges
10. `Marielle Chibi Character` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Custom Garment Orders` --semantically_similar_to--> `GN-105 Order Entity`  [INFERRED] [semantically similar]
  README.md → design/ISSUES.md
- `Custom Garment Orders` --semantically_similar_to--> `GN-401 Garment Recipes`  [INFERRED] [semantically similar]
  README.md → design/ISSUES.md
- `Runtime Reference Exclusion` --semantically_similar_to--> `Reference and Runtime Art Separation`  [INFERRED] [semantically similar]
  assets/reference/README.md → design/ASSET_MANIFEST.md
- `Illustrated Runtime Characters` --semantically_similar_to--> `GN-203 Elise NPC`  [INFERRED] [semantically similar]
  README.md → design/ISSUES.md
- `Illustrated Runtime Characters` --semantically_similar_to--> `GN-602 Marielle Working Sprite and Portrait`  [INFERRED] [semantically similar]
  README.md → design/ISSUES.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Custom Order Production Loop** — readme_customer_order_flow, readme_custom_garment_orders, readme_supplier_network, readme_sewing_minigame [EXTRACTED 1.00]
- **Town Procurement Network** — design_issues_gn_302_sheep_farm_procurement, design_issues_gn_303_muslin_supplier, design_issues_gn_304_ribbon_row_catalog, design_issues_gn_305_ship_deck_market, design_issues_gn_306_charity_store [EXTRACTED 1.00]
- **Reference-Driven Visual Layer** — readme_image_backed_scene_architecture, readme_illustrated_characters, readme_town_navigation, design_issues_gn_601_curate_references, design_issues_gn_602_marielle_sprite, design_issues_gn_606_district_map_overlay, design_issues_gn_607_shopfront_title_art [INFERRED 0.95]
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

## Communities (34 total, 13 thin omitted)

### Community 0 - "Art Production Plan"
Cohesion: 0.06
Nodes (46): Auberlin Town Map Reference, Grandmother Character Sheet, Imported File 2 PDF, Marielle Character Sheet, Reference Art Provenance, Runtime Reference Exclusion, Spindle Square Overcast Reference, Spindle Square Sunny Reference (+38 more)

### Community 1 - "Sunny Square Reference"
Cohesion: 0.07
Nodes (36): Art Nouveau Facade, Belle Époque Fantasy Streetscape, Blue Sky and Cumulus Clouds, Central Landmark Composition, Central Pink Landmark Building, Chimney-Rich Skyline, Cobblestone Plaza, Converging Street Perspective (+28 more)

### Community 2 - "Overcast Shopfront Reference"
Cohesion: 0.09
Nodes (32): Abundant Flower Planters, Artisanal Commercial District, Belle Époque Fantasy Architecture, Café de Fleur, Central Architectural Emphasis, Cobblestone Square, Environmental Storytelling, Eye-Level Wide Establishing Shot (+24 more)

### Community 3 - "Wardrobe Catalog Reference"
Cohesion: 0.08
Nodes (31): Black Monochrome Row, Blue Check Row, Brown Earth-Tone Row, Hair Clip, Star Clips, Socks, and Mary Janes, Character Preview Panel Use, Large-Eyed Chibi Girl Character, Selectable Clothing Catalog Use, Coquette Cottagecore Style (+23 more)

### Community 4 - "Interface and Map UI"
Cohesion: 0.17
Nodes (24): add(), advance(), busy(), closePanel(), coinToast(), dialogueOpen(), init(), openBrickworksPanel() (+16 more)

### Community 5 - "Management and Materials"
Cohesion: 0.17
Nodes (27): addTrash(), buyHome(), buySupply(), clamp(), cleanTrash(), clock(), closeDay(), customerConcern() (+19 more)

### Community 6 - "Auberlin Town Geography"
Cohesion: 0.18
Nodes (21): Auberlin Town Map, Central Commercial Core, Charity Store, Class-Stratified Residential Layout, Coastal Trade Access, Her House, Muslin Factory, North Fabric Store (+13 more)

### Community 7 - "Scene Interaction Runtime"
Cohesion: 0.19
Nodes (19): allHotspots(), blocked(), customerAsk(), draw(), drawLetterbox(), drawMarker(), drawNamePill(), drawPrompt() (+11 more)

### Community 8 - "Tailor Exterior Details"
Cohesion: 0.16
Nodes (16): Climbing Flowering Vines, Custom Fit Timeless Style Chalkboard, Tailoring Display Windows, Tailor Shop Exterior Illustration, Fabric Bolts, Lavender Flower Boxes, Handmade with Care Sign, Hanging Tailor Sign (+8 more)

### Community 9 - "Elise Character Reference"
Cohesion: 0.16
Nodes (14): Four-Panel Grandmother Character Sheet, Cheerful Open-Mouth Expression, Chibi Grandmother Character, Gentle Smile While Holding a Small Cup, Expression and Pose Consistency Reference, Front-Facing Hands-in-Pockets Stance, Calm Gentle Smile Expression, Gray Hair in High Bun with Loose Curls (+6 more)

### Community 10 - "Tailoring Mini-Games"
Cohesion: 0.30
Nodes (12): cellAt(), close(), draw(), drawCenteredPage(), drawPageOverlay(), fabricPattern(), matches(), panel() (+4 more)

### Community 11 - "Atelier Interior Design"
Cohesion: 0.22
Nodes (13): Central Cutting Table, Coffee Station, Dress Forms and Mannequins, Finished Dress Rack, Fabric Storage, Fireplace Lounge Area, Indoor Plants, Garment Patterns and Fashion Sketches (+5 more)

### Community 12 - "Marielle Character Reference"
Cohesion: 0.15
Nodes (13): Small Black Shoes, Young Feminine Chibi Design with Large Head and Eyes, Front-Facing Standing Pose with Hands Clasped at Waist, Concerned Expression with Downturned Mouth, Production Use: Character and Costume Consistency Reference, Production Use: Expression Reference, Gentle Closed-Mouth Smile, Long Wavy Dark-Brown Hair, Large Brown Eyes, and Rosy Cheeks (+5 more)

### Community 13 - "Management Smoke Tests"
Cohesion: 0.15
Nodes (12): assert, customer, dressOrder, fs, notices, order, path, report (+4 more)

### Community 14 - "Runtime Art Roadmap"
Cohesion: 0.18
Nodes (12): GN-203 Elise NPC, GN-301 City Portals, GN-602 Marielle Working Sprite and Portrait, GN-603 Elise and Brida Portrait Sheets, GN-606 Illustrated District Map Overlay, GN-607 Shopfront and Title Art, Milestone 2 — Household and Family, Milestone 6 — Art, Audio, and UX (+4 more)

### Community 15 - "Order and Procurement Roadmap"
Cohesion: 0.20
Nodes (10): GN-100 Persist Accepted Orders, GN-105 Order Entity, GN-401 Garment Recipes, GN-405 Pattern Layout and Cutting Mini-Game, GN-406 Finishing Notions, Milestone 3 — Town and Procurement, Custom Garment Orders, Persistent Customer Order Flow (+2 more)

### Community 16 - "Prototype Application Files"
Cohesion: 0.22
Nodes (9): CSS Style Sheet, Prototype Game Page, Data Script, Engine Script, Main Script, Mini-Games Script, Scenes Script, Sprites Script (+1 more)

### Community 17 - "Game Engine Loop"
Cohesion: 0.38
Nodes (4): endFrame(), frame(), play(), tone()

### Community 18 - "Reference Sprite Pipeline"
Cohesion: 0.43
Nodes (4): clearConnectedBackdrop(), isWarmBackdrop(), makeCanvas(), referenceFrame()

## Ambiguous Edges - Review These
- `Bottom Dress and Bow Icon Controls` → `Wardrobe Category Navigation`  [AMBIGUOUS]
  assets/wardrobe.png · relation: implements

## Knowledge Gaps
- **110 isolated node(s):** `P0 Production Assets`, `P1 Production Assets`, `Generation Prompt Recipes`, `Production Canon`, `Long-Term Stability to Coronation Loop` (+105 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Bottom Dress and Bow Icon Controls` and `Wardrobe Category Navigation`?**
  _Edge tagged AMBIGUOUS (relation: implements) - confidence is low._
- **Are the 6 inferred relationships involving `Spindle Square Overcast Scene` (e.g. with `Environmental Storytelling` and `Eye-Level Wide Establishing Shot`) actually correct?**
  _`Spindle Square Overcast Scene` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Hanging Tops Collection` (e.g. with `Repeated Silhouette Variants` and `Pink Sleeveless Top and Pleated Skirt Outfit`) actually correct?**
  _`Hanging Tops Collection` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `P0 Production Assets`, `P1 Production Assets`, `Generation Prompt Recipes` to the rest of the system?**
  _125 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Art Production Plan` be split into smaller, more focused modules?**
  _Cohesion score 0.06086956521739131 - nodes in this community are weakly interconnected._
- **Should `Sunny Square Reference` be split into smaller, more focused modules?**
  _Cohesion score 0.0746031746031746 - nodes in this community are weakly interconnected._
- **Should `Overcast Shopfront Reference` be split into smaller, more focused modules?**
  _Cohesion score 0.0907258064516129 - nodes in this community are weakly interconnected._