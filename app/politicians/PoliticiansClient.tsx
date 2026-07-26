'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { POLITICIANS } from '@/data/politicians';
import { PoliticianCard } from '@/components/politicians/PoliticianCard';
import { PoliticianDrawer } from '@/components/politicians/PoliticianDrawer';
import { DebouncedSearchInput } from '@/components/ui/DebouncedSearchInput';
import { useSearchCache } from '@/lib/useSearchCache';
import { useUrlState } from '@/lib/useUrlState';
import clsx from 'clsx';
import { LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { CheckboxSelectionProvider } from '@/components/ui/CheckboxSelectionProvider';
import { StickyCompareBar } from '@/components/ui/StickyCompareBar';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Politician } from '@/lib/types';

type SortOption = 'fulfillment' | 'assets' | 'cases' | 'attendance';
type FilterOption = 'All' | 'Pending Cases' | 'BJP' | 'INC' | 'AAP';

const FILTERS: FilterOption[] = ['All', 'Pending Cases', 'BJP', 'INC', 'AAP'];
const CARD_HEIGHT = 350; // px — matches PoliticianCard compact height
const CARD_GAP = 24;
const MIN_CARD_WIDTH = 280;

function sortPoliticians(list: Politician[], sortBy: SortOption): Politician[] {
  return [...list].sort((a, b) => {
    switch (sortBy) {
      case 'fulfillment':
        return (
          b.promisesFulfilled / (b.promisesTotal || 1) -
          a.promisesFulfilled / (a.promisesTotal || 1)
        );
      case 'assets':
        return (b.latestNetWorth || 0) - (a.latestNetWorth || 0);
      case 'cases':
        return b.criminalCases.length - a.criminalCases.length;
      case 'attendance':
        return b.attendancePercent - a.attendancePercent;
      default:
        return 0;
    }
  });
}

function filterPoliticians(
  list: Politician[],
  query: string,
  filter: FilterOption
): Politician[] {
  let result = list;
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.constituency.toLowerCase().includes(q) ||
        p.partyId.toLowerCase().includes(q)
    );
  }
  if (filter === 'Pending Cases') {
    result = result.filter((p) => p.criminalCases.length > 0);
  } else if (filter !== 'All') {
    result = result.filter((p) => p.partyId === filter.toLowerCase());
  }
  return result;
}

