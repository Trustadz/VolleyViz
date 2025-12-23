import { Tactic } from '../types';

export const getPlayerDisplayId = (id: string, isOpponent: boolean): string => {
  if (isOpponent && id.length > 1 && id.startsWith('O')) {
    return id.substring(1);
  }
  return id;
};

export const getTacticBadge = (name: string): string => {
  const match = name.match(/\d+/);
  return match ? match[0] : name.charAt(0);
};

export const animationSpeedToPercent = (ms: number): number => {
  return (4000 - ms) / 20;
};

export const percentToAnimationSpeed = (percent: number): number => {
  return 4000 - (percent * 20);
};

export const toSVGPoints = (points: {x: number, y: number}[]): string => {
  return points.map(p => `${p.x},${p.y}`).join(' ');
};
