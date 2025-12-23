import React, { useMemo } from 'react';
import { Tactic } from '../types';
import { useLibrary } from '../hooks/useLibrary';
import { LibraryService } from '../services/LibraryService';
import { getTacticBadge } from '../utils/formatters';

interface HomeProps {
  onSelectTactic: (tactic: Tactic) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onOpenEditor: () => void;
}

const Home: React.FC<HomeProps> = ({ onSelectTactic, isAdmin, onToggleAdmin, onOpenEditor }) => {
  const { tactics, loading } = useLibrary();

  // Use Service to aggregate data, Memoized to avoid recalc on every render
  const categories = useMemo(() => LibraryService.groupTacticsByCategory(tactics), [tactics]);

  if (loading) {
      return (
          <div className="w-full h-screen flex items-center justify-center text-slate-400">
              <div className="animate-pulse flex flex-col items-center">
                  <div className="h-4 w-4 bg-slate-400 rounded-full mb-2"></div>
                  Loading Tactics...
              </div>
          </div>
      );
  }

  return (
    <div className="w-full max-w-4xl p-6 relative">
       {/* Top Bar Actions */}
       <div className="absolute top-6 right-6 z-20 flex items-center gap-4">
         <button 
            onClick={onOpenEditor}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-full text-xs font-bold hover:bg-slate-700 shadow-sm transition-colors"
         >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 004.75 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
            Tactic Editor
         </button>

         <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline-block">Admin</span>
            <button 
            onClick={onToggleAdmin}
            className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${isAdmin ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
                <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${isAdmin ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
         </div>
       </div>

       {/* Hero / Header */}
       <div className="mb-10 text-center relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-10 text-white shadow-xl">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              Volley<span className="text-blue-400">Viz</span>
            </h1>
            <p className="text-slate-300 max-w-lg mx-auto text-lg">
              Interactive tactical board for coaches and players.
            </p>
          </div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
       </div>

       {/* Categories */}
       <div className="space-y-10">
         {Object.entries(categories).map(([category, items]) => {
           const tacticItems = items as Tactic[];
           return (
             <div key={category}>
               <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2 flex items-center">
                 {category}
                 <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{tacticItems.length}</span>
               </h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {tacticItems.map(tactic => (
                   <button
                     key={tactic.id}
                     onClick={() => onSelectTactic(tactic)}
                     className="group relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-400 transition-all text-left flex flex-col h-full"
                   >
                     <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                        </svg>
                     </div>
                     
                     <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-lg mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                       {getTacticBadge(tactic.name)}
                     </div>
  
                     <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                       {tactic.name}
                     </h3>
                     <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                       {tactic.description}
                     </p>
                   </button>
                 ))}
               </div>
             </div>
           );
         })}
       </div>
    </div>
  );
};

export default Home;