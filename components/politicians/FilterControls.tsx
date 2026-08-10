import React from 'react';
import clsx from 'clsx';
import { Search, User, TrendingUp, Clock, Star, MapPin, Map, Building2, SlidersHorizontal } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { FilterOption } from '@/app/politicians/PoliticiansClient';

export function FilterControls({
  inputValue,
  setInputValue,
  discoverMode,
  setDiscoverMode,
  activeFilter,
  setActiveFilter,
  filterState,
  setFilterState,
  filterConst,
  setFilterConst,
  availableStates,
  availableConsts,
}: any) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <div className="mb-4 text-[11px] uppercase tracking-widest font-bold text-white/40 px-2">Search & Discover</div>
      
      <div className="flex flex-col gap-1.5 mb-8">
        {/* ALL POLITICIANS */}
        <button 
          onClick={() => setDiscoverMode('all')}
          className={clsx(
            "relative flex items-center gap-4 w-full p-2.5 rounded-xl border transition-all text-left group outline-none",
            discoverMode === 'all' ? "border-white/5" : "border-transparent hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:border-white/10"
          )}
        >
          {discoverMode === 'all' && (
            <motion.div
              layoutId={shouldReduceMotion ? undefined : "discoverModeActiveBg"}
              className="absolute inset-0 bg-white/[0.06] border border-white/12 rounded-xl z-0"
              transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <div className="relative z-10 flex items-center gap-4 w-full">
            <div className={clsx(
              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200",
              discoverMode === 'all'
                ? "bg-white/10 border border-white/15"
                : "bg-[var(--color-panel)] border border-white/5 group-hover:bg-white/5 group-hover:scale-105"
            )}>
              <User className={clsx("w-5 h-5 transition-colors", discoverMode === 'all' ? "text-white" : "text-white/40 group-hover:text-white/80")} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-white truncate">All Politicians</div>
              <div className="text-[11px] text-white/40 mt-0.5 truncate">Browse the complete database</div>
            </div>
          </div>
        </button>
        
        {/* TRENDING NOW */}
        <button 
          onClick={() => setDiscoverMode('trending')}
          className={clsx(
            "relative flex items-center gap-4 w-full p-2.5 rounded-xl border transition-all text-left group outline-none",
            discoverMode === 'trending' ? "border-white/5" : "border-transparent hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:border-white/10"
          )}
        >
          {discoverMode === 'trending' && (
            <motion.div
              layoutId={shouldReduceMotion ? undefined : "discoverModeActiveBg"}
              className="absolute inset-0 bg-white/[0.06] border border-white/12 rounded-xl z-0"
              transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <div className="relative z-10 flex items-center gap-4 w-full">
            <div className={clsx(
              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200",
              discoverMode === 'trending'
                ? "bg-white/10 border border-white/15"
                : "bg-[var(--color-panel)] border border-white/5 group-hover:bg-white/5 group-hover:scale-105"
            )}>
              <TrendingUp className={clsx("w-5 h-5 transition-colors", discoverMode === 'trending' ? "text-white" : "text-white/40 group-hover:text-white/80")} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-white truncate">Trending Now</div>
              <div className="text-[11px] text-white/40 mt-0.5 truncate">Most debated this session</div>
            </div>
          </div>
        </button>
        
        {/* NEWEST */}
        <button 
          onClick={() => setDiscoverMode('new')}
          className={clsx(
            "relative flex items-center gap-4 w-full p-2.5 rounded-xl border transition-all text-left group outline-none",
            discoverMode === 'new' ? "border-white/5" : "border-transparent hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:border-white/10"
          )}
        >
          {discoverMode === 'new' && (
            <motion.div
              layoutId={shouldReduceMotion ? undefined : "discoverModeActiveBg"}
              className="absolute inset-0 bg-white/[0.06] border border-white/12 rounded-xl z-0"
              transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <div className="relative z-10 flex items-center gap-4 w-full">
            <div className={clsx(
              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200",
              discoverMode === 'new'
                ? "bg-white/10 border border-white/15"
                : "bg-[var(--color-panel)] border border-white/5 group-hover:bg-white/5 group-hover:scale-105"
            )}>
              <Clock className={clsx("w-5 h-5 transition-colors", discoverMode === 'new' ? "text-white" : "text-white/40 group-hover:text-white/80")} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-white truncate">Newest to Politics</div>
              <div className="text-[11px] text-white/40 mt-0.5 truncate">Fewest years in office</div>
            </div>
          </div>
        </button>
        
        {/* FEATURED */}
        <button 
          onClick={() => setDiscoverMode('featured')}
          className={clsx(
            "relative flex items-center gap-4 w-full p-2.5 rounded-xl border transition-all text-left group outline-none",
            discoverMode === 'featured' ? "border-white/5" : "border-transparent hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:border-white/10"
          )}
        >
          {discoverMode === 'featured' && (
            <motion.div
              layoutId={shouldReduceMotion ? undefined : "discoverModeActiveBg"}
              className="absolute inset-0 bg-white/[0.06] border border-white/12 rounded-xl z-0"
              transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <div className="relative z-10 flex items-center gap-4 w-full">
            <div className={clsx(
              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200",
              discoverMode === 'featured'
                ? "bg-white/10 border border-white/15"
                : "bg-[var(--color-panel)] border border-white/5 group-hover:bg-white/5 group-hover:scale-105"
            )}>
              <Star className={clsx("w-5 h-5 transition-colors", discoverMode === 'featured' ? "text-white" : "text-white/40 group-hover:text-white/80")} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-white truncate">Featured Profiles</div>
              <div className="text-[11px] text-white/40 mt-0.5 truncate">Editorially curated</div>
            </div>
          </div>
        </button>
      </div>

      <div className="flex items-center justify-between mb-4 px-2">
        <div className="text-[12px] uppercase tracking-widest font-bold text-white/40">Filters</div>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        {/* Search Block */}
        <div className="relative flex flex-col gap-2 w-full p-2.5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group focus-within:bg-white/[0.04] overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-500 opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 group-focus-within:bg-white/10 group-focus-within:border-white/20 group-focus-within:scale-105">
              <Search className="w-5 h-5 text-white/50 group-focus-within:text-white/90 transition-colors" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="text-[11px] font-bold text-white/40 group-focus-within:text-white/70 transition-colors uppercase tracking-widest">Search by name</div>
              <input 
                type="text" 
                placeholder="Enter keyword..." 
                className="w-full bg-transparent text-[14px] text-white font-bold outline-none focus:outline-none focus-visible:outline-none placeholder:text-white/20 mt-0.5 truncate"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          </div>
        </div>


        {/* State Block */}
        <div className="relative flex flex-col gap-2 w-full p-2.5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group focus-within:bg-white/[0.04] overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-500 opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 group-focus-within:bg-white/10 group-focus-within:border-white/20 group-focus-within:scale-105">
              <Map className="w-5 h-5 text-white/50 group-focus-within:text-white/90 transition-colors" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="text-[11px] font-bold text-white/40 group-focus-within:text-white/70 transition-colors uppercase tracking-widest">State / UT</div>
              <input 
                list="states-datalist"
                placeholder="All States & UTs"
                value={filterState}
                onChange={(e) => { setFilterState(e.target.value); setFilterConst(''); }}
                className="w-full bg-transparent text-[14px] text-white font-bold outline-none focus:outline-none focus-visible:outline-none placeholder:text-white/20 mt-0.5 truncate"
              />
              <datalist id="states-datalist">
                {availableStates.map((state: string) => <option key={state} value={state} />)}
              </datalist>
            </div>
          </div>
        </div>

        {/* Constituency Block */}
        <div className="relative flex flex-col gap-2 w-full p-2.5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group focus-within:bg-white/[0.04] overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-500 opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 group-focus-within:bg-white/10 group-focus-within:border-white/20 group-focus-within:scale-105">
              <MapPin className="w-5 h-5 text-white/50 group-focus-within:text-white/90 transition-colors" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="text-[11px] font-bold text-white/40 group-focus-within:text-white/70 transition-colors uppercase tracking-widest">City / Constituency</div>
              <input 
                list="consts-datalist"
                placeholder="All Cities / Constituencies"
                value={filterConst}
                onChange={(e) => setFilterConst(e.target.value)}
                className="w-full bg-transparent text-[14px] text-white font-bold outline-none focus:outline-none focus-visible:outline-none placeholder:text-white/20 mt-0.5 truncate"
              />
              <datalist id="consts-datalist">
                {availableConsts.map((constituency: string) => <option key={constituency} value={constituency} />)}
              </datalist>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-2">
          <button 
            onClick={() => { setInputValue(''); setFilterState(''); setFilterConst(''); setActiveFilter('All'); setDiscoverMode('all'); }}
            className="text-emerald-500 text-[13px] font-bold hover:text-emerald-400 px-6 py-2 rounded-full hover:bg-emerald-500/10 transition-colors"
          >
            Reset all filters
          </button>
        </div>
      </div>
    </>
  );
}
