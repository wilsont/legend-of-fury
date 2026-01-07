# JRPG Game Implementation Plan

Goal: Create a browser-based JRPG with a Final Fantasy 6 style aesthetic.

## Phase 9: Map Expansion & World Building

### User Review Required
- **Map Size**: Proposing a 20x20 or 30x30 map with scrolling/camera logic.
- **Interactivity**: Should I add treasure chests or simple NPCs next?
- **Camera**: The current game renders the whole 10x10 map. For larger maps, we need a camera system that follows the player.

### Proposed Changes

#### Engine (`src/engine`)
- **[constants.ts](file:///src/engine/constants.ts)**:
    - Increase `MAP_WIDTH` and `MAP_HEIGHT`.
    - Adjust `CANVAS_WIDTH` / `CANVAS_HEIGHT` if needed (or keep same and use camera).

#### Map System (`src/map`)
- **[MapScene.ts](file:///src/map/MapScene.ts)**:
    - Update `MAZE_LAYOUT` to be larger and more complex.
    - Implement `camera` offset in `draw()` method to center on player.
    - Add new `TileType` enum/handling for Forest, Water, etc.
    - Add `chests` or `NPCs` array to manage interactive world objects.

#### Assets
- Generate additional tiles for the tileset (Water, Forest, Chest).

### Verification Plan
- **Manual Verification**:
    - Verify player can walk around a larger map.
    - Verify camera follows the player and stops at map edges.
    - Verify collision works with new tile types (e.g., can't walk on water).
    - Verify "Interactive" objects show up.
