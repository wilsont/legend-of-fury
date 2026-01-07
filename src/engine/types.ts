export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
    x: number;
    y: number;
}

export interface CharacterStats {
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    strength: number;
    defense: number;
    speed: number; // Important for ATB/Turn order
    level: number;
    exp: number;
}

export interface Character {
    id: string;
    name: string;
    stats: CharacterStats;
    spriteColor: string; // Placeholder for asset
}

export interface Enemy extends Character {
    xpReward: number;
}

export type GameState = 'MAP' | 'BATTLE' | 'MENU';

export interface MagicSpell {
    id: string;
    name: string;
    mpCost: number;
    power: number;
    element: 'FIRE' | 'ICE' | 'STORM' | 'LIGHTNING';
    requiredLevel: number;
}

export interface Item {
    id: string;
    name: string;
    description: string;
    quantity: number;
}
