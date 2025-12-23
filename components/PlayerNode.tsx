
import React from 'react';
import { motion } from 'framer-motion';
import { Coordinate } from '../types';

interface PlayerNodeProps {
  id: string;
  name: string; // New prop
  team: 'home' | 'away';
  position: Coordinate;
  animationSpeed?: number;
}

const PlayerNode: React.FC<PlayerNodeProps> = ({ id, name, team, position, animationSpeed = 2000 }) => {
  const isAway = team === 'away';

  // Truncate name to 4 characters for display
  const displayName = name.substring(0, 4);
  const durationInSeconds = (animationSpeed / 1000) * 0.8;

  return (
    <motion.div
      initial={false}
      animate={{
        top: `${position.y}%`,
        left: `${position.x}%`,
      }}
      transition={{
        type: "tween",
        ease: "easeInOut",
        duration: durationInSeconds
      }}
      className={`absolute w-10 h-10 md:w-14 md:h-14 -ml-5 -mt-5 md:-ml-7 md:-mt-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform ${isAway ? 'z-10' : 'z-20'}`}
      style={{
        backgroundColor: isAway ? 'var(--player-color-opponent)' : 'var(--player-color-primary)',
        color: 'var(--player-color-text)',
      }}
      title={name}
    >
      <span className="text-[10px] md:text-sm font-bold tracking-tighter select-none uppercase">{displayName}</span>
      {!isAway && (
        <div className="absolute w-full h-full rounded-full border border-white opacity-20 animate-pulse"></div>
      )}
    </motion.div>
  );
};

export default PlayerNode;
