'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { POLITICIANS, PARTIES } from '@/data/politicians';
import { X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/lib/useDebounce';
import { useSearchCache } from '@/lib/useSearchCache';
import { useVirtualizer } from '@tanstack/react-virtual';

interface SearchSlotProps {
  type: 'party' | 'state' | 'constituency' | 'politician';
  value: string | null;
  selectedIds: string[];
  onChange: (value: string | null) => void;
}

interface Option { id: string; title: string; subtitle?: string; }

export function SearchSlot({ type, value, selectedIds, onChange }: SearchSlotProps) {
  const [rawQuery, setRawQuery] = useState('');
  const debouncedQuery = useDebounce(rawQuery, 220);
  const isPending = rawQuery !== debouncedQuery;

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cache = useSearchCache<Option[]>(`compare-${type}`);

  // Close on click outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const allOptions = useMemo<Option[]>(() => {
    switch (type) {
      case 'party':
        return PARTIES.map((p) => ({ id: p.id, title: p.name, subtitle: p.abbreviation }));
      case 'state': {
        const states = Array.from(new Set(POLITICIANS.map((p) => p.state)));
        return states.map((s) => ({
          id: s.toLowerCase().replace(/\s+/g, '-'),
          title: s,
          subtitle: 'State',
        }));
      }
      case 'constituency': {
        const consts = Array.from(new Set(POLITICIANS.map((p) => p.constituency)));
        return consts.map((c) => ({
          id: c.toLowerCase().replace(/\s+/g, '-'),
          title: c,
          subtitle: 'Constituency',
        }));
      }
      case 'politician':
        return POLITICIANS.map((p) => {
          const party = PARTIES.find((pt) => pt.id === p.partyId);
          return {
            id: p.id,
            title: p.name,
            subtitle: `${party?.abbreviation || p.partyId} • ${p.constituency}`,
          };
        });
    }
  }, [type]);

  const selectedOption = useMemo(() => allOptions.find((o) => o.id === value), [allOptions, value]);

  // Filtered options — debounced query + duplicate-entity exclusion + session cache
  const filteredOptions = useMemo(() => {
    const cacheKey = `${debouncedQuery}|${selectedIds.join(',')}|${value ?? ''}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    let available = allOptions.filter((o) => !selectedIds.includes(o.id) || o.id === value);
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      available = available.filter(
        (o) =>
          o.title.toLowerCase().includes(q) || o.subtitle?.toLowerCase().includes(q)
      );
    }
    cache.set(cacheKey, available);
    return available;
  }, [allOptions, debouncedQuery, selectedIds, value, cache]);

  // Virtualize the dropdown list
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => dropdownRef.current,
    estimateSize: () => 52,
    overscan: 5,
  });

  const handleSelect = useCallback(
    (id: string) => {
      onChange(id);
      setIsOpen(false);
      setRawQuery('');
    },
    [onChange]
  );

  if (selectedOption) {
    return (
      <div className="h-[60px] bg-white/[0.04] border border-white/[0.15] rounded-lg p-4 flex items-center justify-between">
        <div className="flex flex-col truncate pr-4">
          <span className="text-white font-semibold truncate">{selectedOption.title}</span>
          <span className="text-[#A1A1AA] text-xs truncate">{selectedOption.subtitle}</span>
        </div>
        <button
          onClick={() => onChange(null)}
          className="p-1 hover:bg-white/[0.1] rounded-full text-[#A1A1AA] hover:text-white transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="h-[60px] bg-white/[0.02] border border-white/[0.08] focus-within:border-white/[0.3] rounded-lg flex items-center px-4 transition-colors">
        {/* Spinner while debounce is settling, search icon otherwise */}
        {isPending ? (
          <Loader2 className="w-4 h-4 text-[#71717A] mr-3 shrink-0 animate-spin" />
        ) : (
          <svg
            className="w-4 h-4 text-[#71717A] mr-3 shrink-0"
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
        <input
          type="text"
          className="bg-transparent border-none outline-none w-full text-white placeholder-[#71717A]"
          placeholder={`Search ${type}...`}
          value={rawQuery}
          onChange={(e) => setRawQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
        />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-[calc(100%+8px)] left-0 right-0 max-h-[300px] overflow-y-auto bg-[#18181B] border border-white/[0.1] rounded-lg shadow-2xl z-50"
        >
          {filteredOptions.length === 0 ? (
            <div className="p-4 text-[#71717A] text-sm text-center">No matches found.</div>
          ) : (
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
              {rowVirtualizer.getVirtualItems().map((vRow) => {
                const opt = filteredOptions[vRow.index];
                return (
                  <button
                    key={vRow.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      transform: `translateY(${vRow.start}px)`,
                      height: `${vRow.size}px`,
                    }}
                    onClick={() => handleSelect(opt.id)}
                    className="w-full text-left px-4 border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors last:border-b-0 flex flex-col justify-center"
                  >
                    <span className="text-white font-medium truncate">{opt.title}</span>
                    <span className="text-[#71717A] text-xs mt-0.5 truncate">{opt.subtitle}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
