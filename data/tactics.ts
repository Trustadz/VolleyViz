
import { Tactic } from '../types';
import { sanitizeTactic } from '../utils/dataMigration';

// Import from TS files (modules) to avoid JSON import issues in different environments
import { sideout1 } from './tactics/sideout1';
import { sideout2 } from './tactics/sideout2';
import { sideout3 } from './tactics/sideout3';
import { defense1 } from './tactics/defense1';

// Placeholder generation for 4-6 to populate the list
const placeholders: Tactic[] = [4, 5, 6].map(num => ({
    id: `sideout-${num}`,
    category: 'Sideouts',
    name: `Sideout ${num} (Rot ${num})`,
    description: `Standard rotation ${num} setup (Placeholder).`,
    players: [
        { id: "S", name: "S", team: "home" },
        { id: "P1", name: "P1", team: "home" },
        { id: "P2", name: "P2", team: "home" },
        { id: "MID", name: "MID", team: "home" },
        { id: "DIA", name: "DIA", team: "home" },
        { id: "L", name: "L", team: "home" }
    ],
    steps: [
        {
            id: '1', 
            label: "Start", 
            positions: { "S": {x:50,y:50} },
            balls: [{ id: "BALL", position: { x: 50, y: 5 } }]
        }
    ]
}));

// Memoize cache
let cachedTactics: Tactic[] | null = null;

export const getTactics = async (): Promise<Tactic[]> => {
    if (cachedTactics) return cachedTactics;

    try {
        const rawFiles = [sideout1, sideout2, sideout3, defense1];
        
        // Filter out any undefined imports
        const validFiles = rawFiles.filter(t => !!t);

        const typedLoaded = validFiles.map(t => sanitizeTactic(t));

        cachedTactics = [
            ...typedLoaded,
            ...placeholders
        ];
        return cachedTactics;
    } catch (error) {
        console.error("Error processing tactics:", error);
        return placeholders;
    }
};

export const tactics: Tactic[] = [];
