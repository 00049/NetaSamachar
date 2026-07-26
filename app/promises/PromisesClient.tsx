'use client';

import { useState, useMemo } from 'react';
import { PROMISES } from '@/data/promises';
import { PromiseCard } from '@/components/promises/PromiseCard';
import { POLICY_CATEGORIES } from '@/lib/utils';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export function PromisesClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recent' | 'confidence'>('recent');

  const avgConfidence = Math.round(
    PROMISES.reduce((s, p) => s + p.confidenceScore, 0) / PROMISES.length
  );

  const filteredPromises = useMemo(() => {
    let result = [...PROMISES];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) || p.fullStatement.toLowerCase().includes(q)
      );
    }

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    result.sort((a, b) => {
      if (sortBy === 'confidence') return b.confidenceScore - a.confidenceScore;
      return new Date(b.madeDate).getTime() - new Date(a.madeDate).getTime();
    });

    return result;
  }, [searchQuery, activeCategory, sortBy]);

  const categories = ['All', ...Object.keys(POLICY_CATEGORIES)];

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
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search statements or subjects..."
              className="w-full pl-10 pr-4 py-2.5 bg-transparent border-b border-transparent focus:border-[var(--text-primary)] text-sm font-medium focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
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
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'confidence')}
                className="bg-transparent text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] focus:outline-none cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="confidence">Highest Evidence</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
        {filteredPromises.length === 0 ? (
          <div className="py-24 text-center text-[var(--text-tertiary)] font-serif italic text-lg">
            No promises match your forensic criteria.
          </div>
        ) : (
          <AnimatePresence>
            {filteredPromises.map((promise) => (
              <PromiseCard key={promise.id} promise={promise} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </>
  );
}
