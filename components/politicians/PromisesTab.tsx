'use client';

import { useState, useMemo } from 'react';
import { PromiseCard } from '@/components/promises/PromiseCard';
import { Promise as PromiseType } from '@/lib/types';
import { ArrowUpDown } from 'lucide-react';

type FilterOption = 'All' | 'Completed' | 'In Progress' | 'Delayed' | 'Broken';
type SortOption = 'date' | 'completion';

const getCompletionPercentage = (status: string): number => {
  switch (status) {
    case 'completed':
    case 'operational': return 100;
    case 'mostly_completed': return 75;
    case 'partially_completed': return 50;
    case 'in_progress':
    case 'construction_started':
    case 'implementation_started': return 25;
    case 'tender_issued': return 10;
    case 'planning': return 5;
    case 'delayed': return 25;
    default: return 0;
  }
};

export function PromisesTab({ promises }: { promises: PromiseType[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [sortBy, setSortBy] = useState<SortOption>('date');

  const filteredAndSorted = useMemo(() => {
    let result = [...promises];

    // Filter
    if (activeFilter !== 'All') {
      result = result.filter(p => {
        if (activeFilter === 'Completed') return ['completed', 'operational'].includes(p.status);
        if (activeFilter === 'In Progress') return ['in_progress', 'construction_started', 'implementation_started', 'planning', 'tender_issued', 'mostly_completed', 'partially_completed'].includes(p.status);
        if (activeFilter === 'Delayed') return p.status === 'delayed';
        if (activeFilter === 'Broken') return ['cancelled', 'no_verified_progress'].includes(p.status);
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'completion') {
        const compA = getCompletionPercentage(a.status);
        const compB = getCompletionPercentage(b.status);
        if (compB !== compA) return compB - compA;
      }
      
      // Default to sorting by date made
      return new Date(b.madeDate).getTime() - new Date(a.madeDate).getTime();
    });

    return result;
  }, [promises, activeFilter, sortBy]);

  if (promises.length === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border border-[var(--border-subtle)] p-12 text-center">
        <h3 className="text-[var(--text-primary)] font-bold mb-2">No Promises Tracked</h3>
        <p className="text-[var(--text-tertiary)] text-sm">There are currently no promises tracked for this politician in our database.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-[8px] w-full sm:w-auto">
          {(['All', 'Completed', 'In Progress', 'Delayed', 'Broken'] as FilterOption[]).map((filter) => (
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

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start border border-[var(--border-subtle)] p-1 rounded-[8px] bg-white/5">
          <div className="flex items-center gap-2 pl-3 pr-4 min-h-[36px]">
            <ArrowUpDown className="w-4 h-4 text-[var(--text-tertiary)]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-[13px] font-medium text-[var(--text-primary)] focus:outline-none cursor-pointer"
            >
              <option value="date">Sort by Date</option>
              <option value="completion">Sort by Completion %</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="py-24 text-center text-[var(--text-tertiary)] font-serif italic text-lg border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.02)]">
          No promises match the selected filters.
        </div>
      ) : (
        <div className="flex flex-col">
          {filteredAndSorted.map(promise => (
            <PromiseCard 
              key={promise.id} 
              promise={promise} 
              politicianProfileMode={true} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
