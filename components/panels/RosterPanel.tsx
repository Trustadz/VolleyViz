
import React, { useState, useEffect } from 'react';
import { useEditorContext } from '../../context/EditorContext';
import { useUI } from '../../context/UIContext';

// Inline Edit Input Component
const InlineEdit: React.FC<{ value: string; onSave: (val: string) => void }> = ({ value, onSave }) => {
    const [tempValue, setTempValue] = useState(value);
    
    // Sync state if prop changes (e.g. undo/redo)
    useEffect(() => {
        setTempValue(value);
    }, [value]);

    return (
        <input 
            className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 text-[10px] font-black text-slate-900 tracking-tight outline-none w-full transition-colors"
            value={tempValue}
            maxLength={4}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => { if(tempValue !== value) onSave(tempValue); }}
            onKeyDown={(e) => { if(e.key === 'Enter') e.currentTarget.blur(); }}
        />
    );
};

const RosterPanel: React.FC = () => {
    const { state, dispatch } = useEditorContext();
    const { confirm } = useUI();
    const tactic = state.model!;
    const selectedId = state.selectedElement?.id;

    const handleAutoCreate = () => {
        let counter = 1;
        let newId = `P${counter}`;
        while (tactic.players.find(p => p.id === newId)) {
            counter++;
            newId = `P${counter}`;
        }
        dispatch({ type: 'ADD_PLAYER', payload: { id: newId, name: newId, team: 'home' } });
    };

    const handleToggleTeam = (e: React.MouseEvent, id: string, currentTeam: string) => {
        e.stopPropagation();
        const newTeam = currentTeam === 'home' ? 'away' : 'home';
        dispatch({ type: 'CHANGE_TEAM', payload: { id, team: newTeam } });
    };

    // Architecture: 
    // View (RosterPanel) captures Intent -> Dispatches Action -> Model handles Logic
    const handleRemove = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation(); // Critical: prevent selecting the row while deleting
        
        if (await confirm(`Are you sure you want to delete player "${id}"? This will remove them from all steps.`)) {
            dispatch({ type: 'REMOVE_PLAYER', payload: id });
        }
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
            <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Roster Management</label>
                <button 
                    onClick={handleAutoCreate}
                    className="w-full py-3 mb-4 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all hover:bg-blue-500"
                >
                    + Add New Player
                </button>
                <div className="space-y-2">
                    {tactic.players.map(p => {
                        const color = p.team === 'away' ? 'var(--player-color-opponent)' : 'var(--player-color-primary)';
                        return (
                            <div key={p.id} className={`p-3 border rounded-2xl flex justify-between items-center group transition-all ${selectedId === p.id ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-200' : 'border-slate-100 bg-slate-50 hover:border-blue-200'}`}>
                                <div className="flex items-center gap-3 w-full cursor-pointer" onClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: { type: 'player', id: p.id } })}>
                                    <div 
                                        className="w-4 h-4 rounded-full shadow-sm border border-black/10 shrink-0" 
                                        style={{ backgroundColor: color }}
                                    ></div>
                                    <div className="flex flex-col w-full">
                                        <InlineEdit 
                                            value={p.name} 
                                            onSave={(newName) => dispatch({ type: 'RENAME_PLAYER', payload: { oldId: p.id, newId: p.id, newName: newName.trim() } })}
                                        />
                                        <span className="text-[8px] text-slate-400 font-bold uppercase">{p.id} • {p.team}</span>
                                    </div>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <button 
                                        onClick={(e) => handleToggleTeam(e, p.id, p.team)} 
                                        className="p-2 text-slate-400 hover:text-blue-600 border border-transparent hover:border-blue-200 rounded transition-all bg-white shadow-sm"
                                        title="Switch Team"
                                    >
                                        {/* Shuffle Icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                                            <polyline points="16 3 21 3 21 8"></polyline>
                                            <line x1="4" y1="20" x2="21" y2="3"></line>
                                            <polyline points="21 16 21 21 16 21"></polyline>
                                            <line x1="15" y1="15" x2="21" y2="21"></line>
                                            <line x1="4" y1="4" x2="9" y2="9"></line>
                                        </svg>
                                    </button>
                                    <button onClick={(e) => handleRemove(e, p.id)} className="p-2 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 transition-all" title="Delete">✕</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RosterPanel;
