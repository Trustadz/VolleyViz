
import React, { useState, useRef } from 'react';
import { ThemeConfig } from '../types';
import Visualizer from './Visualizer'; 
import EditorHeader from './EditorHeader';
import EditorSidebar from './EditorSidebar';
import EditorCanvas from './EditorCanvas';
import { EditorProvider, useEditorContext, defaultTemplate } from '../context/EditorContext';
import { FileService } from '../services/FileService';
import { useLibrary } from '../hooks/useLibrary';
import { useUI } from '../context/UIContext';

interface EditorProps {
  onBack: () => void;
  theme: ThemeConfig;
}

// Inner Component to consume context
const EditorContent: React.FC<{ onBack: () => void; theme: ThemeConfig }> = ({ onBack, theme }) => {
    const { state, dispatch, activeStep } = useEditorContext();
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const { tactics: libraryTactics } = useLibrary();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { alert } = useUI();

    const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; 
        if (!file) return;
        try {
            const tactic = await FileService.importTacticFromJson(file);
            dispatch({ type: 'INIT_TACTIC', payload: tactic });
        } catch (err) {
            alert("Invalid Play File");
        }
        e.target.value = '';
    };

    const styleVars = {
        '--player-color-primary': theme.primary,
        '--player-color-opponent': theme.away,
        '--player-color-accent': theme.accent,
        '--court-bg': theme.courtBg,
        '--court-lines': theme.courtLines,
    } as React.CSSProperties;

    // --- Loading / Empty State ---
    if (!state.model) {
        return (
            <div className="w-full min-h-screen bg-slate-100 flex items-center justify-center p-6">
                <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl p-12 text-center space-y-10 animate-in zoom-in-95 duration-500">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600 rounded-3xl shadow-xl mb-4 text-white font-black text-4xl">V</div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase">Tactic Architect</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <button onClick={() => dispatch({ type: 'INIT_TACTIC', payload: { ...defaultTemplate, id: `t-${Date.now()}` } })} className="p-8 bg-blue-50 border-2 border-blue-100 hover:border-blue-500 rounded-3xl text-left transition-all">
                            <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">Start Blank</h3>
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="p-8 bg-slate-50 border-2 border-slate-100 hover:border-blue-500 rounded-3xl text-left transition-all">
                            <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">Import JSON</h3>
                            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImportJson} />
                        </button>
                    </div>
                    <div className="pt-10 border-t border-slate-100 overflow-x-auto">
                        <div className="flex gap-3 pb-2">
                            {libraryTactics.map(t => (
                                <button key={t.id} onClick={() => dispatch({ type: 'INIT_TACTIC', payload: JSON.parse(JSON.stringify(t)) })} className="px-4 py-3 text-[10px] font-black uppercase tracking-widest bg-white border border-slate-200 rounded-xl hover:border-blue-400 whitespace-nowrap transition-all">
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={onBack} className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600">Back</button>
                </div>
            </div>
        );
    }

    if (isPreviewMode) {
        return (
            <div className="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto overflow-x-hidden">
                <div className="p-4 bg-slate-900 flex justify-between items-center text-white shrink-0 sticky top-0 z-50 shadow-md">
                    <span className="font-black uppercase tracking-widest text-sm">Preview: {state.model.name}</span>
                    <button onClick={() => setIsPreviewMode(false)} className="px-6 py-2 bg-white text-slate-900 rounded-full font-black text-xs uppercase tracking-widest">Exit</button>
                </div>
                <Visualizer tactic={state.model.toJSON()} theme={theme} onBack={() => setIsPreviewMode(false)} isAdmin={true} />
            </div>
        );
    }

    if (!activeStep) return <div className="w-full h-screen bg-slate-900 flex items-center justify-center text-white font-black">INITIALIZING...</div>;

    return (
        <div className="w-full h-screen bg-slate-100 flex flex-col overflow-hidden" style={styleVars}>
            <EditorHeader onExit={() => dispatch({ type: 'INIT_TACTIC', payload: null })} onPreview={() => setIsPreviewMode(true)} />

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                <EditorSidebar />
                <EditorCanvas />
            </div>
        </div>
    );
};

// Main Export wrapping with Provider
const Editor: React.FC<EditorProps> = (props) => (
    <EditorProvider>
        <EditorContent {...props} />
    </EditorProvider>
);

export default Editor;
