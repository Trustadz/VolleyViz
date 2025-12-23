
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Tactic, Coordinate, Step, Zone } from '../types';
import { TacticModel } from '../models/TacticModel';
import { sanitizeTactic } from '../utils/dataMigration';

// --- Events (Actions) ---
export type EditorAction = 
    | { type: 'INIT_TACTIC'; payload: Tactic | null }
    | { type: 'UPDATE_METADATA'; payload: { name?: string; description?: string } }
    | { type: 'SELECT_STEP'; payload: string }
    | { type: 'ADD_PLAYER'; payload: { id: string; name: string; team: 'home' | 'away' } }
    | { type: 'RENAME_PLAYER'; payload: { oldId: string; newId: string; newName: string } }
    | { type: 'CHANGE_TEAM'; payload: { id: string; team: 'home' | 'away' } }
    | { type: 'REMOVE_PLAYER'; payload: string }
    | { type: 'ADD_STEP'; }
    | { type: 'REMOVE_STEP'; }
    | { type: 'UPDATE_STEP'; payload: Partial<Step> }
    | { type: 'MOVE_PLAYER'; payload: { id: string; pos: Coordinate } }
    | { type: 'MOVE_BALL'; payload: { id: string; pos: Coordinate } }
    | { type: 'SELECT_ELEMENT'; payload: { type: 'player' | 'zone'; id: string } | null }
    | { type: 'ADD_ZONE'; }
    | { type: 'REMOVE_ZONE'; payload: string }
    | { type: 'UPDATE_ZONE'; payload: { id: string; updates: Partial<Zone> } };

// --- State Shape ---
interface EditorState {
    model: TacticModel | null;
    activeStepId: string;
    selectedElement: { type: 'player' | 'zone'; id: string } | null;
}

// --- Reducer (The Brain) ---
const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
    if (action.type === 'INIT_TACTIC') {
        if (!action.payload) return { model: null, activeStepId: '', selectedElement: null };
        const sanitized = sanitizeTactic(action.payload);
        return {
            model: new TacticModel(sanitized),
            activeStepId: sanitized.steps[0]?.id || '',
            selectedElement: null
        };
    }

    if (!state.model) return state;

    try {
        switch (action.type) {
            case 'UPDATE_METADATA':
                return { ...state, model: state.model.updateMetadata(action.payload) };

            case 'SELECT_STEP':
                return { ...state, activeStepId: action.payload };

            case 'ADD_PLAYER':
                return { ...state, model: state.model.addPlayer(action.payload.id, action.payload.name, action.payload.team) };

            case 'RENAME_PLAYER':
                return { 
                    ...state, 
                    model: state.model.renamePlayer(action.payload.oldId, action.payload.newId, action.payload.newName),
                    selectedElement: state.selectedElement?.id === action.payload.oldId ? null : state.selectedElement
                };

            case 'CHANGE_TEAM':
                return { ...state, model: state.model.setPlayerTeam(action.payload.id, action.payload.team) };

            case 'REMOVE_PLAYER':
                return { 
                    ...state, 
                    model: state.model.removePlayer(action.payload),
                    selectedElement: state.selectedElement?.id === action.payload ? null : state.selectedElement
                };

            case 'ADD_STEP':
                const { model, newStepId } = state.model.addStep(state.activeStepId);
                return { ...state, model, activeStepId: newStepId };

            case 'REMOVE_STEP':
                const rmResult = state.model.removeStep(state.activeStepId);
                return { ...state, model: rmResult.model, activeStepId: rmResult.newActiveId };

            case 'UPDATE_STEP':
                return { ...state, model: state.model.updateStep(state.activeStepId, action.payload) };

            case 'MOVE_PLAYER':
                return { ...state, model: state.model.movePlayer(state.activeStepId, action.payload.id, action.payload.pos) };
            
            case 'MOVE_BALL':
                return { ...state, model: state.model.moveBall(state.activeStepId, action.payload.id, action.payload.pos) };

            case 'ADD_ZONE':
                return { ...state, model: state.model.addZone(state.activeStepId) };

            case 'REMOVE_ZONE':
                return { 
                    ...state, 
                    model: state.model.removeZone(state.activeStepId, action.payload),
                    selectedElement: state.selectedElement?.id === action.payload ? null : state.selectedElement
                };

            case 'UPDATE_ZONE':
                return { ...state, model: state.model.updateZone(state.activeStepId, action.payload.id, action.payload.updates) };

            case 'SELECT_ELEMENT':
                return { ...state, selectedElement: action.payload };

            default:
                return state;
        }
    } catch (error) {
        console.error("Action Failed:", error);
        alert(error instanceof Error ? error.message : "An error occurred");
        return state;
    }
};

// --- Context ---
const EditorContext = createContext<{
    state: EditorState;
    dispatch: React.Dispatch<EditorAction>;
    activeStep: Step | undefined;
} | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(editorReducer, {
        model: null,
        activeStepId: '',
        selectedElement: null
    });

    const activeStep = state.model?.steps.find(s => s.id === state.activeStepId);

    return (
        <EditorContext.Provider value={{ state, dispatch, activeStep }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditorContext = () => {
    const context = useContext(EditorContext);
    if (!context) throw new Error("useEditorContext must be used within EditorProvider");
    return context;
};

export const defaultTemplate: Tactic = {
    id: 'new', category: "Custom", name: "New Tactic", description: "Notes...",
    players: [{ id: 'S', name: 'S', team: 'home' }],
    steps: [{ id: "step-1", label: "Setup", positions: { "S": { x: 50, y: 50 } }, balls: [{ id: "BALL", position: { x: 50, y: 10 } }], zones: [] }]
};
