
import React from 'react';
import { useEditorContext } from '../../context/EditorContext';
import { useUI } from '../../context/UIContext';

const StepLogicPanel: React.FC = () => {
    const { state, dispatch, activeStep } = useEditorContext();
    const { confirm } = useUI();
    const tactic = state.model!;
    const selectedZoneId = state.selectedElement?.type === 'zone' ? state.selectedElement.id : undefined;

    if (!activeStep) return null;

    const onUpdateStep = (updates: any) => dispatch({ type: 'UPDATE_STEP', payload: updates });

    const handleDeleteStep = async () => {
        if (tactic.steps.length <= 1) return;
        if (await confirm("Are you sure you want to delete this step? This cannot be undone.")) {
            dispatch({ type: 'REMOVE_STEP' });
        }
    };

    const handleRemoveZone = async (e: React.MouseEvent, zoneId: string) => {
        e.stopPropagation();
        if (await confirm("Delete this zone?")) {
            dispatch({ type: 'REMOVE_ZONE', payload: zoneId });
        }
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 pb-10">
            <div className="space-y-4">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Step Label</label>
                    <input className="w-full p-3 border border-slate-200 rounded-xl text-xs font-black uppercase bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all" value={activeStep.label} onChange={(e) => onUpdateStep({ label: e.target.value })} />
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Coach's Notes</label>
                    <textarea className="w-full p-4 border border-slate-200 rounded-xl text-xs bg-slate-50 min-h-[80px] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all" value={activeStep.description || ''} onChange={(e) => onUpdateStep({ description: e.target.value })} placeholder="Describe this phase..." />
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Default Flow (Next Step)</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase outline-none focus:border-blue-500" value={activeStep.defaultNextStepId || ''} onChange={(e) => onUpdateStep({ defaultNextStepId: e.target.value || undefined })}>
                        <option value="">End play</option>
                        {tactic.steps.map(s => s.id !== activeStep.id && <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                </div>
            </div>

            <hr className="border-slate-100" />

            <div>
                <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Decision Zones</label>
                    <button onClick={() => dispatch({ type: 'ADD_ZONE' })} className="text-[10px] font-black text-blue-600 hover:text-blue-500 tracking-widest hover:bg-blue-50 px-2 py-1 rounded">+ New Zone</button>
                </div>
                <div className="space-y-4">
                    {(activeStep.zones || []).map((zone, idx) => (
                        <div key={zone.id} onClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: { type: 'zone', id: zone.id } })} className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedZoneId === zone.id ? 'bg-blue-50 border-blue-300 ring-4 ring-blue-500/5 shadow-inner' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Zone {idx + 1} Logic</span>
                                <button onClick={(e) => handleRemoveZone(e, zone.id)} className="text-slate-300 hover:text-red-500 transition-colors font-bold px-2">✕</button>
                            </div>
                            <div className="space-y-3">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Color Style:</span>
                                    <select 
                                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase outline-none focus:border-blue-500" 
                                        value={zone.color || ""} 
                                        onChange={(e) => dispatch({ type: 'UPDATE_ZONE', payload: { id: zone.id, updates: { color: e.target.value } } })}
                                    >
                                        <option value="">Hidden (Interactive Only)</option>
                                        <option value="rgba(59, 130, 246, 0.2)">Blue (Default)</option>
                                        <option value="rgba(239, 68, 68, 0.2)">Red (Danger)</option>
                                        <option value="rgba(34, 197, 94, 0.2)">Green (Safe)</option>
                                        <option value="rgba(249, 115, 22, 0.2)">Orange (Focus)</option>
                                        <option value="rgba(168, 85, 247, 0.2)">Purple</option>
                                        <option value="rgba(100, 116, 139, 0.2)">Gray</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Branch to Step:</span>
                                    <select className="w-full p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase outline-none focus:border-blue-500" value={zone.targetStepId || ''} onChange={(e) => dispatch({ type: 'UPDATE_ZONE', payload: { id: zone.id, updates: { targetStepId: e.target.value } } })}>
                                        <option value="">Stay here</option>
                                        {tactic.steps.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Assign Actor:</span>
                                    <select 
                                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase outline-none focus:border-blue-500 font-mono" 
                                        value={zone.responsiblePlayerId || ''} 
                                        onChange={(e) => dispatch({ type: 'UPDATE_ZONE', payload: { id: zone.id, updates: { responsiblePlayerId: e.target.value } } })}
                                    >
                                        <option value="">-- No Actor --</option>
                                        {tactic.players.map(p => {
                                            const icon = p.team === 'home' ? '🔵' : '🔴';
                                            return <option key={p.id} value={p.id}>{icon} {p.name}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
                <button 
                    onClick={handleDeleteStep}
                    disabled={tactic.steps.length <= 1}
                    className="w-full py-3 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" /></svg>
                   Delete This Step
                </button>
            </div>
        </div>
    );
};

export default StepLogicPanel;
