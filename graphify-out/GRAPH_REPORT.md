# Graph Report - .  (2026-07-14)

## Corpus Check
- 11 files · ~758,714 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 387 nodes · 567 edges · 23 communities (22 shown, 1 thin omitted)
- Extraction: 77% EXTRACTED · 23% INFERRED · 0% AMBIGUOUS · INFERRED: 131 edges (avg confidence: 0.87)
- Token cost: 4,467 input · 4,342 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Game Design and Art Plan|Game Design and Art Plan]]
- [[_COMMUNITY_Sunny Square Reference|Sunny Square Reference]]
- [[_COMMUNITY_Overcast Shopfront Reference|Overcast Shopfront Reference]]
- [[_COMMUNITY_Wardrobe Catalog Reference|Wardrobe Catalog Reference]]
- [[_COMMUNITY_Interface and Map UI|Interface and Map UI]]
- [[_COMMUNITY_Management and Purchases|Management and Purchases]]
- [[_COMMUNITY_Scene and Home Runtime|Scene and Home Runtime]]
- [[_COMMUNITY_Auberlin Town Geography|Auberlin Town Geography]]
- [[_COMMUNITY_Home Progression Roadmap|Home Progression Roadmap]]
- [[_COMMUNITY_Tailor Exterior Details|Tailor Exterior Details]]
- [[_COMMUNITY_Elise Character Reference|Elise Character Reference]]
- [[_COMMUNITY_Tailoring Mini-Games|Tailoring Mini-Games]]
- [[_COMMUNITY_Atelier Interior Design|Atelier Interior Design]]
- [[_COMMUNITY_Marielle Character Reference|Marielle Character Reference]]
- [[_COMMUNITY_Management Smoke Tests|Management Smoke Tests]]
- [[_COMMUNITY_Bare Home Environment|Bare Home Environment]]
- [[_COMMUNITY_Prototype Application Files|Prototype Application Files]]
- [[_COMMUNITY_Home Upgrade Props|Home Upgrade Props]]
- [[_COMMUNITY_Game Engine Loop|Game Engine Loop]]
- [[_COMMUNITY_Reference Sprite Pipeline|Reference Sprite Pipeline]]
- [[_COMMUNITY_Wardrobe Navigation|Wardrobe Navigation]]

