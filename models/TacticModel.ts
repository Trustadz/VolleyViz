
import { Tactic, PlayerConfig, Step, Coordinate, Zone, PlayerPositions, Ball } from '../types';
import { findClickedZone } from '../utils/geometry';

// Configuration Constants
const DEFAULT_ZONE_COLOR = "rgba(59, 130, 246, 0.2)"; // Blue-500 with opacity
const DEFAULT_ZONE_POINTS = [{ x: 30, y: 30 }, { x: 70, y: 30 }, { x: 70, y: 40 }, { x: 30, y: 40 }];

export class TacticModel {
    private readonly _data: Tactic;

    constructor(data: Tactic) {
        this._data = JSON.parse(JSON.stringify(data)); // Deep clone for safety
    }

    // --- Getters ---
    get id() { return this._data.id; }
    get name() { return this._data.name; }
    get description() { return this._data.description; }
    get players() { return this._data.players; }
    get steps() { return this._data.steps; }
    
    toJSON(): Tactic {
        return this._data;
    }

    getStep(stepId: string): Step | undefined {
        return this._data.steps.find(s => s.id === stepId);
    }

    getNextStep(currentStepId: string): Step | undefined {
        const current = this.getStep(currentStepId);
        if (!current?.defaultNextStepId) return undefined;
        return this.getStep(current.defaultNextStepId);
    }

    getStepIndex(stepId: string): number {
        return this._data.steps.findIndex(s => s.id === stepId);
    }

    getStepByIndex(index: number): Step | undefined {
        return this._data.steps[index];
    }

    // --- Simulation Logic (Game Rules) ---
    
    resolveInteraction(currentStepId: string, clickCoord: Coordinate): { 
        nextStepId?: string; 
        overrides: { positions: PlayerPositions, balls: Ball[] } | null; 
        isValid: boolean 
    } {
        const currentStep = this.getStep(currentStepId);
        if (!currentStep || !currentStep.zones) {
            return { nextStepId: undefined, overrides: null, isValid: false };
        }

        const clickedZone = findClickedZone(clickCoord, currentStep.zones);
        
        if (clickedZone && clickedZone.targetStepId) {
            const positions: PlayerPositions = {};
            // For now, simple interaction only overrides the MAIN ball (id: BALL)
            // If multiple balls exist, we'd need complex logic.
            // We assume 'BALL' is the primary interactive object for zones.
            const balls: Ball[] = [];
            
            // Rule: Main Ball moves to clicked location
            balls.push({ id: 'BALL', position: clickCoord });
            
            // Rule: Responsible player moves to clicked location
            if (clickedZone.responsiblePlayerId) {
                positions[clickedZone.responsiblePlayerId] = clickCoord;
            }

            return { 
                nextStepId: clickedZone.targetStepId, 
                overrides: { positions, balls }, 
                isValid: true 
            };
        }

        return { nextStepId: undefined, overrides: null, isValid: false };
    }

    // --- Domain Logic (Returns NEW Instance) ---

    updateMetadata(updates: Partial<Pick<Tactic, 'name' | 'description'>>): TacticModel {
        return new TacticModel({ ...this._data, ...updates });
    }

    addPlayer(id: string, name: string, team: 'home' | 'away'): TacticModel {
        if (this._data.players.find(p => p.id === id)) {
            throw new Error(`Player ID "${id}" already exists.`);
        }

        const newPlayer: PlayerConfig = { id, name, team };
        const newPlayers = [...this._data.players, newPlayer];

        const newSteps = this._data.steps.map(s => ({
            ...s,
            positions: { ...s.positions, [id]: { x: 50, y: 50 } }
        }));

        return new TacticModel({ ...this._data, players: newPlayers, steps: newSteps });
    }

    renamePlayer(oldId: string, newId: string, newName: string): TacticModel {
        if (newId !== oldId && this._data.players.find(p => p.id === newId)) {
            throw new Error(`Player ID "${newId}" already exists.`);
        }

        const newPlayers = this._data.players.map(p => 
            p.id === oldId ? { ...p, id: newId, name: newName } : p
        );

        const newSteps = this._data.steps.map(s => {
            const positions = { ...s.positions };
            if (positions[oldId]) {
                positions[newId] = positions[oldId];
                if (newId !== oldId) delete positions[oldId];
            }
            const zones = s.zones?.map(z => 
                z.responsiblePlayerId === oldId ? { ...z, responsiblePlayerId: newId } : z
            );
            return { ...s, positions, zones };
        });

        return new TacticModel({ ...this._data, players: newPlayers, steps: newSteps });
    }

    setPlayerTeam(id: string, team: 'home' | 'away'): TacticModel {
        const newPlayers = this._data.players.map(p => 
            p.id === id ? { ...p, team } : p
        );
        return new TacticModel({ ...this._data, players: newPlayers });
    }

