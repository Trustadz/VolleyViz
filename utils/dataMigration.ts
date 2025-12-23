
import { Tactic, PlayerConfig, Ball, Step } from '../types';

export const sanitizeTactic = (t: any): Tactic => {
  if (!t) return t;
  
  // 1. Migrate Players
  const players: PlayerConfig[] = [];
  
  // Handle old string array or mixed array
  (t.players || []).forEach((p: any) => {
    let id = '';
    let name = '';
    let team: 'home' | 'away' = 'home';

    if (typeof p === 'string') {
        if (p === 'BALL') return; // Skip ball, handled in steps
        id = p;
        const isAway = p.startsWith('O'); // Old convention
        team = isAway ? 'away' : 'home';
        name = isAway && p.length > 1 ? p.substring(1) : p;
    } else {
        if (p.id === 'BALL' || p.team === 'ball') return;
        id = p.id;
        name = p.name;
        // Migrate 'opponent' to 'away'
        team = (p.team === 'opponent' || p.team === 'away') ? 'away' : 'home';
    }

    players.push({ id, name, team });
  });

  // 2. Migrate Steps (Extract BALL to balls array)
  const steps: Step[] = (t.steps || []).map((s: any) => {
      const positions = { ...s.positions };
      const balls: Ball[] = s.balls || [];

      // If BALL exists in positions, move it to balls array if not already present
      if (positions['BALL']) {
          if (!balls.find(b => b.id === 'BALL')) {
              balls.push({ id: 'BALL', position: positions['BALL'] });
          }
          delete positions['BALL'];
      }

      // Ensure positions only contains valid players
      // Optional: filter positions against players array, but keeping loose for now is safer

      return {
          ...s,
          positions,
          balls
      };
  });

  return { ...t, players, steps };
};
