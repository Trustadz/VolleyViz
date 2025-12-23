
export interface Coordinate {
  x: number; // Percentage 0-100 from left
  y: number; // Percentage 0-100 from top
}

export interface PlayerPositions {
  [playerId: string]: Coordinate;
}

export interface PlayerConfig {
  id: string;
  name: string;
  team: 'home' | 'away';
}

export interface Ball {
  id: string;
  position: Coordinate;
  color?: string;
}

export interface Drawing {
  id: string;
  points: Coordinate[];
  color: string;
}

export interface Zone {
  id: string;
  points: Coordinate[]; 
  color?: string; 
  borderColor?: string;
  responsiblePlayerId?: string; 
  targetStepId?: string; 
}

export interface Step {
  id: string;
  label: string;
  description?: string;
  positions: PlayerPositions;
  balls: Ball[]; // New: support multiple balls
  zones?: Zone[]; 
  drawings?: Drawing[]; 
  defaultNextStepId?: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  away: string; // Renamed from opponent
  accent: string;
  courtBg: string;
  courtLines: string;
}

export interface Tactic {
  id: string;
  category: string;
  name: string;
  description: string;
  players: PlayerConfig[];
  steps: Step[];
}

export interface TacticCategory {
  name: string;
  tactics: Tactic[];
}

export interface AppData {
  theme: Omit<ThemeConfig, 'id' | 'name'>;
  system: Pick<Tactic, 'name' | 'players' | 'steps'>;
}