    removePlayer(id: string): TacticModel {
        // 1. Remove from global player list (Sidebar)
        const newPlayers = this._data.players.filter(p => p.id !== id);
        
        // 2. Remove from all Steps (Court)
        const newSteps = this._data.steps.map(s => {
            // Clone positions to avoid mutation
            const positions = { ...s.positions };
            // Remove the coordinate for this player
            delete positions[id];
            
            // Also clean up any zones assigned to this player
            const zones = s.zones?.map(z => 
                z.responsiblePlayerId === id ? { ...z, responsiblePlayerId: undefined } : z
            );
            return { ...s, positions, zones };
        });

        return new TacticModel({ ...this._data, players: newPlayers, steps: newSteps });
    }

    addStep(afterStepId: string): { model: TacticModel, newStepId: string } {
        const index = this._data.steps.findIndex(s => s.id === afterStepId);
        if (index === -1) throw new Error("Current step not found");

        const currentStep = this._data.steps[index];
        const newId = `s-${Date.now()}`;
        
        const newStep: Step = {
            ...currentStep,
            id: newId,
            label: "New Phase",
            zones: []
        };

        const newSteps = [...this._data.steps];
        newSteps.splice(index + 1, 0, newStep);

        return { 
            model: new TacticModel({ ...this._data, steps: newSteps }),
            newStepId: newId
        };
    }

    removeStep(stepId: string): { model: TacticModel, newActiveId: string } {
        if (this._data.steps.length <= 1) {
            throw new Error("Cannot remove the last step.");
        }

        const index = this.getStepIndex(stepId);
        const newSteps = this._data.steps.filter(s => s.id !== stepId);
        
        // Calculate new active step (previous one, or first if at start)
        let newActiveIndex = index - 1;
        if (newActiveIndex < 0) newActiveIndex = 0;
        const newActiveId = newSteps[newActiveIndex].id;

        // Cleanup: Remove references to this step from other steps
        const cleanedSteps = newSteps.map(s => {
            let changes: Partial<Step> = {};
            if (s.defaultNextStepId === stepId) {
                changes.defaultNextStepId = undefined;
            }
            if (s.zones) {
                const newZones = s.zones.map(z => z.targetStepId === stepId ? { ...z, targetStepId: undefined } : z);
                changes.zones = newZones;
            }
            return { ...s, ...changes };
        });

        return {
            model: new TacticModel({ ...this._data, steps: cleanedSteps }),
            newActiveId
        };
    }

    updateStep(stepId: string, updates: Partial<Step>): TacticModel {
        const newSteps = this._data.steps.map(s => 
            s.id === stepId ? { ...s, ...updates } : s
        );
        return new TacticModel({ ...this._data, steps: newSteps });
    }

    movePlayer(stepId: string, playerId: string, pos: Coordinate): TacticModel {
        const newSteps = this._data.steps.map(s => 
            s.id === stepId ? { ...s, positions: { ...s.positions, [playerId]: pos } } : s
        );
        return new TacticModel({ ...this._data, steps: newSteps });
    }

    moveBall(stepId: string, ballId: string, pos: Coordinate): TacticModel {
        const newSteps = this._data.steps.map(s => {
            if (s.id !== stepId) return s;
            const newBalls = (s.balls || []).map(b => 
                b.id === ballId ? { ...b, position: pos } : b
            );
            // If ball doesn't exist (edge case), add it? 
            // Better to enforce existence, but for safety:
            if (!newBalls.find(b => b.id === ballId)) {
                newBalls.push({ id: ballId, position: pos });
            }
            return { ...s, balls: newBalls };
        });
        return new TacticModel({ ...this._data, steps: newSteps });
    }

    // --- Zone Logic ---

    addZone(stepId: string): TacticModel {
        const newZone: Zone = {
            id: `z-${Date.now()}`,
            points: [...DEFAULT_ZONE_POINTS], // Clone array
            color: DEFAULT_ZONE_COLOR
        };

        const newSteps = this._data.steps.map(s => {
            if (s.id !== stepId) return s;
            return { ...s, zones: [...(s.zones || []), newZone] };
        });

        return new TacticModel({ ...this._data, steps: newSteps });
    }

    removeZone(stepId: string, zoneId: string): TacticModel {
        const newSteps = this._data.steps.map(s => {
            if (s.id !== stepId) return s;
            return { ...s, zones: s.zones?.filter(z => z.id !== zoneId) || [] };
        });
        return new TacticModel({ ...this._data, steps: newSteps });
    }

    updateZone(stepId: string, zoneId: string, updates: Partial<Zone>): TacticModel {
        const newSteps = this._data.steps.map(s => {
            if (s.id !== stepId) return s;
            const newZones = s.zones?.map(z => 
                z.id === zoneId ? { ...z, ...updates } : z
            ) || [];
            return { ...s, zones: newZones };
        });
        return new TacticModel({ ...this._data, steps: newSteps });
    }
}
