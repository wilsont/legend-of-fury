# Browser JRPG

A turn-based JRPG style game running in the browser using React + TypeScript + Canvas.

## Features

- **Classic JRPG Style**: 32-bit SNES aesthetics with a custom 2D engine.
- **World Map**: Grid-based movement with wall collisions and random encounters.
- **Battle System**:
  - Turn-based combat (FF6 inspired).
  - **Party**: 4 Playable Characters (Lukas, Theodor, Joy, Wilson).
  - **Magic**: Casting system with 4 elements (Fire, Ice, Storm, Lightning) and 3 tiers.
  - **Leveling**: XP system with level-ups and stat growth.
  - **Enemies**: Variety of beasts (Lion, Tiger, Dog, Slime, Bat).

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to the local URL (usually `http://localhost:5173`).

## Controls

- **Arrow Keys / WASD**: Move character, Navigate menus.
- **Space / Enter**: Interact, Select menu option.

## Development

- `src/engine`: Core game loop and input handling.
- `src/map`: Map scene logic.
- `src/battle`: Battle system logic.
- `src/data`: Game data (Party, Enemies, Magic).
