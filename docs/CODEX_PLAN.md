# Fjordhold Codex Plan

This document defines how Codex should build Fjordhold in controlled phases.

## Goal

Create a playable, stylish, browser-first top-down Viking-inspired base-builder and raid-defense game.

## Codex Operating Mode

Work like a small game studio. Use focused tasks, small commits, and visible progress.

## Recommended Agent Roles

### 1. Game Architect

Owns:

- Phaser/Vite/TypeScript setup
- folder structure
- scene organization
- data models
- build reliability

### 2. Gameplay Programmer

Owns:

- player movement
- gathering
- inventory
- building placement
- crafting
- combat
- raids
- save/load

### 3. Asset Integration Agent

Owns:

- asset directories
- texture atlas definitions
- sprite sheet loading
- animation keys
- scale normalization
- placeholder-to-final asset swaps

### 4. UX / Juice Agent

Owns:

- particles
- glow effects
- screen shake
- placement feedback
- UI responsiveness
- hit feedback
- raid warning drama

### 5. QA / Browser Testing Agent

Owns:

- boot checks
- movement checks
- interaction checks
- crafting/building regression checks
- save/load checks
- smoke tests

## Build Phases

### Phase 0 — Repo Setup

Deliver:

- README
- AGENTS.md
- license files
- docs
- package scaffold

Acceptance:

- repo is understandable from README and docs
- Codex can infer the next work without asking for project direction

### Phase 1 — Phaser Scaffold

Deliver:

- Vite + TypeScript project
- Phaser dependency
- boot scene
- preload scene
- world scene
- UI scene placeholder
- empty asset folders

Acceptance:

- `npm install`
- `npm run dev`
- browser opens playable canvas
- no TypeScript errors

### Phase 2 — Player + Map Prototype

Deliver:

- player placeholder sprite
- WASD movement
- camera follow
- simple Frostpine map
- collision basics

Acceptance:

- player moves smoothly
- camera follows
- map renders with visible terrain zones

### Phase 3 — Gathering + Inventory

Deliver:

- resource node entity
- axe/pick interaction
- resource drops
- inventory state
- hotbar UI placeholder

Acceptance:

- player can gather wood/stone
- resource counts update visibly

### Phase 4 — Building System

Deliver:

- build menu placeholder
- placement ghost
- valid/invalid placement
- place floor/wall/door/roof/torch/chest/workbench/spike
- remove/repair placeholder

Acceptance:

- player can build a small enclosed lodge
- placed objects persist in memory

### Phase 5 — Interior Reveal

Deliver:

- building zone detection
- roof layer fade
- interior visibility behavior

Acceptance:

- player enters built structure
- roof fades smoothly
- player exits and roof returns

### Phase 6 — Crafting

Deliver:

- recipes data
- workbench interaction
- crafting menu
- item creation
- basic equipment

Acceptance:

- player crafts at least one tool, one weapon, one armor item

### Phase 7 — Combat + Raid

Deliver:

- player attack
- enemy entity
- enemy AI
- structure damage
- night raid trigger
- wave clear state

Acceptance:

- raid starts
- enemies attack player/base
- player can win or lose

### Phase 8 — Save/Load

Deliver:

- local storage save
- load on start
- reset save option

Acceptance:

- player can build, save, reload, and keep structures/inventory

### Phase 9 — Asset Integration

Deliver:

- cleaned production assets loaded
- animations wired
- UI art applied
- VFX applied

Acceptance:

- prototype looks recognizably like Fjordhold art direction

### Phase 10 — Polish + Public v0.1.0

Deliver:

- audio hooks or simple sounds
- particle pass
- UI polish
- balancing
- controls guide
- screenshots/GIF-ready moments
- Windows-friendly instructions

Acceptance:

- repo is playable by a new user
- README has setup instructions
- v0.1.0 tag can be created

## First Codex Task

Initialize the Phaser/Vite/TypeScript scaffold without adding advanced gameplay yet.

Requirements:

- preserve existing docs
- add package.json
- add tsconfig.json
- add vite.config.ts
- add src/main.ts
- add basic Phaser scenes
- add public/assets folder placeholders
- add npm scripts
- add simple canvas with a booting world scene

## Second Codex Task

Add player movement and camera follow using placeholder assets.

## Third Codex Task

Add resource node harvesting and inventory counts.

## Testing Commands

Expected commands after scaffold:

```bash
npm install
npm run dev
npm run build
```

If test tooling is added:

```bash
npm run test
```

## Important Constraints

- Do not require external paid APIs to run the game.
- Do not add backend services for MVP.
- Do not add multiplayer.
- Keep browser performance reasonable.
- Keep code understandable for contributors.
- Keep art direction aligned with `docs/STYLE_GUIDE.md`.
