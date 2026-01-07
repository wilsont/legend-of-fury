import { ACTUAL_TILE_SIZE, MAP_HEIGHT, MAP_WIDTH, CANVAS_WIDTH, CANVAS_HEIGHT } from '../engine/constants';
import { input } from '../engine/Input';
import type { Position } from '../engine/types';

// 0 = Floor, 1 = Wall
// Tile Mapping: 0=Wall, 1=Grass, 2=Water, 3=Forest, 4=Mountain, 5=Chest, 6=NPC, 7=Bridge, 8=Vortex
const TILE_DATA = {
    WALL: 0,
    GRASS: 1,
    WATER: 2,
    FOREST: 3,
    MOUNTAIN: 4,
    CHEST: 5,
    NPC: 6,
    BRIDGE: 7,
    VORTEX: 8
};

export class MapScene {
    private playerPos: Position = { x: 5, y: 5 };
    private moveTimer: number = 0;
    private MOVE_DELAY: number = 0.2;
    onEncounter: (enemyType: string, onDefeat: () => void) => void;

    private enemies: Array<{ x: number, y: number, type: string, id: number }> = [];
    private chests: Array<{ x: number, y: number, item: string, opened: boolean }> = [];
    private npcs: Array<{ x: number, y: number, name: string, dialog: string }> = [];
    private nextId: number = 0;

    private mapData: number[][] = [];

    // Assets
    private static tileset: HTMLImageElement | null = null;
    private static partySheet: HTMLImageElement | null = null;
    private static enemySheet: HTMLImageElement | null = null;

    constructor(onEncounter: (enemyType: string, onDefeat: () => void) => void) {
        this.onEncounter = onEncounter;
        this.loadAssets();
        this.generateMap();
        this.spawnEntities();
    }

    private generateMap() {
        this.mapData = [];
        for (let y = 0; y < MAP_HEIGHT; y++) {
            const row: number[] = [];
            for (let x = 0; x < MAP_WIDTH; x++) {
                // Border/Walls
                if (x === 0 || y === 0 || x === MAP_WIDTH - 1 || y === MAP_HEIGHT - 1) {
                    row.push(TILE_DATA.WALL);
                } else {
                    // Random noise for terrain
                    const rand = Math.random();
                    if (rand < 0.05) row.push(TILE_DATA.MOUNTAIN);
                    else if (rand < 0.15) row.push(TILE_DATA.FOREST);
                    else if (rand < 0.18) row.push(TILE_DATA.WATER);
                    else row.push(TILE_DATA.GRASS);
                }
            }
            this.mapData.push(row);
        }

        // Add a river
        for (let x = 0; x < MAP_WIDTH; x++) {
            this.mapData[15][x] = TILE_DATA.WATER;
        }
        // Add a bridge
        this.mapData[15][10] = TILE_DATA.BRIDGE;
    }

