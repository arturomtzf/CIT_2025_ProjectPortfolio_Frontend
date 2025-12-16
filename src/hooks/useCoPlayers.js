import { useEffect, useState } from 'react';
import { getProfilePicture } from '../utils/picturesHelper';

/**
 * useCoPlayers
 * - actor: actor object (from actor API)
 * - options: { page, pageSize }
 * Returns: { coplayers, coplayerPics, loading, error, total }
 *
 * This hook fetches the full co-player list for the given actor, exposes
 * a page-limited `coplayers` array and only fetches profile pictures for
 * the visible page to limit network work.
 */
export default function useCoPlayers(actor, { page = 1, pageSize = 12 } = {}) {
  const [all, setAll] = useState([]);
  const [paged, setPaged] = useState([]);
  const [pics, setPics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch coplayers list when actor changes
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const load = async () => {
      if (!actor) {
        setAll([]);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const firstName = actor.firstname || '';
        const lastName = actor.lastname || '';
        const actorName = actor.name || `${firstName} ${lastName}`.trim();
        if (!actorName) {
          setAll([]);
          return;
        }
        const res = await fetch(`/api/actors/${encodeURIComponent(actorName)}/coplayers`, { signal: controller.signal });
        if (!res.ok) {
          console.warn('Co-players endpoint returned', res.status, 'for', actorName);
          if (mounted) setAll([]);
        } else {
          const data = await res.json();
          if (mounted) setAll(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.warn('Failed to load co-players', err);
        if (mounted) setError(err.message || 'Failed to load co-players');
        if (mounted) setAll([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; controller.abort(); };
  }, [actor && (actor.personId || actor.name || actor.firstname || actor.lastname)]);

  // Compute paged slice when full list / page / pageSize changes
  useEffect(() => {
    if (!all || all.length === 0) {
      setPaged([]);
      return;
    }
    const start = Math.max(0, (page - 1) * pageSize);
    setPaged(all.slice(start, start + pageSize));
  }, [all, page, pageSize]);

  // Fetch profile pictures only for the visible page
  useEffect(() => {
    let mounted = true;
    if (!paged || paged.length === 0) {
      setPics({});
      return;
    }

    const fetchPics = async () => {
      try {
        const promises = paged.map(async (cp) => {
          const pid = cp?.personId;
          if (!pid) return [pid, null];
          try {
            const p = await getProfilePicture(pid);
            return [pid, p ? `https://image.tmdb.org/t/p/w300_and_h450_face${p}` : null];
          } catch (e) {
            return [pid, null];
          }
        });

        const entries = await Promise.all(promises);
        if (!mounted) return;
        const map = {};
        for (const [k, v] of entries) {
          if (k) map[k] = v;
        }
        setPics(map);
      } catch (err) {
        if (!mounted) return;
        console.warn('Failed to fetch coplayer pictures', err);
        setPics({});
      }
    };

    fetchPics();
    return () => { mounted = false; };
  }, [paged]);

  return {
    coplayers: paged,
    coplayerPics: pics,
    loading,
    error,
    total: all.length,
  };
}
