'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { POLITICIANS, PARTIES } from '@/data/politicians';
import { Loader2, X, ChevronDown } from 'lucide-react';
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

const SLOT_LABELS = ['A', 'B', 'C'];

export function SearchSlot({ idx, type, value, selectedIds, onChange, onRemove, canRemove }: SearchSlotProps) {
  const [rawQuery, setRawQuery] = useState('');
  const debouncedQuery = useDebounce(rawQuery, 220);
  const isPending = rawQuery !== debouncedQuery;

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef  = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);

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
        return PARTIES.map(p => ({
          id: p.id,
          title: p.name,
          subtitle: p.abbreviation,
          initials: p.abbreviation.substring(0, 3),
        }));
      case 'state': {
        const states = Array.from(new Set(POLITICIANS.map(p => p.state)));
        return states.map(s => ({
          id: s.toLowerCase().replace(/\s+/g, '-'),
          title: s,
          subtitle: 'State',
          initials: s.substring(0, 2).toUpperCase(),
        }));
      }
      case 'constituency': {
        const consts = Array.from(new Set(POLITICIANS.map(p => p.constituency)));
        return consts.map(c => ({
          id: c.toLowerCase().replace(/\s+/g, '-'),
          title: c,
          subtitle: 'Constituency',
          initials: c.substring(0, 2).toUpperCase(),
        }));
      }
      case 'politician':
        return POLITICIANS.map(p => {
          const party = PARTIES.find(pt => pt.id === p.partyId);
          return {
            id: p.id,
            title: p.name,
            subtitle: `${party?.abbreviation || p.partyId} · ${p.state}`,
            initials: p.name.split(' ').map(n => n[0]).join('').substring(0, 2),
          };
        });
    }
  }, [type]);

  const selectedOption = useMemo(() => allOptions.find(o => o.id === value), [allOptions, value]);

  const filteredOptions = useMemo(() => {
    const cacheKey = `${debouncedQuery}|${selectedIds.join(',')}|${value ?? ''}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    let available = allOptions.filter(o => !selectedIds.includes(o.id) || o.id === value);
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      available = available.filter(
        o => o.title.toLowerCase().includes(q) || o.subtitle?.toLowerCase().includes(q)
      );
    }
    cache.set(cacheKey, available);
    return available;
  }, [allOptions, debouncedQuery, selectedIds, value, cache]);

  // Virtualise dropdown list
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => dropdownRef.current,
    estimateSize: () => 52,
    overscan: 5,
  });

  const handleSelect = useCallback((id: string) => {
    onChange(id);
    setIsOpen(false);
    setRawQuery('');
  }, [onChange]);

  return (
    <div className="flex-1 min-w-0" ref={containerRef}>
      {/* Slot label row */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
          Slot {SLOT_LABELS[idx] ?? idx + 1}
        </div>
        {canRemove && (
          <button
            onClick={onRemove}
            className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] hover:text-[var(--color-accent-negative)] transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      {/* Filled state */}
      {selectedOption ? (
        <div className="premium-card px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-[36px] h-[36px] rounded-[var(--radius-sm)] bg-white/10 flex items-center justify-center text-[11px] font-black text-white flex-shrink-0">
              {selectedOption.initials}
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-bold text-white truncate">{selectedOption.title}</div>
              {selectedOption.subtitle && (
                <div className="text-[11px] text-[var(--text-tertiary)] truncate">{selectedOption.subtitle}</div>
              )}
            </div>
          </div>
          <button
            onClick={() => onChange(null)}
            aria-label={`Remove ${selectedOption.title}`}
            className="w-[28px] h-[28px] flex-shrink-0 flex items-center justify-center rounded hover:bg-white/10 text-[var(--text-tertiary)] hover:text-white transition-colors"
          >
            <X className="w-[14px] h-[14px]" aria-hidden="true" />
          </button>
        </div>
      ) : (
        /* Empty / search state */
        <div className="relative">
          <div
            className={`flex items-center gap-3 premium-card px-4 py-3 border border-dashed transition-all duration-200 ${
              isOpen ? 'border-white/30 bg-white/[0.04]' : 'border-white/10'
            }`}
            onClick={() => { setIsOpen(true); inputRef.current?.focus(); }}
          >
            <div className="flex-shrink-0 text-[var(--text-tertiary)]">
              {isPending ? (
                <Loader2 className="w-[16px] h-[16px] animate-spin" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-[16px] h-[16px]" aria-hidden="true" />
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder={`Search ${type}s...`}
              value={rawQuery}
              onChange={e => setRawQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              autoComplete="off"
              aria-label={`Search for a ${type} to compare`}
              className="w-full bg-transparent text-[14px] text-white placeholder-[var(--text-tertiary)] focus:outline-none"
            />
          </div>

          {isOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-[calc(100%+6px)] left-0 right-0 max-h-[260px] overflow-y-auto bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] shadow-2xl z-50"
            >
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-[var(--text-tertiary)] text-[13px] text-center">
                  No matches found.
                </div>
              ) : (
                <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
                  {rowVirtualizer.getVirtualItems().map(vRow => {
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
                        className="w-full text-left px-4 border-b border-[var(--border-subtle)] hover:bg-white/5 transition-colors last:border-b-0 flex flex-col justify-center"
                      >
                        <span className="text-white font-semibold text-[13px] truncate">{opt.title}</span>
                        {opt.subtitle && (
                          <span className="text-[var(--text-tertiary)] text-[11px] mt-0.5 truncate">{opt.subtitle}</span>
                        )}
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
