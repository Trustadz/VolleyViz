import React, { useState } from 'react';
import { animationSpeedToPercent, percentToAnimationSpeed } from '../utils/formatters';

// Icons
const IconPrev = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" /></svg>;
const IconNext = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" /></svg>;
const IconPlay = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>;
const IconPause = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" /></svg>;
const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.922-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" /></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>;

interface ControlsProps {
  historyLength: number;
  isPlaying: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  
  showZones: boolean;
  setShowZones: (v: boolean) => void;
  showArrows: boolean;
  setShowArrows: (v: boolean) => void;
  hasNextStep: boolean; 
  hasZones: boolean; 
}

const Controls: React.FC<ControlsProps> = ({ 
  historyLength,
  isPlaying, 
  onPrev, 
  onNext, 
  onTogglePlay,
  animationSpeed,
  setAnimationSpeed,
  showZones,
  setShowZones,
  showArrows,
  setShowArrows,
  hasNextStep,
  hasZones,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const sliderPercent = animationSpeedToPercent(animationSpeed);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = parseInt(e.target.value, 10);
    const newSpeed = percentToAnimationSpeed(percent);
    setAnimationSpeed(newSpeed);
  };

  return (
    <div className="relative flex flex-col items-center">
      
      {/* Settings Menu Popover */}
      {isSettingsOpen && (
        <div className="absolute bottom-full mb-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-5 zoom-in-95 duration-200 origin-bottom">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Display & Speed</h4>
            
            <div className="mb-4">
               <div className="flex justify-between text-sm font-medium text-slate-600 mb-1">
                 <span>Speed</span>
                 <span className="text-blue-500 font-mono">{(animationSpeed/1000).toFixed(1)}s</span>
               </div>
               <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="1"
                  value={sliderPercent}
                  onChange={handleSliderChange}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
            </div>

            <div className="space-y-1">
                <button 
                  onClick={() => setShowZones(!showZones)}
                  disabled={!hasZones}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm transition-all border ${
                      hasZones 
                        ? showZones ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-transparent hover:bg-slate-50 text-slate-600'
                        : 'opacity-40 border-transparent cursor-not-allowed text-slate-400'
                  }`}
                >
                    <span className="font-medium">Defensive Zones</span>
                    {showZones && hasZones && <IconCheck />}
                </button>

                <button 
                  onClick={() => setShowArrows(!showArrows)}
                  disabled={!hasNextStep}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm transition-all border ${
                      hasNextStep 
                        ? showArrows ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-transparent hover:bg-slate-50 text-slate-600'
                        : 'opacity-40 border-transparent cursor-not-allowed text-slate-400'
                  }`}
                >
                    <span className="font-medium">Movement Arrows</span>
                    {showArrows && hasNextStep && <IconCheck />}
                </button>
            </div>
        </div>
      )}

      {/* Main Floating Control Bar */}
      <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-2 py-1.5 rounded-full shadow-2xl border border-white/10 ring-1 ring-black/5">
        
        <div className="flex items-center gap-1">
          <button 
            onClick={onPrev}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            disabled={historyLength === 0}
          >
            <IconPrev />
          </button>

          <button 
            onClick={onTogglePlay}
            disabled={!hasNextStep}
            className={`p-2 rounded-full transition-colors shadow-lg active:scale-95 ${hasNextStep ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
          >
            {isPlaying ? <IconPause /> : <IconPlay />}
          </button>

          <button 
            onClick={onNext}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            disabled={!hasNextStep}
          >
            <IconNext />
          </button>
        </div>

        <div className="w-px h-5 bg-slate-700/50 mx-1"></div>

        {/* Dynamic History Indicators */}
        <div className="flex items-center space-x-1 px-1">
          {Array.from({ length: historyLength }).map((_, idx) => (
            <div key={idx} className="w-1.5 h-1.5 rounded-full bg-slate-500/50" />
          ))}
          <div className="w-6 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all" />
        </div>

        <div className="w-px h-5 bg-slate-700/50 mx-1"></div>

        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`p-2.5 rounded-full transition-all ${
            isSettingsOpen 
              ? 'bg-white text-slate-900 shadow-md' 
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <IconSettings />
        </button>
      </div>

    </div>
  );
};

export default Controls;
