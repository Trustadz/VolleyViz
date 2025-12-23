
import React, { useRef } from 'react';
import PlayerNode from './PlayerNode';
import BallNode from './BallNode';
import { Tactic, Step, Coordinate } from '../types';
import { screenToCanvas } from '../utils/coordinates';
import { toSVGPoints } from '../utils/formatters';

interface CourtProps {
  system: Pick<Tactic, 'players'>;
  currentStep: Step;
  nextStep?: Step;
  animationSpeed?: number;
  showZones?: boolean;
  showArrows?: boolean;
  onCourtClick: (coord: Coordinate) => void;
  isAdmin?: boolean;
  renderPlayers?: boolean;
  className?: string; // New prop for layout overrides
}

const Court: React.FC<CourtProps> = ({ 
  system, 
  currentStep, 
  nextStep,
  animationSpeed = 2000,
  showZones = false,
  showArrows = false,
  onCourtClick,
  isAdmin = false,
  renderPlayers = true,
  className, 
}) => {
  const courtRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (!courtRef.current) return;
    const pos = screenToCanvas(e.clientX, e.clientY, courtRef.current);
    onCourtClick(pos);
  };

  // Default visual style if no className provided (Visualizer mode)
  const containerClass = className || "relative w-full max-w-[450px] aspect-[1/2] mx-auto shadow-2xl rounded-sm border-4 border-slate-800";

  return (
    <div 
      ref={courtRef}
      onClick={handleClick}
      className={`${containerClass} overflow-hidden select-none cursor-crosshair`}
      style={{ backgroundColor: 'var(--court-bg)' }}>
      
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        {currentStep.zones?.map((zone, idx) => {
          let isVisible = isAdmin || (showZones && !!zone.color);
          if (!isVisible) return null;
          return (
            <polygon
              key={zone.id || idx}
              points={toSVGPoints(zone.points)}
              fill={zone.color || "rgba(100, 116, 139, 0.1)"} 
              stroke={zone.borderColor || zone.color || "rgba(100, 116, 139, 0.5)"}
              strokeWidth="0.5"
            />
          );
        })}
      </svg>

      {/* Court markings */}
      <div className="absolute inset-4 border-4 opacity-80" style={{ borderColor: 'var(--court-lines)' }}></div>
      {/* Center Line (50%) */}
      <div className="absolute top-1/2 left-4 right-4 h-1.5 -mt-0.5 z-10" style={{ backgroundColor: 'var(--court-lines)' }}></div>
      
      {/* 3m Attack Lines (33.3% and 66.6%) */}
      <div className="absolute left-4 right-4 h-1 z-0 opacity-60" style={{ top: '33.33%', backgroundColor: 'var(--court-lines)' }}></div>
      <div className="absolute left-4 right-4 h-1 z-0 opacity-60" style={{ top: '66.66%', backgroundColor: 'var(--court-lines)' }}></div>

      {/* 7m Depth Lines (Optional reference lines ~11.1% and 88.8% from baseline?) 
          Standard court is 9m half. 3m line is 3m from net.
          User requested 7m lines. Assuming 7m from net (2m from back).
          7m from net = 2m from back. 2/18 = 11.11% from top/bottom.
          Top: 50% - (7/18)*100% = 11.11%
          Bottom: 50% + (7/18)*100% = 88.88%
      */}
      <div className="absolute left-4 right-4 border-t-2 border-dashed z-0 opacity-60" style={{ top: '11.11%', borderColor: 'var(--court-lines)' }}></div>
      <div className="absolute left-4 right-4 border-t-2 border-dashed z-0 opacity-60" style={{ top: '88.88%', borderColor: 'var(--court-lines)' }}></div>

      {renderPlayers && (
        <div className="absolute inset-0 pointer-events-none"> 
          {/* Render Players */}
          {system.players.map((p) => {
            if (!currentStep.positions[p.id]) return null;
            return (
              <PlayerNode 
                key={p.id} 
                id={p.id}
                name={p.name}
                team={p.team} 
                position={currentStep.positions[p.id]} 
                animationSpeed={animationSpeed}
              />
            );
          })}

          {/* Render Balls */}
          {(currentStep.balls || []).map(ball => (
              <BallNode key={ball.id} position={ball.position} animationSpeed={animationSpeed} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Court;
