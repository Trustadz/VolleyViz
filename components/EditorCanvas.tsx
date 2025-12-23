
import React, { useRef } from 'react';
import Court from './Court';
import EditorPlayer from './EditorPlayer';
import EditorBall from './EditorBall';
import EditorZone from './EditorZone';
import { PlayerConfig } from '../types';
import { useEditorContext } from '../context/EditorContext';

const EditorCanvas: React.FC = () => {
    const { state, dispatch, activeStep } = useEditorContext();
    const courtRef = useRef<HTMLDivElement>(null);
    const tactic = state.model!;
    const selectedId = state.selectedElement?.id;
    const selectedType = state.selectedElement?.type;

    if (!activeStep) return null;

    // Determine if we need to highlight a player because their zone is selected
    let highlightedPlayerId: string | undefined = undefined;
    if (selectedType === 'zone') {
        const zone = activeStep.zones?.find(z => z.id === selectedId);
        if (zone && zone.responsiblePlayerId) {
            highlightedPlayerId = zone.responsiblePlayerId;
        }
    }

    return (
        <div className="flex-1 bg-slate-200 relative overflow-auto flex justify-center p-8 custom-scrollbar group">
             {/* 
                Visual Container & Coordinate Source of Truth.
                IMPORTANT: We use a wrapper div with NO borders or margins to serve as the
                clean 0-100% coordinate system. The visual border is handled by the Court component inside.
             */}
            <div 
                ref={courtRef} 
                className="relative w-[450px] aspect-[1/2] shrink-0 my-auto" 
            >
                <Court 
                    system={tactic.toJSON()} 
                    currentStep={activeStep} 
                    onCourtClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: null })} // Deselect on background click
                    isAdmin={true} 
                    renderPlayers={false}
                    className="w-full h-full relative shadow-2xl bg-white border-4 border-slate-900 rounded-sm" // Styling applied here
                />
                
                {/* Editor Overlays - Positioned Absolute 0-100% relative to wrapper */}
                <div className="absolute inset-0 pointer-events-none z-[100]">
                    {/* Zones */}
                    {activeStep.zones?.map(zone => (
                        <EditorZone 
                            key={zone.id} 
                            zone={zone} 
                            isSelected={selectedId === zone.id} 
                            onSelect={() => dispatch({ type: 'SELECT_ELEMENT', payload: { type: 'zone', id: zone.id } })} 
                            onUpdate={(pts) => dispatch({ type: 'UPDATE_ZONE', payload: { id: zone.id, updates: { points: pts } } })} 
                            containerRef={courtRef} 
                        />
                    ))}

                    {/* Balls */}
                    {(activeStep.balls || []).map(ball => (
                        <EditorBall 
                            key={ball.id}
                            id={ball.id}
                            x={ball.position.x}
                            y={ball.position.y}
                            containerRef={courtRef}
                            onDragEnd={(pos) => dispatch({ type: 'MOVE_BALL', payload: { id: ball.id, pos } })}
                        />
                    ))}

                    {/* Players */}
                    {activeStep.positions && tactic.players.map((p: PlayerConfig) => {
                        if (!activeStep.positions[p.id]) return null;
                        
                        return (
                            <EditorPlayer 
                                key={`${p.id}-${activeStep.id}`} 
                                id={p.id}
                                name={p.name}
                                team={p.team} 
                                x={activeStep.positions[p.id].x} 
                                y={activeStep.positions[p.id].y} 
                                containerRef={courtRef} 
                                onDragEnd={(id, pos) => dispatch({ type: 'MOVE_PLAYER', payload: { id, pos } })} 
                                isSelected={selectedId === p.id} 
                                isHighlighted={highlightedPlayerId === p.id}
                                onSelect={(id) => dispatch({ type: 'SELECT_ELEMENT', payload: { type: 'player', id } })}
                            />
                        );
                    })}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.2); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default EditorCanvas;
