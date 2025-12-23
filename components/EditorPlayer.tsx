
import React from 'react';
import { motion } from 'framer-motion';
import { Coordinate } from '../types';
import { useDraggable } from '../hooks/useDraggable';

interface EditorPlayerProps {
    id: string;
    name: string; 
    team: 'home' | 'away';
    x: number;
    y: number;
    onDragEnd: (id: string, newPos: Coordinate) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
    isSelected: boolean;
    isHighlighted?: boolean;
    onSelect: (id: string) => void;
}

const EditorPlayer: React.FC<EditorPlayerProps> = ({
    id, name, team, x, y, onDragEnd, containerRef, isSelected, isHighlighted, onSelect
}) => {
    const isOpponent = team === 'away';
    const bgColor = isOpponent ? 'var(--player-color-opponent)' : 'var(--player-color-primary)';
    
    // Truncate for display
    const displayName = name.substring(0, 4);

    // Desktop: 56px (w-14). Radius 28. Offset -28.
    // Mobile: 40px (w-10). Radius 20. Offset -20.
    const sizeClasses = "w-10 h-10 -ml-5 -mt-5 md:w-14 md:h-14 md:-ml-7 md:-mt-7";
    
    // Use shared drag logic
    const dragProps = useDraggable({
        x,
        y,
        containerRef,
        onDragEnd: (pos) => onDragEnd(id, pos)
    });

    // Dynamic class for border/ring
    let borderClass = 'border-white';
    if (isSelected) {
        borderClass = 'border-blue-400 ring-4 ring-blue-400/30';
    } else if (isHighlighted) {
        // High visibility yellow ring for "Related Entity"
        borderClass = 'border-yellow-400 ring-4 ring-yellow-400/50 scale-110';
    }

    return (
        <motion.div
            {...dragProps}
            initial={false}
            // CRITICAL FIX: Do not use 'animate' prop for positioning here. 
            // It overrides dragProps.animate (controls) which prevents the drag transform reset.
            // Using 'style' allows the drag controls to work correctly.
            style={{ 
                top: `${y}%`, 
                left: `${x}%`,
                position: 'absolute', 
                backgroundColor: bgColor, 
                zIndex: isSelected || isHighlighted ? 90 : 80 
            }}
            whileDrag={{ scale: 1.1, cursor: 'grabbing', zIndex: 110 }}
            onPointerDown={(e) => { e.stopPropagation(); onSelect(id); }}
            className={`${sizeClasses} rounded-full flex items-center justify-center shadow-xl border-2 cursor-grab active:cursor-grabbing ${borderClass} select-none pointer-events-auto`}
            title={name}
        >
            <span className="text-[10px] md:text-xs font-black text-white pointer-events-none uppercase tracking-tighter">{displayName}</span>
        </motion.div>
    );
};

export default EditorPlayer;
