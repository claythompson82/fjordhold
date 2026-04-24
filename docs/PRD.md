# Fjordhold PRD

## Summary

Fjordhold is a top-down Viking-inspired base-builder and raid-defense game set in a single frozen biome. The player gathers resources, builds a warm fortress, crafts tools and gear, and defends the settlement from undead night raids.

## Creator Brand

**ObsidianFire32**

## Target Platform

- Primary: browser playable build
- Secondary: Windows-friendly packaged build

## Target Engine

- Phaser 3
- TypeScript
- Vite

## Player Fantasy

The player begins alone in a frozen fjord clearing and gradually carves out a cozy fortified home. The base becomes both shelter and battlefield. Torches glow, roofs fade open when entering buildings, enemies attack at night, and each upgrade makes the settlement feel more alive.

## Core Loop

1. Explore the Frostpine Fjord.
2. Gather wood, stone, food, hide, and iron.
3. Build a base using modular pieces.
4. Craft better tools, weapons, and armor.
5. Defend the base during night raids.
6. Repair, expand, and improve.

## Design Pillars

### Building Is the Main Toy
Building must be quick, tactile, and satisfying. Placement feedback should feel clear and juicy.

### One Biome, Deep Polish
The MVP uses only one biome: Frostpine Fjord. Polish density matters more than content sprawl.

### Cozy Interior Magic
Roofs fade away when the player enters a building. This is a signature feature and should feel seamless.

### Defense Gives Building Meaning
Raids test the player’s base layout. Walls, doors, spikes, torches, and crafting stations matter.

### Cute But Not Babyish
The style should be charming, chunky, and readable without becoming childish.

## MVP Release

**v0.1.0 — Hearthfire Prototype**

### Must Include

- bootable Phaser/Vite project
- player movement
- camera follow
- Frostpine Fjord map
- basic resource gathering
- inventory and hotbar
- modular building placement
- roof fade / interior reveal system
- workbench crafting
- basic tools, weapon, shield, and armor
- one night raid loop
- local save/load
- basic UI and feedback polish

### MVP Build Pieces

- wood floor
- wood wall
- door
- roof
- standing torch
- chest
- workbench
- spike wall

### MVP Resources

- wood
- stone
- iron ore
- iron bar
- hide
- raw meat
- cooked meat
- berries
- resin

### MVP Craftables

- stone axe
- iron axe
- pickaxe
- hammer
- sword
- wood shield
- leather armor set

### MVP Enemies

- draugr raider
- draugr brute
- draugr archer

## Controls

Proposed controls:

- WASD: move
- Mouse: aim / select
- Left click: attack / gather / place
- Right click: cancel / alternate action
- E: interact
- B: build menu
- Tab: inventory
- 1–8: hotbar
- Esc: pause

## Systems

### Player
Movement, facing, health, stamina, equipment, tool use, combat.

### Gathering
Resource nodes have health, required tool type, drops, and respawn rules.

### Inventory
Stackable items, hotbar, pickup notifications, storage chests.

### Building
Placement ghost, rotation, collision validation, resource cost checks, destruction, repair.

### Interior Reveal
Building zones fade roof layers when the player enters.

### Crafting
Recipes are data-driven and may require stations such as workbench or forge.

### Combat
Melee attacks, ranged enemies, knockback, structure damage, enemy hurt/death states.

### Raid
Night raid warning, enemy wave spawn, base targeting, victory resolution, loot drops.

### Save/Load
Browser local storage first. Save player state, inventory, structures, time, recipes, and raid level.

## Success Criteria

The prototype succeeds if a new player can:

1. understand controls within one minute,
2. gather resources,
3. build a small torchlit lodge,
4. walk inside and see the roof fade,
5. craft a better item,
6. survive or meaningfully fail a raid,
7. want to expand the base after the raid.

## Out of Scope for MVP

- multiplayer
- multiple biomes
- boats
- full quest system
- NPC villages
- skill trees
- complex procedural generation
- online accounts
- monetization

## Tone

Stylish, cozy, dangerous, tactile, and slightly mythic.

Not parody. Not grimdark sludge. Not baby mobile-game cute.

The player should feel like they are building a beautiful little fortress against the cold.
