import type { Character } from '../engine/types';

export const PARTY: Character[] = [
    {
        id: 'lukas',
        name: 'Lukas',
        stats: {
            hp: 100,
            maxHp: 100,
            mp: 20,
            maxMp: 20,
            strength: 10,
            defense: 5,
            speed: 8,
            level: 1,
            exp: 0
        },
        spriteColor: '#3366cc' // Blue
    },
    {
        id: 'theodor',
        name: 'Theodor',
        stats: {
            hp: 120,
            maxHp: 120,
            mp: 10,
            maxMp: 10,
            strength: 12,
            defense: 8,
            speed: 5,
            level: 1,
            exp: 0
        },
        spriteColor: '#cc3333' // Red
    },
    {
        id: 'joy',
        name: 'Joy',
        stats: {
            hp: 80,
            maxHp: 80,
            mp: 50,
            maxMp: 50,
            strength: 6,
            defense: 4,
            speed: 10,
            level: 1,
            exp: 0
        },
        spriteColor: '#ff66cc' // Pink
    },
    {
        id: 'wilson',
        name: 'Wilson',
        stats: {
            hp: 90,
            maxHp: 90,
            mp: 30,
            maxMp: 30,
            strength: 9,
            defense: 6,
            speed: 7,
            level: 1,
            exp: 0
        },
        spriteColor: '#33cc66' // Green
    }
];
