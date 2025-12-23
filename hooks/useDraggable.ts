import { useAnimation, PanInfo } from 'framer-motion';
import React, { useEffect } from 'react';
import { Coordinate } from '../types';
import { screenToCanvas } from '../utils/coordinates';

interface UseDraggableParams {
    x: number;
    y: number;
    containerRef: React.RefObject<HTMLDivElement | null>;
    onDragEnd: (pos: Coordinate) => void;
}

export const useDraggable = ({ x, y, containerRef, onDragEnd }: UseDraggableParams) => {
    const controls = useAnimation();

    // Critical Fix: Forcefully reset the Framer Motion transform delta (x/y) to 0 
    // whenever the underlying data model updates the absolute position (top/left).
    // This prevents "double movement" where the visual transform adds to the new coordinate.
    useEffect(() => {
        controls.start({ x: 0, y: 0, transition: { duration: 0 } });
    }, [x, y, controls]);

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (!containerRef.current) return;
        
        // Calculate new percentage based on the absolute pointer position relative to the container
        const pos = screenToCanvas(info.point.x, info.point.y, containerRef.current);
        
        onDragEnd(pos);
    };

    return {
        drag: true, // Enable drag
        dragMomentum: false,
        dragElastic: 0,
        dragConstraints: containerRef,
        animate: controls,
        onDragEnd: handleDragEnd,
    };
};