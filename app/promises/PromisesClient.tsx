'use client';

import { useState, useMemo, useCallback } from 'react';
import { PROMISES } from '@/data/promises';
import { PromiseCard } from '@/components/promises/PromiseCard';
import { POLICY_CATEGORIES } from '@/lib/utils';
import { DebouncedSearchInput } from '@/components/ui/DebouncedSearchInput';
import { useSearchCache } from '@/lib/useSearchCache';
import { useUrlState } from '@/lib/useUrlState';
import { Filter, ArrowUpDown } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
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
  const rowVirtualizer = useVirtualizer({
    count: filteredPromises.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 260,
    overscan: 4,
  });

  return (
    <>
      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-[var(--border-subtle)] mb-12">
        {[
          { label: 'Tracked', value: PROMISES.length, color: 'var(--text-primary)' },
          {
            label: 'Verified Complete',
            value: PROMISES.filter(
              (p) => p.status === 'completed' || p.status === 'operational'
            ).length,
            color: 'var(--accent-positive)',
          },
          {
            label: 'Cancelled / Delayed',
            value: PROMISES.filter(
              (p) => p.status === 'cancelled' || p.status === 'delayed'
            ).length,
            color: 'var(--accent-negative)',
          },
          { label: 'Avg Trust Score', value: avgConfidence, color: 'var(--accent-info)' },
        ].map((stat, i) => (
          <div key={i} className="p-6 border-r border-[var(--border-subtle)] last:border-r-0">
            <div className="stat-block__label">{stat.label}</div>
            <div className="stat-block__value" style={{ color: stat.color }}>
              <AnimatedCounter value={stat.value} />
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[60px] z-30 bg-[var(--bg-base)]/80 backdrop-blur-md border-b border-[var(--border-subtle)] mb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <DebouncedSearchInput
            value={inputValue}
            onChange={setInputValue}
            onDebounced={handleDebouncedSearch}
            placeholder="Search statements or subjects..."
            className="md:max-w-md"
          />

          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {/* Category filter — shallow URL routing */}
            <div className="flex items-center gap-2 border-r border-[var(--border-subtle)] pr-6">
              <Filter className="w-4 h-4 text-[var(--text-tertiary)]" />
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-transparent text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-[var(--text-tertiary)]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] focus:outline-none cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="confidence">Highest Evidence</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Virtualized promise list */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12">
        {filteredPromises.length === 0 ? (
          <div className="py-24 text-center text-[var(--text-tertiary)] font-serif italic text-lg">
            No promises match your forensic criteria.
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
                  paddingBottom: '32px',
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
