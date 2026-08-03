'use client';

import { useState, useMemo, useCallback } from 'react';
import { PROMISES } from '@/data/promises';
import { PromiseCard } from '@/components/promises/PromiseCard';
import { POLICY_CATEGORIES } from '@/lib/utils';
import { DebouncedSearchInput } from '@/components/ui/DebouncedSearchInput';
import { useSearchCache } from '@/lib/useSearchCache';
import { useUrlState } from '@/lib/useUrlState';
import { Filter, ArrowUpDown } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Promise as AppPromise } from '@/lib/types';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

function filterPromises(
  list: AppPromise[],
  query: string,
  category: string,
  sort: string
): AppPromise[] {
  let result = list;
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (p) => p.title.toLowerCase().includes(q) || p.fullStatement.toLowerCase().includes(q)
    );
  }
  if (category !== 'All') {
    result = result.filter((p) => p.category === category);
  }
  return [...result].sort((a, b) => {
    if (sort === 'confidence') return b.confidenceScore - a.confidenceScore;
    return new Date(b.madeDate).getTime() - new Date(a.madeDate).getTime();
  });
}

export function PromisesClient() {
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Shallow-routed URL state — chip/sort changes update URL, no reload
  const [activeCategory, setActiveCategory] = useUrlState('category', 'All');
  const [sortBy, setSortBy] = useUrlState('sort', 'recent');

  const cache = useSearchCache<AppPromise[]>('promises');

  const avgConfidence = Math.round(
    PROMISES.reduce((s, p) => s + p.confidenceScore, 0) / PROMISES.length
  );

  const filteredPromises = useMemo(() => {
    const cacheKey = `${debouncedQuery}|${activeCategory}|${sortBy}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    const result = filterPromises(PROMISES, debouncedQuery, activeCategory, sortBy);
    cache.set(cacheKey, result);
    return result;
  }, [debouncedQuery, activeCategory, sortBy, cache]);

  const handleDebouncedSearch = useCallback((q: string) => setDebouncedQuery(q), []);
  const categories = ['All', ...Object.keys(POLICY_CATEGORIES)];

  // Virtualize the promise list
  const listRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: filteredPromises.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 400,
    overscan: 4,
  });

  return (
    <>
      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 px-6 sm:px-8 lg:px-12">
        {[
          { label: 'Tracked', value: PROMISES.length, color: 'var(--color-text-primary)' },
          {
            label: 'Verified Complete',
            value: PROMISES.filter(
              (p) => p.status === 'completed' || p.status === 'operational'
            ).length,
            color: 'var(--color-accent-positive)',
          },
          {
            label: 'Cancelled / Delayed',
            value: PROMISES.filter(
              (p) => p.status === 'cancelled' || p.status === 'delayed'
            ).length,
            color: 'var(--color-accent-negative)',
          },
          { label: 'Avg Trust Score', value: avgConfidence, color: 'var(--color-accent-info)' },
        ].map((stat, i) => (
          <div key={i} className="card-glass border-0 bg-transparent p-0">
            <div className="text-meta mb-4">{stat.label}</div>
            <div className="text-display" style={{ color: stat.color }}>
              <AnimatedCounter value={stat.value} />
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[72px] z-30 bg-[#0B0E14]/80 backdrop-blur-xl border-b border-t border-white/5 mb-16 py-6">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex-1 max-w-lg relative">
            <DebouncedSearchInput
              value={inputValue}
              onChange={setInputValue}
              onDebounced={handleDebouncedSearch}
              placeholder="Search statements or subjects..."
              className="input-minimal w-full text-heading-md placeholder-[var(--color-text-tertiary)]"
            />
          </div>

          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
            {/* Category filter — shallow URL routing */}
            <div className="flex items-center gap-3 pr-8 border-r border-white/5">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-transparent text-meta !text-white focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#1A1F2E] text-white">
                    {c.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-meta !text-white focus:outline-none cursor-pointer"
              >
                <option value="recent" className="bg-[#1A1F2E] text-white">Most Recent</option>
                <option value="confidence" className="bg-[#1A1F2E] text-white">Highest Evidence</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Virtualized promise list */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {filteredPromises.length === 0 ? (
          <div className="py-32 text-center">
            <div className="text-heading-lg text-[#A1A1AA]">
              No promises match your forensic criteria.
            </div>
          </div>
        ) : (
          <div
            ref={listRef}
            style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}
          >
            {rowVirtualizer.getVirtualItems().map((vRow) => (
              <div
                key={vRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  transform: `translateY(${vRow.start}px)`,
                  width: '100%',
                  paddingBottom: '40px',
                }}
              >
                <PromiseCard promise={filteredPromises[vRow.index]} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
