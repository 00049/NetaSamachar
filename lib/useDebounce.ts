import { useState, useEffect } from 'react';

/**
 * useDebounce — delays updating the returned value until `delay`ms after
 * the last change to `value`. Fires only on pause, not every keystroke.
 */
export function useDebounce<T>(value: T, delay = 220): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
