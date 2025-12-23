
import React from 'react';
import { useEditorContext } from '../context/EditorContext';
import { FileService } from '../services/FileService';

interface EditorHeaderProps {
    onExit: () => void;
    onPreview: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ onExit, onPreview }) => {
    const { state, dispatch } = useEditorContext();
    const tactic = state.model!;
    const activeIndex = tactic.getStepIndex(state.activeStepId);

    const handleStepNav = (dir: 'prev' | 'next') => {
        const targetIdx = dir === 'prev' ? activeIndex - 1 : activeIndex + 1;
        const targetStep = tactic.steps[targetIdx];
        if (targetStep) {
            dispatch({ type: 'SELECT_STEP', payload: targetStep.id });
        }
    };

    const handleExport = () => {
        FileService.exportTacticToJson(tactic.toJSON());
    };

    return (
        <div className="bg-slate-900 text-white px-6 py-3 shadow-xl z-30 flex flex-col md:flex-row gap-4 items-center justify-between shrink-0">
            <div className="flex items-center gap-6">
                <button onClick={onExit} className="text-slate-400 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2 group">
                   <span className="text-base group-hover:-translate-x-1 transition-transform">←</span> Exit Architect
                </button>
                <div className="h-6 w-px bg-slate-700 hidden md:block"></div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Play Name</span>
                    <input 
                        className="bg-transparent border-b border-slate-700 text-sm font-black px-0 outline-none w-48 placeholder-slate-500 focus:border-blue-500 transition-all uppercase tracking-tight" 
                        value={tactic.name} 
                        onChange={(e) => dispatch({ type: 'UPDATE_METADATA', payload: { name: e.target.value } })} 
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-2xl border border-slate-700 shadow-inner">
                 <div className="flex gap-1 pr-1 border-r border-slate-700 mr-1">
                    <button 
                        onClick={() => handleStepNav('prev')} 
                        disabled={activeIndex <= 0} 
                        className="w-10 h-10 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white rounded-xl disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                        ←
                    </button>
                    <button 
                        onClick={() => handleStepNav('next')} 
                        disabled={activeIndex >= tactic.steps.length - 1} 
                        className="w-10 h-10 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white rounded-xl disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                        →
                    </button>
                 </div>
                 <div className="flex flex-col px-3">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Sequence</span>
                    <select 
                        value={state.activeStepId} 
                        onChange={(e) => dispatch({ type: 'SELECT_STEP', payload: e.target.value })} 
                        className="bg-slate-600 text-white text-xs font-black uppercase outline-none cursor-pointer hover:text-blue-400 transition-colors focus:text-blue-500"
                    >
                        {tactic.steps.map((s, i) => <option key={s.id} value={s.id} className="bg-slate-800 text-white">{i + 1}. {s.label}</option>)}
                    </select>
                 </div>
                 <button onClick={() => dispatch({ type: 'ADD_STEP' })} className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-lg active:scale-95 transition-all ml-1">+</button>
            </div>

            <div className="flex gap-3">
                <button onClick={onPreview} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95">Preview</button>
                <button onClick={handleExport} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95">Export</button>
            </div>
        </div>
    );
};

export default EditorHeader;
