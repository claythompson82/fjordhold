# Fjordhold Asset Manifest

This file tracks the production assets needed for Fjordhold.

## Naming Rules

Use lowercase snake_case.

Examples:

- player_viking_spritesheet_48.png
- draugr_raider_spritesheet_48.png
- terrain_frostpine_tiles_32.png
- building_kit_viking_64.png
- icon_iron_axe_48.png

## Asset Status Labels

- `planned` — not created yet
- `concept` — exists as concept art/reference sheet
- `production_needed` — needs clean individual/sheet asset
- `ready` — usable in game
- `integrated` — loaded and used by game code
- `needs_cleanup` — usable but scale/style/transparency needs work

## Current Concept References

Generated concept sheets should be stored in-repo under:

- `docs/concept_art/raw/`
- `docs/concept_art/exports/`

Use these as visual direction only until production assets are prepared.

Concept categories:

- overall Fjordhold art direction
- Viking player sprite direction
- building kit direction
- draugr enemy direction
- UI and item direction

## Runtime Integration Rules (Stage 1)

- Production runtime files live under `public/assets/production/*`.
- Load eligibility is controlled by `public/assets/production/asset_pack_v1_index.json`.
- Entries remain `enabled: false` until files are present and validated.
- Gameplay must keep procedural fallback visuals for any missing/disabled assets.

## Production Asset Pack V1

### 1. Player Character

| Asset | Size | Status | Notes |
|---|---:|---|---|
| player_viking_spritesheet_48.png | 48x48 frames | production_needed | idle, walk, run, attack, chop, mine, build, block, hurt, death |
| player_shadow_48.png | 48x48 | planned | optional soft shadow |

Required animations:

- idle
- walk
- run
- attack_axe
- attack_sword
- chop
- mine
- build_hammer
- block_shield
- hurt
- death

### 2. Enemies

| Asset | Size | Status | Notes |
|---|---:|---|---|
| draugr_raider_spritesheet_48.png | 48x48 frames | production_needed | basic melee enemy |
| draugr_brute_spritesheet_64.png | 64x64 frames | production_needed | heavy structure breaker |
| draugr_archer_spritesheet_48.png | 48x48 frames | production_needed | ranged enemy |
| draugr_shaman_spritesheet_48.png | 48x48 frames | planned | later support enemy |

Required enemy animations:

- idle
- walk
- attack
- hurt
- death

### 3. Wildlife

| Asset | Size | Status | Notes |
|---|---:|---|---|
| boar_spritesheet_48.png | 48x48 frames | planned | food/hide |
| deer_spritesheet_48.png | 48x48 frames | planned | food/hide |
| wolf_spritesheet_48.png | 48x48 frames | planned | hostile wildlife |
| raven_ambient_32.png | 32x32 frames | planned | atmosphere |

### 4. Terrain Tiles

| Asset | Size | Status | Notes |
|---|---:|---|---|
| terrain_frostpine_tiles_32.png | 32x32 tiles | production_needed | main terrain atlas |

Required tiles:

- snow_plain
- snow_grass_blend
- frost_grass
- dirt
- dirt_path
- stone_ground
- cracked_stone
- icy_water
- water_edge_north
- water_edge_south
- water_edge_east
- water_edge_west
- interior_wood_floor
- interior_stone_floor

### 5. Resource Nodes

| Asset | Size | Status | Notes |
|---|---:|---|---|
| resource_nodes_frostpine_64.png | 64x64 frames | production_needed | resources and harvestable props |

Required nodes:

- pine_tree_large
- pine_tree_small
- stump
- fallen_log
- boulder_stone
- iron_ore_node
- berry_bush
- herb_patch
- wood_pile
- stone_pile
- iron_pile

### 6. Building Kit

| Asset | Size | Status | Notes |
|---|---:|---|---|
| building_kit_viking_64.png | 64x64 tiles | production_needed | modular building atlas |
| structures_furniture_viking_96.png | 96x96 / 128x128 | production_needed | crafting and decor objects |

Required building pieces:

#### Floors

- wood_floor
- stone_floor
- reinforced_floor

#### Walls

- wood_wall_north
- wood_wall_east
- wood_wall_south
- wood_wall_west
- half_wall
- window_wall
- stone_wall
- reinforced_wall

#### Doors / Gates

- wood_door_closed
- wood_door_open
- reinforced_door
- palisade_gate_closed
- palisade_gate_open

#### Roofs

- thatch_roof_small
- thatch_roof_medium
- wood_roof_small
- wood_roof_medium
- roof_corner
- roof_ridge

#### Defense

- spike_wall
- palisade_wall
- stone_barricade
- watchtower_small
- trap_spikes

#### Functional Structures

- campfire
- standing_torch
- wall_torch
- bed
- chest
- workbench
- forge
- cooking_station
- repair_bench
- storage_rack

#### Decor

- armor_stand
- banner
- rug
- table
- stool

### 7. Item Icons

| Asset | Size | Status | Notes |
|---|---:|---|---|
| item_icons_48.png | 48x48 icons | production_needed | inventory/crafting icons |

Required icons:

#### Resources

- wood
- stone
- iron_ore
- iron_bar
- hide
- raw_meat
- cooked_meat
- berries
- herbs
- resin
- fiber

#### Tools

- stone_axe
- iron_axe
- pickaxe
- hammer
- repair_hammer

#### Weapons

- wood_club
- axe_weapon
- sword
- spear
- bow
- shield_wood
- shield_iron

#### Armor

- leather_helmet
- leather_chest
- leather_legs
- iron_helmet
- iron_chest
- iron_legs

#### Misc

- torch
- food_bowl
- raid_token
- rune_shard

### 8. UI Kit

| Asset | Size | Status | Notes |
|---|---:|---|---|
| ui_inventory_panel.png | variable | production_needed | inventory window |
| ui_crafting_panel.png | variable | production_needed | crafting window |
| ui_build_menu.png | variable | production_needed | build placement menu |
| ui_hotbar.png | variable | production_needed | main hotbar |
| ui_button_set.png | variable | production_needed | buttons, tabs, toggles |
| ui_tooltip_frame.png | variable | production_needed | tooltip frame |
| ui_raid_warning_banner.png | variable | production_needed | raid alert |
| ui_health_stamina_bars.png | variable | production_needed | HUD bars |

### 9. VFX

| Asset | Size | Status | Notes |
|---|---:|---|---|
| vfx_fjordhold_64.png | 64x64 frames | production_needed | gameplay effects |

Required VFX:

- hit_spark
- block_spark
- critical_hit
- blood_splash
- smoke_puff
- ember_burst
- torch_flame
- build_valid_glow
- build_invalid_glow
- raid_warning_rune
- level_up_rune
- destruction_debris
- repair_spark
- snow_puff

## Integration Priority

1. Temporary placeholder shapes for technical scaffold
2. Terrain + resource nodes
3. Player
4. Building kit
5. UI kit
6. Enemies
7. VFX
8. Audio

## Asset Pipeline Notes

- Concept sheets should be used for style reference, not directly as final game atlases unless manually sliced and cleaned.
- Production sheets should have consistent grid alignment.
- Transparent PNGs are preferred for sprites and icons.
- Keep original full-size generated sheets in a `raw` folder only if needed; otherwise commit cleaned production assets.
