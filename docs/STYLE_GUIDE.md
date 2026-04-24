# Fjordhold Style Guide

## Visual Identity

Fjordhold is a chunky, stylish, top-down Viking-inspired base-builder set in a frozen fjord. The look should feel like a premium miniature diorama: readable, charming, cozy, dangerous, and polished.

## Keywords

- Frostpine
- torchlit
- timber
- slate
- iron
- hide
- amber glow
- blue moonlight
- chunky miniatures
- cozy brutality
- raid night
- carved wood UI

## Camera / View

Use a top-down view with slight dimensionality. Assets should read from above while still showing height and silhouette.

Avoid pure flat board-game icons. Avoid full isometric complexity unless the implementation explicitly supports it.

## Palette

### Environment

- deep blue-black shadows
- slate gray stone
- frosted white snow
- cold blue ambient light
- muted pine green
- dark brown timber

### Warmth

- amber torchlight
- ember orange
- warm yellow highlights
- leather brown

### Danger / Combat

- blood red
- rusted iron
- ghost blue enemy glow
- warning orange/red

### UI

- dark carved wood
- blackened iron
- leather panels
- rune-blue highlights
- amber active states

## Lighting

Lighting should carry the emotional contrast:

- outside: cold, windy, moonlit
- inside: warm, amber, safe
- raid: red/orange warning accents, harsh shadows

Torches and fires are key mood anchors.

## Character Style

Characters should look like chunky tabletop miniatures with readable silhouettes.

### Player

- stout Viking settler
- practical helmet, no silly oversized horns
- fur shoulder trim
- leather/iron gear
- amber/warm accents
- clear tool/weapon silhouettes

### Enemies

- undead raider faction
- colder and sharper silhouettes
- glowing blue eyes or frost accents
- dark armor, rusted weapons, cracked shields
- readable threat type by shape

Enemy examples:

- Raider: balanced silhouette, axe/sword
- Brute: larger shoulders, heavy weapon
- Archer: narrow profile, bow silhouette
- Shaman: robe/rune staff silhouette

## Building Style

Buildings should feel modular but not sterile.

### Materials

- carved timber
- thatch/wood roofs
- rope bindings
- iron braces
- stone foundations
- warm interior rugs/furniture

### Shape Language

- chunky beams
- angled roof pieces
- thick walls
- slightly exaggerated corners
- visible snow caps on roof pieces where appropriate

## UI Style

The UI should feel like a premium survival game interface:

- dark wood panels
- iron framing
- amber highlights
- crisp readable text
- compact but not cramped
- buttons should feel tactile

Avoid default HTML/game jam UI. UI polish matters.

## VFX Style

VFX should be small, readable, and satisfying:

- hit sparks
- chopping chips
- mining stone flakes
- ember bursts
- smoke puffs
- snow particles
- build placement glows
- raid warning runes

## Asset Requirements

- Use transparent backgrounds for sprites where possible.
- Keep scale consistent.
- Use lowercase snake_case filenames.
- Avoid baked-in labels/text on non-UI assets.
- Avoid over-detail that becomes muddy at gameplay scale.
- Keep lighting direction consistent.

## Target Asset Sizes

- Character frames: 48x48 or 64x64
- Terrain tiles: 32x32 or 64x64
- Building pieces: 64x64 or 96x96
- Large structures: 128x128 or 192x192
- Item icons: 48x48
- VFX frames: 64x64

## Do

- Make every interaction feel tactile.
- Use warm/cold contrast heavily.
- Preserve readability above detail.
- Give building pieces strong silhouettes.
- Use consistent visual language across sprites and UI.

## Do Not

- Do not copy existing commercial game assets or UI.
- Do not use modern franchise-specific Norse designs.
- Do not make the game look generic gray-box for long.
- Do not let AI-generated asset inconsistencies pile up without cleanup.
- Do not overcomplicate the first biome.

## Style Promise

The player should want to take screenshots of their base.

If a structure works mechanically but does not make the player want to place another one, it needs more visual and feedback polish.
