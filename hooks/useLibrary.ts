import { useState, useEffect } from 'react';
import { getTactics } from '../data/tactics';
import { Tactic } from '../types';

export const useLibrary = () => {
  const [tactics, setTactics] = useState<Tactic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getTactics()
      .then(data => {
        if (mounted) {
          setTactics(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, []);

  return { tactics, loading, error };
};
