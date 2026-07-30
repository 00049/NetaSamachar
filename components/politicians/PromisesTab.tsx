'use client';

import { useState, useMemo } from 'react';
import { PromiseRow } from '@/components/promises/PromiseRow';
import { Promise as PromiseType } from '@/lib/types';
import { ArrowUpDown, ClipboardCheck, User, Loader, AlertTriangle, List } from 'lucide-react';
import clsx from 'clsx';

type FilterOption = 'All' | 'Completed' | 'In Progress' | 'Not Started' | 'Delayed' | 'Broken';
type SortOption = 'latest' | 'completion';

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
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  // Compute Stats
  const totalPromises = promises.length;
  const completedCount = promises.filter(p => ['completed', 'operational'].includes(p.status)).length;
  const inProgressCount = promises.filter(p => ['in_progress', 'construction_started', 'implementation_started', 'planning', 'tender_issued', 'mostly_completed', 'partially_completed'].includes(p.status)).length;
  const notStartedCount = promises.filter(p => ['not_started', 'cancelled', 'no_verified_progress'].includes(p.status)).length;
  const delayedCount = promises.filter(p => p.status === 'delayed').length;
  const brokenCount = promises.filter(p => ['cancelled', 'no_verified_progress'].includes(p.status)).length;

  const completedPercent = totalPromises > 0 ? Math.round((completedCount / totalPromises) * 100) : 0;
  const inProgressPercent = totalPromises > 0 ? Math.round((inProgressCount / totalPromises) * 100) : 0;
  const notStartedPercent = totalPromises > 0 ? Math.round((notStartedCount / totalPromises) * 100) : 0;

  const filteredAndSorted = useMemo(() => {
    let result = [...promises];

    // Filter
    if (activeFilter !== 'All') {
      result = result.filter(p => {
        if (activeFilter === 'Completed') return ['completed', 'operational'].includes(p.status);
        if (activeFilter === 'In Progress') return ['in_progress', 'construction_started', 'implementation_started', 'planning', 'tender_issued', 'mostly_completed', 'partially_completed'].includes(p.status);
        if (activeFilter === 'Not Started') return ['not_started', 'cancelled', 'no_verified_progress'].includes(p.status);
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
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border border-white/10 p-12 text-center rounded-[16px] bg-white/[0.02]">
        <h3 className="text-white font-bold mb-2">No Promises Tracked</h3>
        <p className="text-[#A1A1AA] text-[13px]">There are currently no promises tracked for this politician.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-[24px]">
      
      {/* SUMMARY 4-CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
        {/* Total Promises */}
        <div className="premium-card p-[24px] flex items-center justify-between">
          <div className="flex gap-[16px] items-center">
            <div className="w-[48px] h-[48px] rounded-[12px] bg-[var(--color-accent-positive)]/10 border border-[var(--color-accent-positive)]/20 flex items-center justify-center">
              <ClipboardCheck className="w-[24px] h-[24px] text-[var(--color-accent-positive)]" />
            </div>
            <div>
              <div className="text-[#A1A1AA] text-[12px] font-medium mb-[4px]">Total Promises</div>
              <div className="text-white font-bold text-[28px] leading-none">{totalPromises}</div>
            </div>
          </div>
        </div>

        {/* Delivered */}
        <div className="premium-card p-[24px] flex items-center justify-between">
          <div className="flex gap-[16px] items-center">
            <div className="w-[48px] h-[48px] rounded-[12px] bg-[var(--color-accent-positive)]/10 border border-[var(--color-accent-positive)]/20 flex items-center justify-center">
              <User className="w-[24px] h-[24px] text-[var(--color-accent-positive)]" />
            </div>
            <div>
              <div className="text-[#A1A1AA] text-[12px] font-medium mb-[4px]">Delivered</div>
              <div className="text-white font-bold text-[28px] leading-none">{completedCount}</div>
            </div>
          </div>
          <div className="text-white text-[20px] font-medium">{completedPercent}%</div>
        </div>

        {/* In Progress */}
        <div className="premium-card p-[24px] flex items-center justify-between">
          <div className="flex gap-[16px] items-center">
            <div className="w-[48px] h-[48px] rounded-[12px] bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <Loader className="w-[24px] h-[24px] text-yellow-500" />
            </div>
            <div>
              <div className="text-[#A1A1AA] text-[12px] font-medium mb-[4px]">In Progress</div>
              <div className="text-white font-bold text-[28px] leading-none">{inProgressCount}</div>
            </div>
          </div>
          <div className="text-white text-[20px] font-medium">{inProgressPercent}%</div>
        </div>

        {/* Not Started */}
        <div className="premium-card p-[24px] flex items-center justify-between">
          <div className="flex gap-[16px] items-center">
            <div className="w-[48px] h-[48px] rounded-[12px] bg-[var(--color-accent-negative)]/10 border border-[var(--color-accent-negative)]/20 flex items-center justify-center">
              <AlertTriangle className="w-[24px] h-[24px] text-[var(--color-accent-negative)]" />
            </div>
            <div>
              <div className="text-[#A1A1AA] text-[12px] font-medium mb-[4px]">Not Started</div>
              <div className="text-white font-bold text-[28px] leading-none">{notStartedCount}</div>
            </div>
          </div>
          <div className="text-white text-[20px] font-medium">{notStartedPercent}%</div>
        </div>
      </div>

      {/* FILTERS & CONTROLS BAR */}
      <div className="premium-card p-[16px] flex flex-col xl:flex-row xl:items-center justify-between gap-[16px] mt-[16px]">
        {/* Filter Pills */}
        <div className="flex items-center gap-[24px] overflow-x-auto no-scrollbar pb-2 xl:pb-0">
          
          <button onClick={() => setActiveFilter('All')} className={clsx("flex items-center gap-[8px] text-[13px] whitespace-nowrap transition-colors", activeFilter === 'All' ? "text-[var(--color-accent-positive)] font-semibold" : "text-[#A1A1AA] hover:text-white")}>
            All <span className={clsx("px-[6px] py-[2px] rounded-full text-[11px]", activeFilter === 'All' ? "bg-[var(--color-accent-positive)]/20" : "bg-white/10")}>{totalPromises}</span>
          </button>

          <button onClick={() => setActiveFilter('Completed')} className={clsx("flex items-center gap-[8px] text-[13px] whitespace-nowrap transition-colors", activeFilter === 'Completed' ? "text-[var(--color-accent-positive)] font-semibold" : "text-[#A1A1AA] hover:text-white")}>
            Completed <span className={clsx("px-[6px] py-[2px] rounded-full text-[11px]", activeFilter === 'Completed' ? "bg-[var(--color-accent-positive)]/20" : "bg-white/10")}>{completedCount}</span>
          </button>

          <button onClick={() => setActiveFilter('In Progress')} className={clsx("flex items-center gap-[8px] text-[13px] whitespace-nowrap transition-colors", activeFilter === 'In Progress' ? "text-[var(--color-accent-positive)] font-semibold" : "text-[#A1A1AA] hover:text-white")}>
            In Progress <span className={clsx("px-[6px] py-[2px] rounded-full text-[11px]", activeFilter === 'In Progress' ? "bg-[var(--color-accent-positive)]/20" : "bg-white/10")}>{inProgressCount}</span>
          </button>

          <button onClick={() => setActiveFilter('Not Started')} className={clsx("flex items-center gap-[8px] text-[13px] whitespace-nowrap transition-colors", activeFilter === 'Not Started' ? "text-[var(--color-accent-positive)] font-semibold" : "text-[#A1A1AA] hover:text-white")}>
            Not Started <span className={clsx("px-[6px] py-[2px] rounded-full text-[11px]", activeFilter === 'Not Started' ? "bg-[var(--color-accent-positive)]/20" : "bg-white/10")}>{notStartedCount}</span>
          </button>

          <button onClick={() => setActiveFilter('Delayed')} className={clsx("flex items-center gap-[8px] text-[13px] whitespace-nowrap transition-colors", activeFilter === 'Delayed' ? "text-[var(--color-accent-positive)] font-semibold" : "text-[#A1A1AA] hover:text-white")}>
            Delayed <span className={clsx("px-[6px] py-[2px] rounded-full text-[11px]", activeFilter === 'Delayed' ? "bg-[var(--color-accent-positive)]/20" : "bg-white/10")}>{delayedCount}</span>
          </button>

          <button onClick={() => setActiveFilter('Broken')} className={clsx("flex items-center gap-[8px] text-[13px] whitespace-nowrap transition-colors", activeFilter === 'Broken' ? "text-[var(--color-accent-positive)] font-semibold" : "text-[#A1A1AA] hover:text-white")}>
            Broken <span className={clsx("px-[6px] py-[2px] rounded-full text-[11px]", activeFilter === 'Broken' ? "bg-[var(--color-accent-positive)]/20" : "bg-white/10")}>{brokenCount}</span>
          </button>

        </div>

        {/* Sort & List Toggle */}
        <div className="flex items-center gap-[12px] shrink-0">
          <div className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[8px] bg-white/[0.02] border border-white/5">
            <span className="text-[#A1A1AA] text-[13px]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-[13px] font-semibold text-white focus:outline-none cursor-pointer border-none p-0 outline-none"
            >
              <option value="latest" className="bg-[#111111]">Latest</option>
              <option value="completion" className="bg-[#111111]">Completion %</option>
            </select>
          </div>
          
          <button className="w-[36px] h-[36px] flex items-center justify-center rounded-[8px] bg-white/[0.02] border border-white/5 text-[#A1A1AA] hover:text-white hover:bg-white/[0.05] transition-colors">
            <List className="w-[16px] h-[16px]" />
          </button>
        </div>
      </div>

      {/* TABLE HEADER & LIST */}
      <div className="premium-card overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-[16px] py-[16px] border-b border-white/5 items-center px-[24px]">
          <div className="col-span-4 text-[#A1A1AA] text-[12px] font-medium tracking-wider">Promise</div>
          <div className="col-span-2 text-[#A1A1AA] text-[12px] font-medium tracking-wider">Category</div>
          <div className="col-span-2 text-[#A1A1AA] text-[12px] font-medium tracking-wider">Status</div>
          <div className="col-span-2 text-[#A1A1AA] text-[12px] font-medium tracking-wider">Progress</div>
          <div className="col-span-2 text-[#A1A1AA] text-[12px] font-medium tracking-wider pl-[8px]">Timeline</div>
        </div>

        {/* List Rows */}
        {filteredAndSorted.length === 0 ? (
          <div className="py-16 text-center text-[#A1A1AA] text-[13px]">
            No promises match the selected filters.
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredAndSorted.map(promise => (
              <PromiseRow key={promise.id} promise={promise} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