export function PoliticiansClient() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Raw input value — updates on every keystroke (no lag in the input)
  const [inputValue, setInputValue] = useState('');
  // Debounced query — drives actual filtering (fired 220ms after typing stops)
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Filter & sort via URL params — enables shareable filtered views, no reload
  const [activeFilter, setActiveFilter] = useUrlState('filter', 'All');
  const [sortBy, setSortBy] = useUrlState('sort', 'fulfillment');

  const [previewPoliticianId, setPreviewPoliticianId] = useState<string | null>(null);
  const previewPolitician = useMemo(
    () => POLITICIANS.find((p) => p.id === previewPoliticianId) ?? null,
    [previewPoliticianId]
  );

  // Session cache — keyed by "query:filter:sort" so every unique combination is cached
  const cache = useSearchCache<Politician[]>('politicians');

  const filteredAndSorted = useMemo(() => {
    const cacheKey = `${debouncedQuery}|${activeFilter}|${sortBy}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const filtered = filterPoliticians(POLITICIANS, debouncedQuery, activeFilter as FilterOption);
    const sorted = sortPoliticians(filtered, sortBy as SortOption);
    cache.set(cacheKey, sorted);
    return sorted;
  }, [debouncedQuery, activeFilter, sortBy, cache]);

  const handleDebouncedSearch = useCallback((q: string) => {
    setDebouncedQuery(q);
  }, []);

  // ── Virtualizer (grid mode) ──────────────────────────────────────────
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridWidth, setGridWidth] = useState(800);

  useEffect(() => {
    if (!gridRef.current) return;
    const obs = new ResizeObserver(([entry]) => {
      setGridWidth(entry.contentRect.width);
    });
    obs.observe(gridRef.current);
    return () => obs.disconnect();
  }, []);

  const colCount = Math.max(1, Math.floor((gridWidth + CARD_GAP) / (MIN_CARD_WIDTH + CARD_GAP)));
  const rowCount = Math.ceil(filteredAndSorted.length / colCount);

  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => CARD_HEIGHT + CARD_GAP,
    overscan: 3,
    scrollMargin: gridRef.current?.offsetTop ?? 0,
  });

  return (
    <CheckboxSelectionProvider type="politician">
      {/* Sticky Control Bar */}
      <div className="sticky top-[60px] z-30 bg-[var(--bg-base)]/90 backdrop-blur-md border-y border-[var(--border-subtle)] mb-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Debounced search */}
            <DebouncedSearchInput
              value={inputValue}
              onChange={setInputValue}
              onDebounced={handleDebouncedSearch}
              placeholder="Search by name or constituency..."
              className="md:max-w-md"
            />

            <div className="flex flex-col sm:flex-row items-center gap-6 md:ml-auto">
              {/* Filter chips — shallow URL routing, instant, no reload */}
              <div className="flex flex-wrap items-center gap-[8px] w-full sm:w-auto">
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`h-[32px] px-[14px] rounded-[16px] text-[13px] whitespace-nowrap transition-all duration-150 ${
                      activeFilter === filter
                        ? 'bg-white/10 border border-white/30 text-white font-semibold'
                        : 'bg-transparent border border-white/12 text-[#A1A1AA] hover:border-white/25 hover:text-[#D4D4D8]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="h-6 w-px bg-[var(--border-subtle)] hidden sm:block" />

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start border border-[var(--border-subtle)] p-1 rounded-[8px] bg-white/5">
                <div className="flex items-center gap-2 pl-3 border-r border-[var(--border-subtle)] pr-4 min-h-[36px]">
                  <ArrowUpDown className="w-4 h-4 text-[var(--text-tertiary)]" />
                  {/* Sort dropdown — also shallow-routed */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-[13px] font-medium text-[var(--text-primary)] focus:outline-none cursor-pointer"
                  >
                    <option value="fulfillment">Fulfillment %</option>
                    <option value="assets">Assets</option>
                    <option value="cases">Cases</option>
                    <option value="attendance">Attendance</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 pr-1 min-h-[36px]">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={clsx(
                      'p-2 rounded-[6px] transition-colors',
                      viewMode === 'grid'
                        ? 'bg-white/10 text-white'
                        : 'text-[var(--text-tertiary)] hover:text-white'
                    )}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={clsx(
                      'p-2 rounded-[6px] transition-colors',
                      viewMode === 'list'
                        ? 'bg-white/10 text-white'
                        : 'text-[var(--text-tertiary)] hover:text-white'
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-[120px]">
        {filteredAndSorted.length === 0 ? (
          <div className="py-24 text-center text-[var(--text-tertiary)] font-serif italic text-lg">
            No dossiers match your current filters.
          </div>
        ) : viewMode === 'list' ? (
          /* List view — render all (list items are cheap, no virtualization needed at current scale) */
          <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            {filteredAndSorted.map((politician, idx) => (
              <PoliticianCard
                key={politician.id}
                politician={politician}
                viewMode="list"
                lazy={idx >= 10}
                onClickPreview={() => setPreviewPoliticianId(politician.id)}
              />
            ))}
          </div>
        ) : (
          /* Grid view — virtualized by row so only visible rows are in the DOM */
          <div
            ref={gridRef}
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const startIdx = virtualRow.index * colCount;
              const rowPoliticians = filteredAndSorted.slice(startIdx, startIdx + colCount);
              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    transform: `translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin}px)`,
                    width: '100%',
                  }}
                >
                  <ScrollReveal
                    delay={Math.min(virtualRow.index, 3) * 70}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
                      gap: `${CARD_GAP}px`,
                      paddingBottom: `${CARD_GAP}px`,
                    }}
                  >
                    {rowPoliticians.map((politician, i) => (
                      <PoliticianCard
                        key={politician.id}
                        politician={politician}
                        viewMode="compact"
                        lazy={virtualRow.index > 0}
                        onClickPreview={() => setPreviewPoliticianId(politician.id)}
                      />
                    ))}
                  </ScrollReveal>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <StickyCompareBar />

      <PoliticianDrawer
        politician={previewPolitician}
        isOpen={!!previewPoliticianId}
        onClose={() => setPreviewPoliticianId(null)}
      />
    </CheckboxSelectionProvider>
  );
}
