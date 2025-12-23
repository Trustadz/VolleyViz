
import React, { useMemo, useState } from 'react';
import Court from './Court';
import Controls from './Controls';
import { Tactic, ThemeConfig } from '../types';
import { TacticModel } from '../models/TacticModel';
import { usePlaybackEngine } from '../hooks/usePlaybackEngine';

interface VisualizerProps {
  tactic: Tactic;
  theme: ThemeConfig;
  onBack: () => void;
  isAdmin: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ tactic: initialTacticData, theme, onBack, isAdmin }) => {
  // Wrap data in Model for convenient helper access
  const model = useMemo(() => new TacticModel(initialTacticData), [initialTacticData]);
  const [animationSpeed, setAnimationSpeed] = useState(2000); 

  const { state, currentStep, nextStep, actions } = usePlaybackEngine(model, animationSpeed);

  if (!currentStep) return <div className="p-10 text-center font-bold text-red-500">Error: Step Data Missing</div>;

  const visualizerStyle = {
    '--player-color-primary': theme.primary,
    '--player-color-opponent': theme.away,
    '--player-color-text': theme.secondary,
    '--player-color-accent': theme.accent,
    '--court-bg': theme.courtBg,
    '--court-lines': theme.courtLines,
  } as React.CSSProperties;

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-500 pb-32" style={visualizerStyle}>
      {isAdmin && (
        <div className="w-full bg-amber-500 text-white text-[10px] font-extrabold text-center py-1 uppercase tracking-[0.2em] shadow-md z-50">
          Admin View: Interactive Overlays
        </div>
      )}

      <div className="w-full max-w-4xl flex items-center justify-between mt-4 mb-4 px-4">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors font-bold text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1"><path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" /></svg>
          Library
        </button>
        <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">{model.name}</h2>
        <div className="w-16"></div> 
      </div>

      <div className="w-full max-w-md px-6 text-center mb-6">
        <h3 className="text-2xl font-black text-slate-900 mb-1 leading-tight">{currentStep.label}</h3>
        {currentStep.description && (
          <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 shadow-sm mt-2">
            <p className="text-slate-600 text-sm font-medium italic">"{currentStep.description}"</p>
          </div>
        )}
      </div>

      <div className="relative w-full px-4 overflow-visible">
        <Court 
          system={{ ...model.toJSON(), players: model.players }} 
          currentStep={currentStep} 
          nextStep={nextStep}
          animationSpeed={animationSpeed}
          showZones={state.showZones}
          showArrows={state.showArrows}
          onCourtClick={actions.interact}
          isAdmin={isAdmin}
        />
        <div className={`absolute inset-0 pointer-events-none bg-red-500 mix-blend-overlay transition-opacity duration-300 ${state.flashError ? 'opacity-40' : 'opacity-0'}`} />
      </div>
      
      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <Controls 
            historyLength={state.history.length}
            isPlaying={state.isPlaying}
            onPrev={actions.prev}
            onNext={actions.next}
            onTogglePlay={actions.togglePlay}
            animationSpeed={animationSpeed}
            setAnimationSpeed={setAnimationSpeed}
            showZones={state.showZones}
            setShowZones={actions.setZones}
            showArrows={state.showArrows}
            setShowArrows={actions.setArrows}
            hasNextStep={!!nextStep}
            hasZones={!!currentStep.zones && currentStep.zones.length > 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
