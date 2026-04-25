# Fjordhold Production Asset Pipeline (Issue #1, Stage 1)

This document defines the **Stage 1** ingest pipeline for concept mockups and Production Asset Pack V1 integration.

## Goals of Stage 1

- create a stable folder structure for concept references and production-ready assets
- keep current procedural visuals playable while art is in progress
- wire Phaser preload logic to load production assets **only when explicitly enabled**
- avoid shipping unfinished or copied external art

## Folder Structure

### Concept mockups (reference-only, non-runtime)

Store concept sheets and visual direction boards here:

```text
docs/concept_art/
  raw/
  exports/
```

Rules:

- concept files are references, not final runtime assets
- use lowercase snake_case filenames
- keep source prompts/notes adjacent when helpful

### Production runtime assets

Store game-loadable assets here:

```text
public/assets/production/
  characters/
  enemies/
  terrain/
  resources/
  buildings/
  ui/
  vfx/
  audio/
```

Subfolders already prepared for Stage 1 integration:

- `public/assets/production/characters/player/`
- `public/assets/production/resources/nodes/`
- `public/assets/production/buildings/pieces/`

## Asset Index Contract

File: `public/assets/production/asset_pack_v1_index.json`

This JSON file controls what Phaser is allowed to load.

Each entry includes:

- `key`: Phaser texture key
- `type`: `image` or `spritesheet`
- `url`: web path under `public/`
- `enabled`: set to `true` only when file is present and reviewed
- `notes`: authoring reminder
- `frameConfig`: required for spritesheets

## Integration Flow

1. Place or update concept references in `docs/concept_art/raw/*` and curated slices in `docs/concept_art/exports/*`.
2. Create cleaned production PNG files in `public/assets/production/*`.
3. Add/update matching entries in `asset_pack_v1_index.json`.
4. Flip `enabled` from `false` to `true` for verified files.
5. Run `npm run dev` and verify in-game visuals.
6. Run `npm run build` to confirm no compile/bundle regressions.

## Fallback Behavior (Current)

World rendering checks whether a texture exists before using it.

- If texture exists and is enabled + loaded: sprite is used.
- If not: current procedural placeholder visuals remain active.

This protects movement, gathering, inventory, build mode, roof placement, and roof fade while assets are still being produced.


## Stage 2 Building Kit V1 Coverage

Enabled assets in Stage 2:

- build_wood_floor
- build_wood_wall
- build_standing_torch
- build_spike_wall
- build_thatch_roof

All five textures are 64x64 PNGs located under `public/assets/production/buildings/pieces/`.

## Stage 2.1 Building Feel Additions

- Build piece hotkey `6` now maps to **Wood Door**.
- Asset index now includes an opt-in entry for `build_wood_door`:
  - `assets/production/buildings/pieces/build_wood_door_64.png`
  - keep `enabled: false` until a reviewed production door texture is provided.
