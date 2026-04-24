# Fjordhold

**Fjordhold** is a stylish open-source Viking-inspired top-down base-builder and raid-defense game by **ObsidianFire32**.

Build a warm fortress in a frozen fjord. Gather resources, craft gear, light the hearth, and survive the night raids.

## Vision

Fjordhold is designed as a compact, polished survival-crafting toybox focused on:

- top-down base building
- cozy torchlit interiors
- crafting and progression
- raid defense
- one deeply polished frozen biome
- original AI-assisted art direction

The goal is not to clone any existing game. Fjordhold draws from broad public-domain Nordic survival fantasy while maintaining original naming, systems, assets, UI, and world identity.

## Current Status

Early playable scaffold.

You can now run a first browser build with:

```bash
npm install
npm run dev
```

The current build includes:

- Phaser 3 + TypeScript + Vite scaffold
- boot / preload / world / UI scenes
- a styled Frostpine Fjord placeholder map
- a controllable placeholder Viking character
- camera follow
- initial HUD
- placeholder asset folders

Planned first public release:

**v0.1.0 — Hearthfire Prototype**

Target features:

- Frostpine Fjord playable map
- player movement
- resource gathering
- inventory and hotbar
- modular building
- roof fade / interior reveal system
- workbench crafting
- basic weapons and armor
- one night raid loop
- local save/load

## Tech Stack

- Phaser 3
- TypeScript
- Vite
- browser-first development
- Windows-friendly packaged build later

## Local Development

Requirements:

- Node.js 20+
- npm

Run locally:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```text
src/
  main.ts
  styles.css
  game/
    scenes/
      BootScene.ts
      PreloadScene.ts
      WorldScene.ts
      UIScene.ts
public/
  assets/
    characters/
    terrain/
    buildings/
    resources/
    ui/
    vfx/
docs/
```

## Licensing

Planned licensing:

- Code: MIT License
- Art assets: CC BY-NC 4.0 unless otherwise stated

See `ART_LICENSE.md` for details once assets are added.

## Creator

Created by **ObsidianFire32**.

Project repo: <https://github.com/claythompson82/fjordhold>
