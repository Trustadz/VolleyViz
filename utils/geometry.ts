import { Coordinate, Zone } from '../types';

/**
 * Ray-casting algorithm to determine if a point is inside a polygon.
 */
export const isPointInPolygon = (point: Coordinate, polygon: Coordinate[]): boolean => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

export const findClickedZone = (click: Coordinate, zones?: Zone[]): Zone | undefined => {
  if (!zones) return undefined;
  for (let i = zones.length - 1; i >= 0; i--) {
    if (isPointInPolygon(click, zones[i].points)) {
      return zones[i];
    }
  }
  return undefined;
};

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const getZoneBoundingBox = (points: Coordinate[]): Rect => {
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
};

export const calculateResize = (
  initialRect: Rect, 
  handleType: string, 
  deltaX: number, 
  deltaY: number
): Coordinate[] => {
  let nr = { ...initialRect };

  if (handleType === 'move') {
    nr.x += deltaX; 
    nr.y += deltaY; 
  } else {
    if (handleType.includes('w')) { nr.x += deltaX; nr.w -= deltaX; }
    if (handleType.includes('e')) { nr.w += deltaX; }
    if (handleType.includes('n')) { nr.y += deltaY; nr.h -= deltaY; }
    if (handleType.includes('s')) { nr.h += deltaY; }
  }

  // Minimum constraints
  if (nr.w < 2) nr.w = 2; 
  if (nr.h < 2) nr.h = 2;

  // Convert back to polygon points (Order: TL, TR, BR, BL)
  return [
    { x: nr.x, y: nr.y }, 
    { x: nr.x + nr.w, y: nr.y }, 
    { x: nr.x + nr.w, y: nr.y + nr.h }, 
    { x: nr.x, y: nr.y + nr.h }
  ];
};
