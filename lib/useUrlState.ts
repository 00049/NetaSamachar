'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

/**
 * useUrlState — syncs a string param to the URL with shallow routing.
 * Clicking a filter chip or changing sort updates the URL instantly
 * (shareable link) without any full-page navigation.
 *
 * @param key     URL query param name (e.g. "filter", "sort")
 * @param def     Default value when param is absent
 * @returns       [value, setter]
 */
export function useUrlState(key: string, def: string): [string, (v: string) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState<string>(() => searchParams.get(key) ?? def);

  // Keep state in sync if user navigates back/forward
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(searchParams.get(key) ?? def);
  }, [searchParams, key, def]);

  const update = (v: string) => {
    setValue(v);
    const params = new URLSearchParams(searchParams.toString());
    if (v === def) {
      params.delete(key);
    } else {
      params.set(key, v);
    }
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  };

  return [value, update];
}
