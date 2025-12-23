
import React, { useState } from 'react';
import Home from './components/Home';
import Visualizer from './components/Visualizer';
import Editor from './components/Editor';
import Login from './components/Login';
import Modal from './components/Modal'; 
import { Tactic, ThemeConfig } from './types';
import { defaultTheme } from './data/themes';
import { UIProvider } from './context/UIContext';

const AppContent: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<'home' | 'visualizer' | 'editor'>('home');
  const [activeTactic, setActiveTactic] = useState<Tactic | null>(null);
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(defaultTheme);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSelectTactic = (tactic: Tactic) => {
    setActiveTactic(tactic);
    setView('visualizer');
  };

  const handleBack = () => {
    setActiveTactic(null);
    setView('home');
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col items-center">
      <Modal />
      
      {view === 'home' && (
        <Home 
          onSelectTactic={handleSelectTactic} 
          isAdmin={isAdmin}
          onToggleAdmin={() => setIsAdmin(!isAdmin)}
          onOpenEditor={() => setView('editor')}
        />
      )}
      
      {view === 'visualizer' && activeTactic && (
        <Visualizer 
          tactic={activeTactic} 
          theme={activeTheme}
          onBack={handleBack} 
          isAdmin={isAdmin}
        />
      )}

      {view === 'editor' && (
          <Editor 
            onBack={handleBack}
            theme={activeTheme}
          />
      )}

      {/* Footer */}
      {view !== 'editor' && (
        <footer className="w-full py-6 text-center text-slate-400 text-xs border-t border-slate-200 mt-auto">
            <p>VolleyViz Pro Beta &bull; Powered by React & Framer Motion</p>
        </footer>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <UIProvider>
    <AppContent />
  </UIProvider>
);

export default App;