    private spawnEntities() {
        const enemyTypes = ['SLIME', 'BAT', 'LION', 'TIGER', 'DOG'];
        for (let i = 0; i < 20; i++) {
            let placed = false;
            while (!placed) {
                const x = Math.floor(Math.random() * MAP_WIDTH);
                const y = Math.floor(Math.random() * MAP_HEIGHT);
                if (this.isWalkable(x, y) && !this.enemies.some(e => e.x === x && e.y === y)) {
                    this.spawnEnemy(x, y, enemyTypes[Math.floor(Math.random() * enemyTypes.length)]);
                    placed = true;
                }
            }
        }

        // Add some chests
        for (let i = 0; i < 5; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * MAP_WIDTH);
                y = Math.floor(Math.random() * MAP_HEIGHT);
            } while (!this.isWalkable(x, y));
            this.chests.push({ x, y, item: 'Potion', opened: false });
        }

        // Add an NPC
        this.npcs.push({ x: 6, y: 6, name: 'Old Man', dialog: 'Welcome to the big world! Avoid the deep vortex.' });
    }

    private isWalkable(x: number, y: number): boolean {
        if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
        const tile = this.mapData[y][x];
        return tile === TILE_DATA.GRASS || tile === TILE_DATA.BRIDGE || tile === TILE_DATA.FOREST;
    }

    spawnEnemy(x: number, y: number, type: string) {
        this.enemies.push({ x, y, type, id: this.nextId++ });
    }

    update(dt: number) {
        this.moveTimer -= dt;
        if (this.moveTimer > 0) return;

        let dx = 0, dy = 0;
        if (input.up) dy = -1;
        else if (input.down) dy = 1;
        else if (input.left) dx = -1;
        else if (input.right) dx = 1;

        if (dx !== 0 || dy !== 0) {
            const nextX = this.playerPos.x + dx;
            const nextY = this.playerPos.y + dy;

            if (this.isWalkable(nextX, nextY)) {
                // Enemy Check
                const enemyIdx = this.enemies.findIndex(e => e.x === nextX && e.y === nextY);
                if (enemyIdx !== -1) {
                    const e = this.enemies[enemyIdx];
                    this.onEncounter(e.type, () => {
                        this.enemies = this.enemies.filter(en => en.id !== e.id);
                    });
                    return;
                }

                // Interaction Check (Chest/NPC)
                const chest = this.chests.find(c => c.x === nextX && c.y === nextY && !c.opened);
                if (chest) {
                    console.log(`Found a ${chest.item}!`);
                    chest.opened = true;
                    this.moveTimer = 0.5;
                    return;
                }

                this.playerPos.x = nextX;
                this.playerPos.y = nextY;
                this.moveTimer = this.MOVE_DELAY;
            }
        }
    }

    private loadAssets() {
        if (!MapScene.tileset) {
            MapScene.tileset = new Image();
            MapScene.tileset.src = '/assets/tileset.png';
        }
        if (!MapScene.partySheet) {
            MapScene.partySheet = new Image();
            MapScene.partySheet.src = '/assets/party.png';
        }
        if (!MapScene.enemySheet) {
            MapScene.enemySheet = new Image();
            MapScene.enemySheet.src = '/assets/enemies.png';
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        const viewWidth = CANVAS_WIDTH;
        const viewHeight = CANVAS_HEIGHT;

        // Camera Math: Center on player
        const cameraX = Math.max(0, Math.min(MAP_WIDTH * ACTUAL_TILE_SIZE - viewWidth, this.playerPos.x * ACTUAL_TILE_SIZE - viewWidth / 2));
        const cameraY = Math.max(0, Math.min(MAP_HEIGHT * ACTUAL_TILE_SIZE - viewHeight, this.playerPos.y * ACTUAL_TILE_SIZE - viewHeight / 2));

        ctx.save();
        ctx.translate(-cameraX, -cameraY);

        // Draw Map
        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                const px = x * ACTUAL_TILE_SIZE;
                const py = y * ACTUAL_TILE_SIZE;

                // Visibility culling
                if (px + ACTUAL_TILE_SIZE < cameraX || px > cameraX + viewWidth || py + ACTUAL_TILE_SIZE < cameraY || py > cameraY + viewHeight) continue;

                const tile = this.mapData[y][x];
                if (MapScene.tileset && MapScene.tileset.complete) {
                    const sx = (tile % 3) * 32;
                    const sy = Math.floor(tile / 3) * 32;
                    ctx.drawImage(MapScene.tileset, sx, sy, 32, 32, px, py, ACTUAL_TILE_SIZE, ACTUAL_TILE_SIZE);
                } else {
                    ctx.fillStyle = tile === TILE_DATA.WALL ? '#444' : '#228B22';
                    ctx.fillRect(px, py, ACTUAL_TILE_SIZE, ACTUAL_TILE_SIZE);
                }
            }
        }

        // Draw Chests
        this.chests.forEach(c => {
            if (c.opened) return;
            const px = c.x * ACTUAL_TILE_SIZE;
            const py = c.y * ACTUAL_TILE_SIZE;
            if (MapScene.tileset && MapScene.tileset.complete) {
                // Chest index 5
                ctx.drawImage(MapScene.tileset, 64, 32, 32, 32, px, py, ACTUAL_TILE_SIZE, ACTUAL_TILE_SIZE);
            }
        });

        // Draw NPCs
        this.npcs.forEach(n => {
            const px = n.x * ACTUAL_TILE_SIZE;
            const py = n.y * ACTUAL_TILE_SIZE;
            if (MapScene.tileset && MapScene.tileset.complete) {
                // NPC index 6
                ctx.drawImage(MapScene.tileset, 0, 64, 32, 32, px, py, ACTUAL_TILE_SIZE, ACTUAL_TILE_SIZE);
            }
        });

        // Draw Players/Enemies
        this.enemies.forEach(e => {
            const px = e.x * ACTUAL_TILE_SIZE;
            const py = e.y * ACTUAL_TILE_SIZE;
            if (MapScene.enemySheet && MapScene.enemySheet.complete) {
                const types = ['SLIME', 'BAT', 'LION', 'TIGER', 'DOG'];
                const idx = types.indexOf(e.type);
                const sx = (idx % 3) * 32;
                const sy = Math.floor(idx / 3) * 32;
                ctx.drawImage(MapScene.enemySheet, sx, sy, 32, 32, px, py, ACTUAL_TILE_SIZE, ACTUAL_TILE_SIZE);
            }
        });

        const ppx = this.playerPos.x * ACTUAL_TILE_SIZE;
        const ppy = this.playerPos.y * ACTUAL_TILE_SIZE;
        if (MapScene.partySheet && MapScene.partySheet.complete) {
            ctx.drawImage(MapScene.partySheet, 0, 0, 32, 32, ppx, ppy, ACTUAL_TILE_SIZE, ACTUAL_TILE_SIZE);
        }

        ctx.restore();

        // UI
        ctx.fillStyle = 'white';
        ctx.font = '16px monospace';
        ctx.fillText(`World Map: ${this.playerPos.x},${this.playerPos.y}`, 10, viewHeight - 20);
    }
}
