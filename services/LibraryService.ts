import { Tactic } from '../types';

export const LibraryService = {
  groupTacticsByCategory: (tactics: Tactic[]): Record<string, Tactic[]> => {
    return tactics.reduce((acc, tactic) => {
      if (!acc[tactic.category]) {
        acc[tactic.category] = [];
      }
      acc[tactic.category].push(tactic);
      return acc;
    }, {} as Record<string, Tactic[]>);
  }
};
