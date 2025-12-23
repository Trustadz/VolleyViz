import React from 'react';
import { motion } from 'framer-motion';
import { Coordinate } from '../types';
import { useDraggable } from '../hooks/useDraggable';

interface EditorBallProps {
    id: string;
    x: number;
    y: number;
    onDragEnd: (newPos: Coordinate) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

const EditorBall: React.FC<EditorBallProps> = ({ id, x, y, onDragEnd, containerRef }) => {
    // Use shared drag logic
    const dragProps = useDraggable({
        x,
        y,
        containerRef,
        onDragEnd
    });

    return (
        <motion.div
            {...dragProps}
            style={{ 
                top: `${y}%`, 
                left: `${x}%`, 
                position: 'absolute', 
                backgroundColor: 'var(--player-color-accent)', 
                background: 'radial-gradient(circle at 30% 30%, #fff, var(--player-color-accent))',
                zIndex: 100 
            }}
            whileDrag={{ scale: 1.2, cursor: 'grabbing', zIndex: 110 }}
            transition={{ duration: 0 }}
            className="w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center shadow-xl border-2 border-white cursor-grab active:cursor-grabbing select-none pointer-events-auto"
            title={id}
        >
             <svg viewBox="0 0 24 24" className="w-full h-full opacity-60" fill="none" stroke="currentColor" strokeWidth="2">
                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.46.04-.92.1-1.36.98 1.25 2.58 2.16 4.4 2.16 2.05 0 3.79-.9 4.9-2.25 1.1 1.35 2.85 2.25 4.9 2.25 1.82 0 3.42-.91 4.4-2.16.06.44.1.9.1 1.36 0 4.41-3.59 8-8 8z" fillOpacity="0.2"/>
                 <path strokeLinecap="round" d="M12 2c0 5 2 9 5 11M12 22c0-5-2-9-5-11M2 12h20"/>
            </svg>
        </motion.div>
    );
};

export default EditorBall;