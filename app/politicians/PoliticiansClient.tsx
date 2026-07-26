'use client';

import { useState, useMemo } from 'react';
import { POLITICIANS } from '@/data/politicians';
import { PoliticianCard } from '@/components/politicians/PoliticianCard';
import { PoliticianDrawer } from '@/components/politicians/PoliticianDrawer';
import clsx from 'clsx';
import { LayoutGrid, List, Search, ArrowUpDown } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { CheckboxSelectionProvider } from '@/components/ui/CheckboxSelectionProvider';
import { StickyCompareBar } from '@/components/ui/StickyCompareBar';

type SortOption = 'fulfillment' | 'assets' | 'cases' | 'attendance';
type FilterOption = 'All' | 'Pending Cases' | 'BJP' | 'INC' | 'AAP';

export function PoliticiansClient() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [sortBy, setSortBy] = useState<SortOption>('fulfillment');
  const [previewPoliticianId, setPreviewPoliticianId] = useState<string | null>(null);

  const previewPolitician = useMemo(
    () => POLITICIANS.find((p) => p.id === previewPoliticianId) || null,
    [previewPoliticianId]
  );

  const filteredAndSorted = useMemo(() => {
    let result = [...POLITICIANS];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.constituency.toLowerCase().includes(q) ||
          p.partyId.toLowerCase().includes(q)
      );
    }

    if (activeFilter === 'Pending Cases') {
      result = result.filter((p) => p.criminalCases.length > 0);
    } else if (activeFilter !== 'All') {
      result = result.filter((p) => p.partyId === activeFilter.toLowerCase());
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'fulfillment':
          return b.promisesFulfilled / (b.promisesTotal || 1) - a.promisesFulfilled / (a.promisesTotal || 1);
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

    return result;
  }, [searchQuery, activeFilter, sortBy]);

  const filters: FilterOption[] = ['All', 'Pending Cases', 'BJP', 'INC', 'AAP'];

  return (
    <CheckboxSelectionProvider type="politician">
      <div className="sticky top-[60px] z-30 bg-[var(--bg-base)]/90 backdrop-blur-md border-y border-[var(--border-subtle)] mb-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or constituency..."
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-[var(--border-subtle)] text-sm font-medium focus:outline-none focus:border-[var(--text-primary)] transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 md:ml-auto">
              <div className="flex flex-wrap items-center gap-[8px] w-full sm:w-auto">
                {filters.map((filter) => (
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
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
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
                      viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-[var(--text-tertiary)] hover:text-white'
                    )}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={clsx(
                      'p-2 rounded-[6px] transition-colors',
                      viewMode === 'list' ? 'bg-white/10 text-white' : 'text-[var(--text-tertiary)] hover:text-white'
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

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-[96px]">
        {filteredAndSorted.length === 0 ? (
          <div className="py-24 text-center text-[var(--text-tertiary)] font-serif italic text-lg">
            No dossiers match your current filters.
          </div>
        ) : (
          <div
            className={clsx(
              viewMode === 'grid'
                ? 'grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]'
                : 'flex flex-col gap-4 max-w-4xl mx-auto'
            )}
          >
            {filteredAndSorted.map((politician, idx) => (
              <PoliticianCard
                key={politician.id}
                politician={politician}
                viewMode={viewMode}
                lazy={idx >= 8}
                onClickPreview={() => setPreviewPoliticianId(politician.id)}
              />
            ))}
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
