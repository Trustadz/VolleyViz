
import React, { useState } from 'react';
import RosterPanel from './panels/RosterPanel';
import StepLogicPanel from './panels/StepLogicPanel';
import { useEditorContext } from '../context/EditorContext';

const EditorSidebar: React.FC = () => {
    const { state, dispatch, activeStep } = useEditorContext();
    const [tab, setTab] = useState<'setup' | 'logic'>('setup');
    const tactic = state.model!;

    if (!activeStep) return null;

    return (
        <div className="w-full md:w-80 bg-white border-r flex flex-col z-20 shadow-2xl overflow-hidden shrink-0">
            <div className="flex border-b bg-slate-50">
                <button onClick={() => setTab('setup')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${tab === 'setup' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-400 hover:bg-slate-100'}`}>Roster</button>
                <button onClick={() => setTab('logic')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${tab === 'logic' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-400 hover:bg-slate-100'}`}>Step Logic</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
                {tab === 'setup' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="mb-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Global Description</label>
                            <textarea className="w-full p-4 border border-slate-200 rounded-2xl text-xs bg-slate-50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all min-h-[100px]" value={tactic.description} onChange={(e) => dispatch({ type: 'UPDATE_METADATA', payload: { description: e.target.value } })} />
                        </div>
                        <RosterPanel />
                    </div>
                )}
                
                {tab === 'logic' && (
                    <StepLogicPanel />
                )}
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default EditorSidebar;
