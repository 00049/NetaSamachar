'use client';
/* eslint-disable react-hooks/refs, @typescript-eslint/no-unused-vars */

import { useState, useMemo, useEffect, useRef } from 'react';
import { PARTIES } from '@/data/politicians';
import { useSearchCache } from '@/lib/useSearchCache';
import { useUrlState } from '@/lib/useUrlState';
import { CheckboxSelectionProvider } from '@/components/ui/CheckboxSelectionProvider';
import { StickyCompareBar } from '@/components/ui/StickyCompareBar';
import { Politician } from '@/lib/types';
import { FilterSidebar } from '@/components/politicians/FilterSidebar';
import { SortBar } from '@/components/politicians/SortBar';
import { PoliticianGrid } from '@/components/politicians/PoliticianGrid';

export type SortOption = 'relevance' | 'fulfillment' | 'assets' | 'cases' | 'attendance';
export type FilterOption = 'All' | 'Pending Cases' | 'BJP' | 'INC' | 'AAP';
export const FILTERS: FilterOption[] = ['All', 'Pending Cases', 'BJP', 'INC', 'AAP'];

export function sortPoliticians(list: Politician[], sortBy: SortOption): Politician[] {
  return [...list].sort((a, b) => {
    switch (sortBy) {
      case 'fulfillment':
        return (b.promisesFulfilled / (b.promisesTotal || 1)) - (a.promisesFulfilled / (a.promisesTotal || 1));
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

export function filterPoliticians(list: Politician[], query: string, filter: FilterOption, fState: string, fConst: string, discoverMode: 'all' | 'trending' | 'new' | 'featured'): Politician[] {
  let result = list;
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(p => {
      const party = PARTIES.find(pt => pt.id === p.partyId);
      const partyNameMatch = party ? (party.name.toLowerCase().includes(q) || party.abbreviation.toLowerCase().includes(q)) : false;
      return p.name.toLowerCase().includes(q) || 
      p.constituency.toLowerCase().includes(q) || 
      p.partyId.toLowerCase().includes(q) ||
      partyNameMatch;
    });
  }
  if (filter === 'Pending Cases') {
    result = result.filter((p) => p.criminalCases.length > 0);
  } else if (filter !== 'All') {
    result = result.filter((p) => p.partyId === filter.toLowerCase());
  }
  if (fState) result = result.filter(p => p.state === fState);
  if (fConst) result = result.filter(p => p.constituency === fConst);

  if (discoverMode === 'trending') {
    result = [...result].sort((a, b) => b.debatesParticipated - a.debatesParticipated);
  } else if (discoverMode === 'new') {
    result = [...result].sort((a, b) => a.yearsInPolitics - b.yearsInPolitics);
  } else if (discoverMode === 'featured') {
    result = result.filter(p => p.verified).sort((a, b) => (b.promisesTotal || 0) - (a.promisesTotal || 0));
  }

  return result;
}

export function PoliticiansClient({ initialPoliticians }: { initialPoliticians: Politician[] }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [discoverMode, setDiscoverMode] = useState<'all' | 'trending' | 'new' | 'featured'>('all');

  const [filterState, setFilterState] = useState('');
  const [filterConst, setFilterConst] = useState('');

  const availableStates = useMemo(() => Array.from(new Set(initialPoliticians.map(p => p.state).filter(Boolean))).sort(), [initialPoliticians]);
  const availableConsts = useMemo(() => {
    let filtered = initialPoliticians;
    if (filterState) filtered = filtered.filter(p => p.state === filterState);
    return Array.from(new Set(filtered.map(p => p.constituency).filter(Boolean))).sort();
  }, [initialPoliticians, filterState]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(inputValue), 250);
    return () => clearTimeout(t);
  }, [inputValue]);

  const [activeFilter, setActiveFilter] = useUrlState('filter', 'All');
  const [sortBy, setSortBy] = useUrlState('sort', 'relevance');

  const cache = useSearchCache<Politician[]>('politicians');

  const filteredAndSorted = useMemo(() => {
    const cacheKey = `${debouncedQuery}|${activeFilter}|${sortBy}|${filterState}|${filterConst}|${discoverMode}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    const filtered = filterPoliticians(initialPoliticians, debouncedQuery, activeFilter as FilterOption, filterState, filterConst, discoverMode);
    const sorted = discoverMode === 'all' ? sortPoliticians(filtered, sortBy as SortOption) : filtered;
    cache.set(cacheKey, sorted);
    return sorted;
  }, [initialPoliticians, debouncedQuery, activeFilter, sortBy, filterState, filterConst, discoverMode, cache]);

  const trending = initialPoliticians.slice(0, 5);

  const [sidebarWidth, setSidebarWidth] = useState(320);
  const isResizing = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      let newWidth = e.clientX;
      if (newWidth < 260) newWidth = 260;
      if (newWidth > 600) newWidth = 600;
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const clearAllFilters = () => {
    setInputValue('');
    setActiveFilter('All');
    setFilterState('');
    setFilterConst('');
    setSortBy('relevance');
    setDiscoverMode('all');
  };

  return (
    <CheckboxSelectionProvider type="politician">
      <div className="flex min-h-screen bg-[#05060a] lg:gap-4 xl:gap-6">
        
        <FilterSidebar 
          sidebarWidth={sidebarWidth}
          isResizing={isResizing}
          inputValue={inputValue}
          setInputValue={setInputValue}
          discoverMode={discoverMode}
          setDiscoverMode={setDiscoverMode}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          filterState={filterState}
          setFilterState={setFilterState}
          filterConst={filterConst}
          setFilterConst={setFilterConst}
          availableStates={availableStates}
          availableConsts={availableConsts}
        />

        <main className="flex-1 min-w-0 p-6 pt-8 pb-32">
          
          <SortBar 
            trending={trending}
            filteredCount={filteredAndSorted.length}
            sortBy={sortBy as SortOption}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          <PoliticianGrid 
            filteredAndSorted={filteredAndSorted} 
            viewMode={viewMode}
            clearAllFilters={clearAllFilters}
          />

        </main>
      </div>

      <StickyCompareBar />

    </CheckboxSelectionProvider>
  );
}
