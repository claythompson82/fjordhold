# AGENTS.md — Fjordhold Codex Instructions

This file defines how AI coding agents should work inside the Fjordhold repository.

## Project Identity

**Fjordhold** is a stylish open-source Viking-inspired top-down base-builder and raid-defense game by **ObsidianFire32**.

The game is original. It is inspired by broad Nordic survival fantasy, cozy base-building, crafting, and night defense loops, but it must not copy any protected game assets, names, UI, code, screenshots, characters, mechanics wording, or distinctive worldbuilding from existing games.

## North Star

Build a warm fortress in a frozen fjord. Gather resources, craft gear, light the hearth, and survive the night raids.

## Technical Stack

Use this stack unless the project owner explicitly changes it:

- Phaser 3
- TypeScript
- Vite
- Browser-first development
- Windows-friendly packaging later

Do not introduce a different game engine without documenting the reason in `docs/CODEX_PLAN.md` and getting approval.

## Development Principles

1. Keep changes small and testable.
2. Preserve the approved art direction.
3. Prefer data-driven systems over hardcoded content.
4. Keep the game playable in a normal browser.
5. Avoid paid third-party runtime dependencies.
6. Do not add networked multiplayer for MVP.
7. Do not add multiple biomes for MVP.
8. Do not add large features without updating docs.
9. Maintain clear file names and predictable folder structure.
10. Favor juicy, readable gameplay over technical cleverness.

## Non-Infringement Rules

Agents must avoid:

- Valheim names, screenshots, assets, icons, UI, code, map language, or distinctive content
- modern franchise Norse IP
- copied music, sound, or art
- direct reproductions of commercial sprites or tilesets
- misleading claims that AI-assisted assets are hand-drawn

Agents may use:

- public-domain mythic concepts in broad form
- original Viking-inspired fantasy names
- original AI-assisted assets created specifically for Fjordhold
- generic survival/crafting/base-defense mechanics

## Repo Structure

Expected structure:

```text
src/
  main.ts
  game/
    scenes/
    systems/
    entities/
    data/
    utils/
public/
  assets/
    characters/
    terrain/
    buildings/
    resources/
    ui/
    vfx/
    audio/
docs/
  PRD.md
  STYLE_GUIDE.md
  ASSET_MANIFEST.md
  CODEX_PLAN.md
  ROADMAP.md
  PROMPTS.md
tools/
```

## Required Data-Driven Content

Use JSON or TypeScript data modules for:

- items
- recipes
- build pieces
- enemies
- raids
- map configuration

Do not bury these values inside scene code unless they are temporary placeholders.

## MVP Feature Priorities

The first public prototype is:

**v0.1.0 — Hearthfire Prototype**

Priority features:

1. Bootable Phaser/Vite project
2. Player movement and camera follow
3. Frostpine Fjord map
4. Resource gathering
5. Inventory and hotbar
6. Modular building placement
7. Roof fade / interior reveal system
8. Workbench crafting
9. Basic weapons and armor
10. One night raid loop
11. Local save/load
12. Basic polish: particles, UI feedback, readable controls

## Code Quality Rules

- Use TypeScript types for game objects and data models.
- Keep scene files thin when possible; move logic into systems.
- Avoid global mutable state except through an explicit game state object.
- Use clear names over clever abstractions.
- Comment tricky systems, especially building placement and interior reveal.
- Keep performance reasonable for average Windows laptops/desktops.

## Asset Integration Rules

- Keep assets under `public/assets`.
- Use lowercase snake_case names.
- Prefer consistent sizes:
  - character frames: 48x48 or 64x64
  - tiles: 32x32 or 64x64
  - building pieces: 64x64 or 96x96
  - item icons: 48x48
  - VFX frames: 64x64
- Do not commit huge unused generated sheets without a reason.
- If using concept sheets, also document how they will be sliced or replaced by production assets.

## Testing Expectations

For every meaningful feature, verify:

- the app boots
- there are no TypeScript build errors
- the player can still move
- UI remains usable
- no core loop regressions

When browser automation is available, test:

- boot screen
- movement
- gathering
- inventory open/close
- build placement
- crafting
- raid start
- save/load

## PR / Commit Style

Use concise commit messages:

- `Initialize Phaser scaffold`
- `Add player movement system`
- `Add building placement prototype`
- `Add Frostpine terrain assets`
- `Implement roof fade interior reveal`

## Important Creative Rule

Fjordhold should feel stylish, warm, dangerous, and satisfying. Do not let it become generic gray prototype mush. If a system works but feels dull, add feedback: glow, sound hook, particle, shake, animation, or UI response.

Make it playable. Make it original. Make it worth showing. 🪓
