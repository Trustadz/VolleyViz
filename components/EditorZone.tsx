import React from 'react';
import { Zone, Coordinate } from '../types';
import { getZoneBoundingBox, calculateResize } from '../utils/geometry';

interface EditorZoneProps {
    zone: Zone;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (newPoints: Coordinate[]) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

const EditorZone: React.FC<EditorZoneProps> = ({ zone, isSelected, onSelect, onUpdate, containerRef }) => {
    const rect = getZoneBoundingBox(zone.points);

    const handleResize = (e: React.PointerEvent, type: string) => {
        e.stopPropagation();
        onSelect();
        const startX = e.clientX;
        const startY = e.clientY;
        const initialRect = { ...rect };

        const onMove = (moveEvent: PointerEvent) => {
            if (!containerRef.current) return;
            const containerRect = containerRef.current.getBoundingClientRect();
            
            // Normalize delta to percentage relative to container
            const deltaX = ((moveEvent.clientX - startX) / containerRect.width) * 100;
            const deltaY = ((moveEvent.clientY - startY) / containerRect.height) * 100;

            const newPoints = calculateResize(initialRect, type, deltaX, deltaY);
            onUpdate(newPoints);
        };

        const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    };

    return (
        <div 
            onPointerDown={(e) => handleResize(e, 'move')}
            className={`absolute cursor-move select-none pointer-events-auto ${isSelected ? 'z-50' : 'z-10'}`}
            style={{ left: `${rect.x}%`, top: `${rect.y}%`, width: `${rect.w}%`, height: `${rect.h}%` }}
        >
            <div className={`w-full h-full border-2 ${isSelected ? 'border-blue-500 bg-blue-500/20 shadow-lg' : 'border-dashed border-slate-400 hover:border-blue-300 transition-colors'}`}></div>
            {isSelected && (
                <>
                    {['nw', 'ne', 'sw', 'se'].map(pos => (
                        <div 
                            key={pos}
                            onPointerDown={(e) => handleResize(e, pos)}
                            className={`absolute w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-md z-[60] -${pos.includes('n') ? 'top' : 'bottom'}-2.5 -${pos.includes('w') ? 'left' : 'right'}-2.5 cursor-${pos}-resize`}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export default EditorZone;
