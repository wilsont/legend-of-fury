import type { Enemy } from '../engine/types';

export const ENEMIES: Record<string, Enemy> = {
    SLIME: {
        id: 'slime',
        name: 'Slime',
        stats: {
            hp: 50,
            maxHp: 200,
            mp: 0,
            maxMp: 0,
            strength: 5,
            defense: 2,
            speed: 4,
            level: 1,
            exp: 100
        },
        spriteColor: '#00ff00',
        xpReward: 500
    },
    BAT: {
        id: 'bat',
        name: 'Bat',
        stats: {
            hp: 20,
            maxHp: 250,
            mp: 0,
            maxMp: 0,
            strength: 4,
            defense: 1,
            speed: 12,
            level: 1,
            exp: 100
        },
        spriteColor: '#9933ff',
        xpReward: 800
    },
    LION: {
        id: 'lion',
        name: 'Lion',
        stats: {
            hp: 30,
            maxHp: 500,
            mp: 0,
            maxMp: 0,
            strength: 15,
            defense: 5,
            speed: 9,
            level: 5,
            exp: 100
        },
        spriteColor: '#cc9900',
        xpReward: 250
    },
    TIGER: {
        id: 'tiger',
        name: 'Tiger',
        stats: {
            hp: 60,
            maxHp: 600,
            mp: 0,
            maxMp: 0,
            strength: 18,
            defense: 4,
            speed: 11,
            level: 6,
            exp: 0
        },
        spriteColor: '#ff9900',
        xpReward: 300
    },
    DOG: {
        id: 'dog',
        name: 'Dog',
        stats: {
            hp: 30,
            maxHp: 300,
            mp: 0,
            maxMp: 0,
            strength: 8,
            defense: 3,
            speed: 12,
            level: 3,
            exp: 100
        },
        spriteColor: '#996633',
        xpReward: 150
    }
};
