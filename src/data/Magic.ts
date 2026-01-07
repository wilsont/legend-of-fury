import type { MagicSpell } from '../engine/types';

export const MAGIC_SPELLS: MagicSpell[] = [
    // FIRE
    { id: 'fire_1', name: 'Fire I', mpCost: 5, power: 15, element: 'FIRE', requiredLevel: 1 },
    { id: 'fire_2', name: 'Fire II', mpCost: 15, power: 45, element: 'FIRE', requiredLevel: 5 },
    { id: 'fire_3', name: 'Fire III', mpCost: 30, power: 100, element: 'FIRE', requiredLevel: 10 },

    // ICE
    { id: 'ice_1', name: 'Ice I', mpCost: 5, power: 15, element: 'ICE', requiredLevel: 1 },
    { id: 'ice_2', name: 'Ice II', mpCost: 15, power: 45, element: 'ICE', requiredLevel: 5 },
    { id: 'ice_3', name: 'Ice III', mpCost: 30, power: 100, element: 'ICE', requiredLevel: 10 },

    // STORM
    { id: 'storm_1', name: 'Storm I', mpCost: 5, power: 15, element: 'STORM', requiredLevel: 1 },
    { id: 'storm_2', name: 'Storm II', mpCost: 15, power: 45, element: 'STORM', requiredLevel: 5 },
    { id: 'storm_3', name: 'Storm III', mpCost: 30, power: 100, element: 'STORM', requiredLevel: 10 },

    // LIGHTNING
    { id: 'lightning_1', name: 'Lightning I', mpCost: 5, power: 15, element: 'LIGHTNING', requiredLevel: 1 },
    { id: 'lightning_2', name: 'Lightning II', mpCost: 15, power: 45, element: 'LIGHTNING', requiredLevel: 5 },
    { id: 'lightning_3', name: 'Lightning III', mpCost: 30, power: 100, element: 'LIGHTNING', requiredLevel: 10 },
];
