
import React from 'react';
import { motion } from 'framer-motion';
import { Coordinate } from '../types';

interface BallNodeProps {
  position: Coordinate;
  animationSpeed?: number;
}

const BallNode: React.FC<BallNodeProps> = ({ position, animationSpeed = 2000 }) => {
  const durationInSeconds = (animationSpeed / 1000) * 0.8;

  return (
    <motion.div
      initial={false}
      animate={{
        top: `${position.y}%`,
        left: `${position.x}%`,
        rotate: 360
      }}
      transition={{
        type: "tween",
        ease: "easeInOut",
        duration: durationInSeconds,
      }}
      className="absolute w-5 h-5 md:w-6 md:h-6 -ml-2.5 -mt-2.5 md:-ml-3 md:-mt-3 rounded-full flex items-center justify-center shadow-md z-50 pointer-events-none"
      style={{
        backgroundColor: 'var(--player-color-accent)',
        background: 'radial-gradient(circle at 30% 30%, #fff, var(--player-color-accent))',
      }}
    >
      <svg viewBox="0 0 24 24" className="w-full h-full opacity-80" fill="none" stroke="currentColor" strokeWidth="2">
         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.46.04-.92.1-1.36.98 1.25 2.58 2.16 4.4 2.16 2.05 0 3.79-.9 4.9-2.25 1.1 1.35 2.85 2.25 4.9 2.25 1.82 0 3.42-.91 4.4-2.16.06.44.1.9.1 1.36 0 4.41-3.59 8-8 8z" fillOpacity="0.2"/>
         <path strokeLinecap="round" d="M12 2c0 5 2 9 5 11M12 22c0-5-2-9-5-11M2 12h20"/>
      </svg>
    </motion.div>
  );
};

export default BallNode;
