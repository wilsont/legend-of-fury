# Legend of Fury - Implementation Plan

Goal: Create a browser-based JRPG with a Final Fantasy 6 style aesthetic, 32-bit SNES graphics, and a robust turn-based combat system.

## Phase 1: Project Setup & Core Engine
- Initialize project with Vite, React, and TypeScript.
- Setup basic game loop and canvas rendering.
- Implement input handling for keyboard controls.
- Create 10x10 maze world map with collision detection.

## Phase 2: Magic & Leveling
- Add `Level` and `XP` to character stats.
- Implement Level Up logic (100 XP per level).
- Define Magic spell system (Fire, Ice, Storm, Lightning).
- Implement spell unlocking based on character level.
- Add Magic Menu to the Battle Scene.

## Phase 3: Visible Enemies
- Replace random encounters with visible enemy groups on the map.
- Implement collision-triggered battles with map-based enemies.
- Add logic to remove defeated enemies from the persistent world map.

## Phase 4: Randomized Leveling
- Implement randomized stat growth on level up (+1-5 for Str/Def/Spd, +10-20 for HP/MP).
- Set maximum level cap at 99.
- Ensure XP overflow handles multiple level ups correctly.

## Phase 5: Expanded Encounters
- Update battle logic to support 1-3 randomized enemies per fight.
- Populate the world map with 10 random enemy groups on valid tiles.

## Phase 6: Game Menu System
- Map the 'M' key to toggle the main game menu.
- Implement the Main Menu UI with Status, Magic, and Inventory options.
- **Status Screen**: Detailed layout for character stats and portraits.
- **Magic Screen**: Filter spells per character and display spell details.
- **Inventory System**: Define structured item data and display quantities.

## Phase 7: Battle Polish
- Ensure all enemies start battles with full HP and MP.
- Implement high randomization for enemy reinforcement types in battle.

## Phase 8: Asset Integration
- Replace placeholder rectangles with 32-bit SNES style sprites.
- Create/Load sprite sheets for party members and enemies.
- Update `MapScene` and `BattleScene` to use `ctx.drawImage` for pixel-consistent rendering.

## Phase 9: Map Expansion & World Building
- Expand the world map to a 30x30 scrolling environment.
- Implement a camera/scrolling system that centers on the player.
- Add diverse terrain types: Mountains, Forest, Water, and Bridges.
- Introduce interactive objects:
    - **Treasure Chests**: Discoverable items in the world.
    - **NPCs**: Friendly characters with dialogue.
- Optimize rendering with visibility culling for the larger map.
