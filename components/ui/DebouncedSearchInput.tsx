'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useDebounce } from '@/lib/useDebounce';

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  /** Called after the debounce settles — use this to drive actual filtering */
  onDebounced: (v: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  id?: string;
}

/**
 * DebouncedSearchInput — a self-contained search field that:
 * - Shows the user's keystrokes immediately (no lag in the input itself)
 * - Fires `onDebounced` only after the user pauses for `debounceMs` (default 220ms)
 * - Replaces the search icon with a tiny spinner while the debounce is settling
 *   (i.e. the query is "in flight" waiting to resolve — existing results stay visible)
 */
export function DebouncedSearchInput({
  value,
  onChange,
  onDebounced,
  placeholder = 'Search...',
  debounceMs = 220,
  className = '',
  id,
}: SearchInputProps) {
  const debounced = useDebounce(value, debounceMs);
  const [isPending, setIsPending] = useState(false);
  const lastFired = useRef(value);

  // Mark pending whenever raw value and debounced value differ
  useEffect(() => {
    if (value !== debounced) {
      setIsPending(true);
    } else {
      setIsPending(false);
    }
  }, [value, debounced]);

  // Fire the debounced callback when it settles
  useEffect(() => {
    if (debounced !== lastFired.current) {
      lastFired.current = debounced;
      onDebounced(debounced);
    }
  }, [debounced, onDebounced]);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        {isPending ? (
          <Loader2 className="w-4 h-4 text-[var(--text-tertiary)] animate-spin" />
        ) : (
          <svg
            className="w-4 h-4 text-[var(--text-tertiary)]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}
      </div>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full pl-10 pr-4 py-2.5 bg-transparent border border-[var(--border-subtle)]
          text-sm font-medium text-[var(--text-primary)]
          focus:outline-none focus:border-[var(--text-primary)] transition-colors
          placeholder:text-[var(--text-tertiary)]`}
      />
    </div>
  );
}