## God Nodes (most connected - your core abstractions)
1. `The Gilded Needle Product and Game Design Plan` - 23 edges
2. `ensure()` - 22 edges
3. `Spindle Square Overcast Scene` - 18 edges
4. `Auberlin Town Map` - 15 edges
5. `Hanging Tops Collection` - 13 edges
6. `Tailor Shop Storefront` - 11 edges
7. `European Town Square` - 11 edges
8. `clamp()` - 11 edges
9. `draw()` - 10 edges
10. `Marielle Chibi Character` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Family Home` --semantically_similar_to--> `Bare Home Background`  [INFERRED] [semantically similar]
  README.md → design/ASSET_MANIFEST.md
- `Family Stability` --semantically_similar_to--> `GN-208 Pantry Stove and Bed Benefits`  [INFERRED] [semantically similar]
  README.md → design/ISSUES.md
- `Auberlin Town Map Reference` --conceptually_related_to--> `Auberlin District Map`  [INFERRED]
  assets/reference/README.md → design/PRODUCT_PLAN.md
- `Grandmother Character Sheet` --conceptually_related_to--> `Brida Thimm`  [INFERRED]
  assets/reference/README.md → design/PRODUCT_PLAN.md
- `Marielle Character Sheet` --conceptually_related_to--> `Marielle Thimm`  [INFERRED]
  assets/reference/README.md → design/PRODUCT_PLAN.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Bare Home Progression** — readme_family_home, design_asset_manifest_bare_home_background, design_asset_manifest_home_upgrade_props, design_issues_current_home_map, design_issues_render_home_items, design_issues_home_visual_states [INFERRED 0.95]
- **Family Stability System** — readme_family_stability, design_issues_mother_health_schedule, design_issues_pantry_stove_bed_benefits [INFERRED 0.85]
- **Production Governance** — readme_production_map, design_asset_manifest_art_asset_manifest_and_curation_plan, design_issues_production_issue_backlog [EXTRACTED 1.00]
- **Prototype and Vertical Slice Alignment** — readme_the_gilded_needle_prototype, design_issues_milestone_1_management_vertical_slice, design_product_plan_vertical_slice [INFERRED 0.85]
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

## Communities (23 total, 1 thin omitted)

### Community 0 - "Game Design and Art Plan"
Cohesion: 0.07
Nodes (39): Auberlin Town Map Reference, Grandmother Character Sheet, Imported File 2 PDF, Marielle Character Sheet, Reference Art Provenance, Runtime Reference Exclusion, Spindle Square Overcast Reference, Spindle Square Sunny Reference (+31 more)

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
Cohesion: 0.18
Nodes (24): add(), advance(), busy(), closePanel(), coinToast(), dialogueOpen(), init(), openBrickworksPanel() (+16 more)

### Community 5 - "Management and Purchases"
Cohesion: 0.17
Nodes (27): addTrash(), buyHome(), buySupply(), clamp(), cleanTrash(), clock(), closeDay(), customerConcern() (+19 more)

### Community 6 - "Scene and Home Runtime"
Cohesion: 0.18
Nodes (21): allHotspots(), blocked(), customerAsk(), draw(), drawLetterbox(), drawMarker(), drawNamePill(), drawPrompt() (+13 more)

### Community 7 - "Auberlin Town Geography"
Cohesion: 0.18
Nodes (21): Auberlin Town Map, Central Commercial Core, Charity Store, Class-Stratified Residential Layout, Coastal Trade Access, Her House, Muslin Factory, North Fabric Store (+13 more)

### Community 8 - "Home Progression Roadmap"
Cohesion: 0.11
Nodes (21): Art Asset Manifest and Curation Plan, Bare Home Background, Home Background Generation Recipe, Home Upgrade Props, Runtime Asset Provenance, GN-201 Current Home Map, GN-604 Home Visual States, Household and Family Milestone (+13 more)

### Community 9 - "Tailor Exterior Details"
Cohesion: 0.16
Nodes (16): Climbing Flowering Vines, Custom Fit Timeless Style Chalkboard, Tailoring Display Windows, Tailor Shop Exterior Illustration, Fabric Bolts, Lavender Flower Boxes, Handmade with Care Sign, Hanging Tailor Sign (+8 more)

### Community 10 - "Elise Character Reference"
Cohesion: 0.16
Nodes (14): Four-Panel Grandmother Character Sheet, Cheerful Open-Mouth Expression, Chibi Grandmother Character, Gentle Smile While Holding a Small Cup, Expression and Pose Consistency Reference, Front-Facing Hands-in-Pockets Stance, Calm Gentle Smile Expression, Gray Hair in High Bun with Loose Curls (+6 more)

### Community 11 - "Tailoring Mini-Games"
Cohesion: 0.30
Nodes (12): cellAt(), close(), draw(), drawCenteredPage(), drawPageOverlay(), fabricPattern(), matches(), panel() (+4 more)

### Community 12 - "Atelier Interior Design"
Cohesion: 0.22
Nodes (13): Central Cutting Table, Coffee Station, Dress Forms and Mannequins, Finished Dress Rack, Fabric Storage, Fireplace Lounge Area, Indoor Plants, Garment Patterns and Fashion Sketches (+5 more)

### Community 13 - "Marielle Character Reference"
Cohesion: 0.15
Nodes (13): Small Black Shoes, Young Feminine Chibi Design with Large Head and Eyes, Front-Facing Standing Pose with Hands Clasped at Waist, Concerned Expression with Downturned Mouth, Production Use: Character and Costume Consistency Reference, Production Use: Expression Reference, Gentle Closed-Mouth Smile, Long Wavy Dark-Brown Hair, Large Brown Eyes, and Rosy Cheeks (+5 more)

### Community 14 - "Management Smoke Tests"
Cohesion: 0.15
Nodes (12): assert, customer, dressOrder, fs, notices, order, path, report (+4 more)

### Community 15 - "Bare Home Environment"
Cohesion: 0.25
Nodes (9): Bare One-Room Home Interior, Basic Empty Kitchen Area, Empty Wall Shelves, Home Upgrade Progression, Wall-Mounted Oil Lamp, Single Wooden Bed, Sparse Starter Furnishings, Simple Wash Basin (+1 more)

### Community 16 - "Prototype Application Files"
Cohesion: 0.22
Nodes (9): CSS Style Sheet, Prototype Game Page, Data Script, Engine Script, Main Script, Mini-Games Script, Scenes Script, Sprites Script (+1 more)

### Community 17 - "Home Upgrade Props"
Cohesion: 0.38
Nodes (7): Home Upgrades Asset Sheet, Cast-Iron Kitchen Stove, Household Furnishing Upgrades, Wooden Icebox Cabinet, Kitchen Appliance Upgrades, Sewing and Knitting Chest, Simple Wooden Chair

### Community 18 - "Game Engine Loop"
Cohesion: 0.38
Nodes (4): endFrame(), frame(), play(), tone()

### Community 19 - "Reference Sprite Pipeline"
Cohesion: 0.43
Nodes (4): clearConnectedBackdrop(), isWarmBackdrop(), makeCanvas(), referenceFrame()

## Ambiguous Edges - Review These
- `Bottom Dress and Bow Icon Controls` → `Wardrobe Category Navigation`  [AMBIGUOUS]
  assets/wardrobe.png · relation: implements

## Knowledge Gaps
- **95 isolated node(s):** `Spindle Square Sunny Reference`, `Spindle Square Overcast Reference`, `Production Canon`, `Long-Term Stability to Coronation Loop`, `Day Phase Structure` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Bottom Dress and Bow Icon Controls` and `Wardrobe Category Navigation`?**
  _Edge tagged AMBIGUOUS (relation: implements) - confidence is low._
- **Why does `Art Asset Manifest and Curation Plan` connect `Home Progression Roadmap` to `Game Design and Art Plan`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `Production Style Lock` connect `Game Design and Art Plan` to `Home Progression Roadmap`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `Spindle Square Overcast Scene` (e.g. with `Environmental Storytelling` and `Eye-Level Wide Establishing Shot`) actually correct?**
  _`Spindle Square Overcast Scene` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Hanging Tops Collection` (e.g. with `Repeated Silhouette Variants` and `Pink Sleeveless Top and Pleated Skirt Outfit`) actually correct?**
  _`Hanging Tops Collection` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Spindle Square Sunny Reference`, `Spindle Square Overcast Reference`, `Runtime Reference Exclusion` to the rest of the system?**
  _109 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Game Design and Art Plan` be split into smaller, more focused modules?**
  _Cohesion score 0.06747638326585695 - nodes in this community are weakly interconnected._