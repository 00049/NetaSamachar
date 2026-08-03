'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { POLITICIANS, PARTIES } from '@/data/politicians';
import { X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/lib/useDebounce';
import { useSearchCache } from '@/lib/useSearchCache';
import { useVirtualizer } from '@tanstack/react-virtual';

interface SearchSlotProps {
  idx: number;
  type: 'party' | 'state' | 'constituency' | 'politician';
  value: string | null;
  selectedIds: string[];
  onChange: (value: string | null) => void;
  onRemove: () => void;
  canRemove: boolean;
}

interface Option { id: string; title: string; subtitle?: string; initials: string; }

export function SearchSlot({ idx, type, value, selectedIds, onChange, onRemove, canRemove }: SearchSlotProps) {
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
        return PARTIES.map((p) => ({ id: p.id, title: p.name, subtitle: p.abbreviation, initials: p.abbreviation.substring(0,2) }));
      case 'state': {
        const states = Array.from(new Set(POLITICIANS.map((p) => p.state)));
        return states.map((s) => ({
          id: s.toLowerCase().replace(/\s+/g, '-'),
          title: s,
          subtitle: 'State',
          initials: s.substring(0,2).toUpperCase()
        }));
      }
      case 'constituency': {
        const consts = Array.from(new Set(POLITICIANS.map((p) => p.constituency)));
        return consts.map((c) => ({
          id: c.toLowerCase().replace(/\s+/g, '-'),
          title: c,
          subtitle: 'Constituency',
          initials: c.substring(0,2).toUpperCase()
        }));
      }
      case 'politician':
        return POLITICIANS.map((p) => {
          const party = PARTIES.find((pt) => pt.id === p.partyId);
          return {
            id: p.id,
            title: p.name,
            subtitle: `${party?.abbreviation || p.partyId} • ${p.constituency}`,
            initials: p.name.split(' ').map(n=>n[0]).join('').substring(0,2)
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

  const slotLetter = String.fromCharCode(65 + idx);

  return (
    <div className={`slot ${isOpen ? 'drag-over' : ''}`} ref={containerRef}>
      <div className="slot-label-row">
        <div className="slot-label">Slot {slotLetter}</div>
        {canRemove && (
          <button onClick={onRemove} className="remove-slot-btn">Remove</button>
        )}
      </div>

      {selectedOption ? (
        <div className="slot-filled">
          <div className="slot-person">
            <div className="slot-avatar">{selectedOption.initials}</div>
            <div>
              <div className="slot-name">{selectedOption.title}</div>
              <div className="slot-meta">{selectedOption.subtitle}</div>
            </div>
          </div>
          <button onClick={() => onChange(null)} className="slot-remove">×</button>
        </div>
      ) : (
        <div className="slot-empty relative">
          <div className="filter-search" style={{ width: '100%', borderStyle: 'dashed' }}>
            {isPending ? (
              <Loader2 className="w-4 h-4 text-[var(--ink-faint)] mr-1 shrink-0 animate-spin" />
            ) : (
              <span>⌕</span>
            )}
            <input
              type="text"
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
              className="absolute top-[calc(100%+12px)] left-0 right-0 max-h-[250px] overflow-y-auto bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--radius)] shadow-2xl z-50"
            >
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-[var(--ink-faint)] text-[13px] text-center font-mono">No matches found.</div>
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
                        className="w-full text-left px-4 border-b border-[var(--border-soft)] hover:bg-[var(--bg-secondary)] transition-colors last:border-b-0 flex flex-col justify-center"
                      >
                        <span className="text-[var(--ink)] font-semibold text-[14px] truncate">{opt.title}</span>
                        <span className="text-[var(--ink-faint)] font-mono text-[11px] mt-0.5 truncate">{opt.subtitle}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
