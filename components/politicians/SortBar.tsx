import clsx from 'clsx';
import { LayoutGrid, List, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { SortOption } from '@/app/politicians/PoliticiansClient';

export function SortBar({
  trending,
  filteredCount,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  setIsDrawerOpen,
  activeFilterCount,
}: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        {/* Mobile Filters Button */}
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="lg:hidden flex items-center gap-2 h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-[13px] font-bold tracking-wide hover:bg-white/10 transition-colors relative"
        >
          <SlidersHorizontal className="w-4 h-4 text-white/60" />
          FILTERS
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center bg-emerald-500 text-[var(--bg-base)] text-[10px] font-black rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="text-[13px] font-medium text-white/50 tracking-wide uppercase">
          <AnimatedCounter value={filteredCount} /> Politicians Found
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Sort Dropdown */}
        <div className="relative group">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-10 pl-10 pr-8 rounded-xl bg-[var(--color-panel)] border border-white/10 text-white text-[13px] font-bold outline-none appearance-none cursor-pointer hover:border-white/20 transition-colors"
          >
            <option value="relevance">Relevance</option>
            <option value="fulfillment">Highest Fulfillment</option>
            <option value="assets">Highest Assets</option>
            <option value="cases">Fewest Criminal Cases</option>
            <option value="attendance">Highest Attendance</option>
          </select>
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-white/40" />
        </div>

        {/* View Mode Toggles */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setViewMode('grid')}
            className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              viewMode === 'grid' ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/80"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              viewMode === 'list' ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/80"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
