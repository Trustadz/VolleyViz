
import { Coordinate } from '../types';

export const screenToCanvas = (
  clientX: number,
  clientY: number,
  container: HTMLElement
): Coordinate => {
  const rect = container.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;
  return {
    x: Math.max(0, Math.min(100, Math.round(x))),
    y: Math.max(0, Math.min(100, Math.round(y)))
  };
};
