'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ReactDOM from 'react-dom';
import { Search, X, Users, Building2, ClipboardList, ArrowRight } from 'lucide-react';
import { POLITICIANS, PARTIES } from '@/data/politicians';
import { PROMISES } from '@/data/promises';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface Result {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  group: 'politicians' | 'parties' | 'promises';
}

const MAX_PER_GROUP = 4;

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const results = useMemo<Result[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const politicians: Result[] = POLITICIANS
      .filter(p => p.name.toLowerCase().includes(q) || p.state.toLowerCase().includes(q) || p.partyId.includes(q))
      .slice(0, MAX_PER_GROUP)
      .map(p => {
        const party = PARTIES.find(pt => pt.id === p.partyId);
        return {
          id: p.id,
          title: p.name,
          subtitle: `${party?.abbreviation ?? p.partyId} · ${p.state} · ${p.position}`,
          href: `/politicians/${p.id}`,
          group: 'politicians',
        };
      });

    const parties: Result[] = PARTIES
      .filter(p => p.name.toLowerCase().includes(q) || p.abbreviation.toLowerCase().includes(q))
      .slice(0, MAX_PER_GROUP)
      .map(p => ({
        id: p.id,
        title: p.name,
        subtitle: `${p.abbreviation} · Est. ${p.founded}`,
        href: `/parties/${p.id}`,
        group: 'parties',
      }));

    const promises: Result[] = PROMISES
      .filter(p => p.title?.toLowerCase().includes(q) || p.fullStatement?.toLowerCase().includes(q))
      .slice(0, MAX_PER_GROUP)
      .map(p => {
        const pol = POLITICIANS.find(pol => pol.id === p.politicianId);
        return {
          id: p.id,
          title: p.title ?? 'Untitled Promise',
          subtitle: `Promise · ${pol?.name ?? p.politicianId}`,
          href: `/promises/${p.id}`,
          group: 'promises',
        };
      });

    return [...politicians, ...parties, ...promises];
  }, [query]);

  const navigate = useCallback((href: string) => {
    router.push(href);
    onClose();
  }, [router, onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        navigate(results[selectedIndex].href);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, results, selectedIndex, navigate, onClose]);

  // Reset selection on query change
  useEffect(() => { setSelectedIndex(0); }, [query]);

  if (!open) return null;

  const groupIcons: Record<Result['group'], React.ElementType> = {
    politicians: Users,
    parties: Building2,
    promises: ClipboardList,
  };

  const groupLabels: Record<Result['group'], string> = {
    politicians: 'Politicians',
    parties: 'Parties',
    promises: 'Promises',
  };

  // Build grouped display with headers
  type DisplayItem = { type: 'header'; group: Result['group'] } | { type: 'result'; result: Result; flatIndex: number };
  const displayItems: DisplayItem[] = [];
  let flatIndex = 0;
  const groups = ['politicians', 'parties', 'promises'] as const;
  for (const group of groups) {
    const groupResults = results.filter(r => r.group === group);
    if (groupResults.length === 0) continue;
    displayItems.push({ type: 'header', group });
    for (const result of groupResults) {
      displayItems.push({ type: 'result', result, flatIndex });
      flatIndex++;
    }
  }

  const portal = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Palette panel */}
      <div
        role="dialog"
        aria-label="Command palette — search politicians, parties, promises"
        aria-modal="true"
        className="fixed top-[15vh] left-1/2 -translate-x-1/2 z-[9999] w-full max-w-[640px] mx-auto px-4"
      >
        <div className="bg-[var(--bg-raised)] border border-white/10 rounded-[var(--radius-lg)] shadow-2xl overflow-hidden">

          {/* Search input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
            <Search className="w-5 h-5 text-[var(--text-tertiary)] flex-shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search politicians, parties, promises…"
              aria-label="Search"
              className="flex-1 bg-transparent text-white text-[16px] placeholder-[var(--text-tertiary)] focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="text-[var(--text-tertiary)] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            <kbd className="hidden sm:flex items-center px-2 py-1 rounded bg-white/8 text-[11px] font-mono text-white/40">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[420px] overflow-y-auto py-2" role="listbox" aria-label="Search results">
            {query.trim() === '' ? (
              <div className="px-5 py-10 text-center text-[var(--text-tertiary)] text-[14px]">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-30" aria-hidden="true" />
                Type to search across politicians, parties, and promises
              </div>
            ) : results.length === 0 ? (
              <div className="px-5 py-10 text-center text-[var(--text-tertiary)] text-[14px]">
                No results for <strong className="text-white">"{query}"</strong>
              </div>
            ) : (
              displayItems.map((item, i) => {
                if (item.type === 'header') {
                  const Icon = groupIcons[item.group];
                  return (
                    <div key={`header-${item.group}`} className="flex items-center gap-2 px-5 pt-4 pb-1.5">
                      <Icon className="w-3.5 h-3.5 text-[var(--text-tertiary)]" aria-hidden="true" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
                        {groupLabels[item.group]}
                      </span>
                    </div>
                  );
                }

                const { result, flatIndex: fi } = item;
                const isSelected = fi === selectedIndex;

                return (
                  <button
                    key={result.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => navigate(result.href)}
                    onMouseEnter={() => setSelectedIndex(fi)}
                    className={`w-full text-left px-5 py-3 flex items-center justify-between gap-4 transition-colors duration-100 ${
                      isSelected ? 'bg-white/8' : 'hover:bg-white/4'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold text-white truncate">{result.title}</div>
                      <div className="text-[12px] text-[var(--text-tertiary)] truncate mt-0.5">{result.subtitle}</div>
                    </div>
                    {isSelected && (
                      <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" aria-hidden="true" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer hint */}
          <div className="px-5 py-3 border-t border-white/8 flex items-center gap-4 text-[11px] text-white/30">
            <span><kbd className="font-mono">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono">↵</kbd> open</span>
            <span><kbd className="font-mono">ESC</kbd> close</span>
          </div>
        </div>
      </div>
    </>
  );

  if (typeof window === 'undefined') return null;
  return ReactDOM.createPortal(portal, document.body);
}
