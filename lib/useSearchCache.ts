import { useRef, useCallback } from 'react';

/**
 * useSearchCache — session-scoped LRU-style cache for search results.
 *
 * Usage:
 *   const { get, set } = useSearchCache<Politician[]>('politicians');
 *   const cached = get(query);
 *   if (!cached) { ... compute results ... set(query, results); }
 *
 * The cache is stored on a stable ref so it survives re-renders without
 * causing them, and lives for the lifetime of the component / tab session.
 * It is keyed by both the namespace AND the query string, so
 * "politicians:sharma" and "promises:sharma" are separate entries.
 */

const MAX_ENTRIES = 200; // stay well under memory limits

export function useSearchCache<T>(namespace: string) {
  const cache = useRef<Map<string, T>>(new Map());

  const key = useCallback((q: string) => `${namespace}:${q}`, [namespace]);

  const get = useCallback(
    (q: string): T | undefined => cache.current.get(key(q)),
    [key]
  );

  const set = useCallback(
    (q: string, value: T) => {
      // Evict oldest entry when at capacity (Map preserves insertion order)
      if (cache.current.size >= MAX_ENTRIES) {
        const firstKey = cache.current.keys().next().value;
        if (firstKey !== undefined) cache.current.delete(firstKey);
      }
      cache.current.set(key(q), value);
    },
    [key]
  );

  const has = useCallback((q: string): boolean => cache.current.has(key(q)), [key]);

  return { get, set, has };
}
