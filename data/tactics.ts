
import { Tactic } from '../types';
import { sanitizeTactic } from '../utils/dataMigration';

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

// List of JSON files to fetch at runtime
const tacticFiles = [
    './data/tactics/sideout1.json',
    './data/tactics/sideout2.json',
    './data/tactics/sideout3.json',
    './data/tactics/defense1.json'
];

let cachedTactics: Tactic[] | null = null;

// Async function to fetch tactics from JSON files
export const getTactics = async (): Promise<Tactic[]> => {
    if (cachedTactics) return cachedTactics;

    try {
        const promises = tacticFiles.map(url => fetch(url).then(res => {
            if (!res.ok) throw new Error(`Failed to load ${url}`);
            return res.json();
        }));
        
        const loaded = await Promise.all(promises);
        const typedLoaded = loaded.map(t => sanitizeTactic(t));

        cachedTactics = [
            ...typedLoaded,
            ...placeholders
        ];
        return cachedTactics;
    } catch (error) {
        console.error("Error loading tactics:", error);
        // Return placeholders if fetch fails (e.g. offline or file not found)
        return placeholders;
    }
};

export const tactics: Tactic[] = [];
