'use client';
/* eslint-disable react-hooks/refs, @typescript-eslint/no-unused-vars */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { POLITICIANS } from '@/data/politicians';
import { PoliticianCard } from '@/components/politicians/PoliticianCard';
import { useSearchCache } from '@/lib/useSearchCache';
import { useRouter } from 'next/navigation';
import { useUrlState } from '@/lib/useUrlState';
import clsx from 'clsx';
import { LayoutGrid, List, ArrowUpDown, Search, User, TrendingUp, Clock, Star, MapPin, Globe, Map, Building2, SlidersHorizontal, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { CheckboxSelectionProvider } from '@/components/ui/CheckboxSelectionProvider';
import { StickyCompareBar } from '@/components/ui/StickyCompareBar';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Politician } from '@/lib/types';
import Image from 'next/image';

type SortOption = 'relevance' | 'fulfillment' | 'assets' | 'cases' | 'attendance';
type FilterOption = 'All' | 'Pending Cases' | 'BJP' | 'INC' | 'AAP';

const FILTERS: FilterOption[] = ['All', 'Pending Cases', 'BJP', 'INC', 'AAP'];
const CARD_HEIGHT = 310;
const CARD_GAP = 16;
const MIN_CARD_WIDTH = 260;

function sortPoliticians(list: Politician[], sortBy: SortOption): Politician[] {
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

function filterPoliticians(list: Politician[], query: string, filter: FilterOption, fState: string, fConst: string): Politician[] {
  let result = list;
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(p => 
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
  if (fState) result = result.filter(p => p.state === fState);
  if (fConst) result = result.filter(p => p.constituency === fConst);
  return result;
}

export function PoliticiansClient() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const [filterState, setFilterState] = useState('');
  const [filterConst, setFilterConst] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterCity, setFilterCity] = useState('');

  const availableStates = useMemo(() => Array.from(new Set(POLITICIANS.map(p => p.state).filter(Boolean))).sort(), []);
  const availableConsts = useMemo(() => {
    let filtered = POLITICIANS;
    if (filterState) filtered = filtered.filter(p => p.state === filterState);
    return Array.from(new Set(filtered.map(p => p.constituency).filter(Boolean))).sort();
  }, [filterState]);

  // Sync debouncedQuery
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(inputValue), 250);
    return () => clearTimeout(t);
  }, [inputValue]);

  const [activeFilter, setActiveFilter] = useUrlState('filter', 'All');
  const [sortBy, setSortBy] = useUrlState('sort', 'relevance');
  const router = useRouter();

  const cache = useSearchCache<Politician[]>('politicians');

  const filteredAndSorted = useMemo(() => {
    const cacheKey = `${debouncedQuery}|${activeFilter}|${sortBy}|${filterState}|${filterConst}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    const filtered = filterPoliticians(POLITICIANS, debouncedQuery, activeFilter as FilterOption, filterState, filterConst);
    const sorted = sortPoliticians(filtered, sortBy as SortOption);
    cache.set(cacheKey, sorted);
    return sorted;
  }, [debouncedQuery, activeFilter, sortBy, filterState, filterConst, cache]);

  // Trending (mocked to just top 5 of the list for now)
  const trending = POLITICIANS.slice(0, 5);

  const gridRef = useRef<HTMLDivElement>(null);
  const [gridWidth, setGridWidth] = useState(800);

  // Resizable sidebar state
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

  useEffect(() => {
    if (!gridRef.current) return;
    const obs = new ResizeObserver(([entry]) => setGridWidth(entry.contentRect.width));
    obs.observe(gridRef.current);
    return () => obs.disconnect();
  }, [filteredAndSorted.length]);

  const colCount = Math.max(1, Math.floor((gridWidth + CARD_GAP) / (MIN_CARD_WIDTH + CARD_GAP)));
  const rowCount = Math.ceil(filteredAndSorted.length / colCount);
  const scrollMargin = gridRef.current?.offsetTop ?? 0;

  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => CARD_HEIGHT + CARD_GAP,
    overscan: 3,
    scrollMargin,
  });

  return (
    <CheckboxSelectionProvider type="politician">
      <div className="flex min-h-screen bg-[#05060a] lg:gap-4 xl:gap-6">
        
        {/* Left Sidebar */}
        <aside 
          className="relative shrink-0 border-r border-white/20 bg-[#05060a] hidden lg:flex flex-col"
          style={{ width: sidebarWidth }}
        >
          <div className="p-6 flex-1 overflow-y-auto hide-scrollbar">
            <div className="mb-4 text-[11px] uppercase tracking-widest font-bold text-white/40 px-2">Search & Discover</div>
            
            <div className="flex flex-col gap-2 mb-8">
              <button className="flex items-center gap-4 w-full p-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] hover:bg-emerald-500/[0.08] transition-all text-left group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <User className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-white truncate">All Politicians</div>
                  <div className="text-[12px] text-white/50 mt-0.5 truncate">Browse the complete database</div>
                </div>
              </button>
              
              <button className="flex items-center gap-4 w-full p-2.5 rounded-2xl border border-transparent hover:bg-white/[0.04] transition-all text-left group">
                <div className="w-12 h-12 rounded-xl bg-[#0a0c12] border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/5 group-hover:scale-105 transition-all duration-300 shadow-sm">
                  <TrendingUp className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-white group-hover:text-white truncate transition-colors">Trending Now</div>
                  <div className="text-[12px] text-white/40 mt-0.5 truncate">Most viewed this week</div>
                </div>
              </button>
              
              <button className="flex items-center gap-4 w-full p-2.5 rounded-2xl border border-transparent hover:bg-white/[0.04] transition-all text-left group">
                <div className="w-12 h-12 rounded-xl bg-[#0a0c12] border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/5 group-hover:scale-105 transition-all duration-300 shadow-sm">
                  <Clock className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-white group-hover:text-white truncate transition-colors">Newly Added</div>
                  <div className="text-[12px] text-white/40 mt-0.5 truncate">Recently added profiles</div>
                </div>
              </button>
              
              <button className="flex items-center gap-4 w-full p-2.5 rounded-2xl border border-transparent hover:bg-white/[0.04] transition-all text-left group">
                <div className="w-12 h-12 rounded-xl bg-[#0a0c12] border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/5 group-hover:scale-105 transition-all duration-300 shadow-sm">
                  <Star className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-white group-hover:text-white truncate transition-colors">Featured Profiles</div>
                  <div className="text-[12px] text-white/40 mt-0.5 truncate">Editorially curated</div>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between mb-4 px-2">
              <div className="text-[12px] uppercase tracking-widest font-bold text-white/40">Filters</div>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              {/* Search Block */}
              <div className="flex flex-col gap-2 w-full p-2.5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all group focus-within:bg-emerald-500/[0.03] focus-within:border-emerald-500/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 group-focus-within:bg-emerald-500/10 group-focus-within:border-emerald-500/20 group-focus-within:scale-105">
                    <Search className="w-5 h-5 text-white/50 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="text-[11px] font-bold text-white/40 group-focus-within:text-emerald-500 transition-colors uppercase tracking-widest">Search by name</div>
                    <input 
                      type="text" 
                      placeholder="Enter keyword..." 
                      className="w-full bg-transparent text-[14px] text-white font-bold outline-none placeholder:text-white/20 mt-0.5 truncate"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Country Block */}
              <div className="flex flex-col gap-2 w-full p-2.5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all group focus-within:bg-emerald-500/[0.03] focus-within:border-emerald-500/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 group-focus-within:bg-emerald-500/10 group-focus-within:border-emerald-500/20 group-focus-within:scale-105">
                    <Globe className="w-5 h-5 text-white/50 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="text-[11px] font-bold text-white/40 group-focus-within:text-emerald-500 transition-colors uppercase tracking-widest">Country</div>
                    <input 
                      placeholder="All Countries"
                      className="w-full bg-transparent text-[14px] text-white font-bold outline-none placeholder:text-white/20 mt-0.5 truncate"
                    />
                  </div>
                </div>
              </div>
              
              {/* State Block */}
              <div className="flex flex-col gap-2 w-full p-2.5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all group focus-within:bg-emerald-500/[0.03] focus-within:border-emerald-500/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 group-focus-within:bg-emerald-500/10 group-focus-within:border-emerald-500/20 group-focus-within:scale-105">
                    <Map className="w-5 h-5 text-white/50 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="text-[11px] font-bold text-white/40 group-focus-within:text-emerald-500 transition-colors uppercase tracking-widest">State / UT</div>
                    <input 
                      list="states-datalist"
                      placeholder="All States & UTs"
                      value={filterState}
                      onChange={(e) => { setFilterState(e.target.value); setFilterConst(''); }}
                      className="w-full bg-transparent text-[14px] text-white font-bold outline-none placeholder:text-white/20 mt-0.5 truncate"
                    />
                    <datalist id="states-datalist">
                      {availableStates.map(state => <option key={state} value={state} />)}
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Constituency Block */}
              <div className="flex flex-col gap-2 w-full p-2.5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all group focus-within:bg-emerald-500/[0.03] focus-within:border-emerald-500/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 group-focus-within:bg-emerald-500/10 group-focus-within:border-emerald-500/20 group-focus-within:scale-105">
                    <MapPin className="w-5 h-5 text-white/50 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="text-[11px] font-bold text-white/40 group-focus-within:text-emerald-500 transition-colors uppercase tracking-widest">City / Constituency</div>
                    <input 
                      list="consts-datalist"
                      placeholder="All Cities / Constituencies"
                      value={filterConst}
                      onChange={(e) => setFilterConst(e.target.value)}
                      className="w-full bg-transparent text-[14px] text-white font-bold outline-none placeholder:text-white/20 mt-0.5 truncate"
                    />
                    <datalist id="consts-datalist">
                      {availableConsts.map(constituency => <option key={constituency} value={constituency} />)}
                    </datalist>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-2">
                <button 
                  onClick={() => { setInputValue(''); setFilterState(''); setFilterConst(''); setActiveFilter('All'); }}
                  className="text-emerald-500 text-[13px] font-bold hover:text-emerald-400 px-6 py-2 rounded-full hover:bg-emerald-500/10 transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Drag Handle */}
          <div 
            className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-emerald-500/50 transition-colors z-10"
            onMouseDown={() => {
              isResizing.current = true;
              document.body.style.cursor = 'col-resize';
              document.body.style.userSelect = 'none';
            }}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-6 md:p-10 flex flex-col gap-14">
          
          <div>
            <h1 className="text-white font-serif font-bold text-[28px] md:text-[32px] mb-2 tracking-tight">Explore India's Political Landscape</h1>
            <p className="text-white/50 text-[14px]">Discover, analyze and track verified data on public representatives.</p>
          </div>
          
          {/* Summary Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Stat Card 1 */}
            <div className="group relative bg-[#0a0c12] border border-white/5 rounded-3xl p-5 md:p-6 overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] cursor-pointer flex flex-col h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col gap-4 flex-1 justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-500">
                  <User className="w-5 h-5 text-emerald-500 group-hover:-translate-y-1 transition-transform duration-500" />
                </div>
                <div className="pb-1">
                  <div className="text-white font-bold text-2xl tracking-tight group-hover:text-emerald-400 transition-colors duration-300">10,254+</div>
                  <div className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest font-bold mt-1 leading-relaxed">Total Politicians</div>
                </div>
              </div>
            </div>
            
            {/* Stat Card 2 */}
            <div className="group relative bg-[#0a0c12] border border-white/5 rounded-3xl p-5 md:p-6 overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] cursor-pointer flex flex-col h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col gap-4 flex-1 justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-500">
                  <MapPin className="w-5 h-5 text-emerald-500 group-hover:-translate-y-1 transition-transform duration-500" />
                </div>
                <div className="pb-1">
                  <div className="text-white font-bold text-2xl tracking-tight group-hover:text-emerald-400 transition-colors duration-300">36</div>
                  <div className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest font-bold mt-1 leading-relaxed">States & UTs</div>
                </div>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="group relative bg-[#0a0c12] border border-white/5 rounded-3xl p-5 md:p-6 overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] cursor-pointer flex flex-col h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col gap-4 flex-1 justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-500">
                  <Building2 className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="pb-1">
                  <div className="text-white font-bold text-2xl tracking-tight group-hover:text-emerald-400 transition-colors duration-300">543</div>
                  <div className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest font-bold mt-1 leading-relaxed">Lok Sabha</div>
                </div>
              </div>
            </div>

            {/* Stat Card 4 */}
            <div className="group relative bg-[#0a0c12] border border-white/5 rounded-3xl p-5 md:p-6 overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] cursor-pointer flex flex-col h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col gap-4 flex-1 justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-500">
                  <Building2 className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="pb-1">
                  <div className="text-white font-bold text-2xl tracking-tight group-hover:text-emerald-400 transition-colors duration-300">2,412</div>
                  <div className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest font-bold mt-1 leading-relaxed">Vidhan Sabha</div>
                </div>
              </div>
            </div>

            {/* Stat Card 5 */}
            <div className="group relative bg-[#0a0c12] border border-white/5 rounded-3xl p-5 md:p-6 overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] cursor-pointer md:col-span-3 xl:col-span-1 flex flex-col h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col gap-4 flex-1 justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-500">
                  <Globe className="w-5 h-5 text-emerald-500 group-hover:rotate-180 transition-transform duration-1000" />
                </div>
                <div className="pb-1">
                  <div className="text-white font-bold text-2xl tracking-tight group-hover:text-emerald-400 transition-colors duration-300">125+</div>
                  <div className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest font-bold mt-1 leading-relaxed">Countries</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Politicians */}
          <div className="bg-[#0a0c12] border border-white/5 rounded-3xl p-8 flex flex-col gap-14">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white font-bold text-[20px]">
                <TrendingUp className="w-6 h-6 text-emerald-500" /> Trending Politicians
              </div>
              <button className="text-emerald-500 text-[14px] font-bold flex items-center gap-1 hover:text-emerald-400">
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex gap-5 overflow-x-auto pb-4 snap-x hide-scrollbar relative">
              {trending.map((pol, idx) => (
                <div key={pol.id} className="snap-start shrink-0 w-[280px] bg-[#05060a] border border-white/5 rounded-2xl p-4 flex items-center gap-4 relative hover:bg-white/[0.04] cursor-pointer transition-colors" onClick={() => router.push('/politicians/' + pol.id)}>
                  <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#0a0c12] flex items-center justify-center text-white text-[10px] font-bold z-10">{idx + 1}</div>
                  <img src={pol.photoUrl} alt={pol.name} className="w-12 h-12 rounded-full object-cover shrink-0 bg-white/10" />
                  <div className="min-w-0">
                    <div className="text-white font-bold text-[14px] truncate">{pol.name}</div>
                    <div className="text-white/50 text-[11px] truncate mt-0.5">{pol.partyId.toUpperCase()}</div>
                    <div className="text-white/40 text-[11px] truncate mt-0.5">{pol.position || `${pol.state} ${pol.chamber === 'lok_sabha' ? 'MP' : 'MLA'}`}</div>
                  </div>
                </div>
              ))}
              {/* Fake Next Arrow */}
              <div className="shrink-0 w-12 flex items-center justify-center cursor-pointer opacity-50 hover:opacity-100">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
                  <ChevronRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* All Politicians */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-white font-bold text-[22px]">All Politicians</h2>
              <span className="text-emerald-500 text-[13px] font-medium tracking-wide">10,254+ results</span>
            </div>

            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <div className="flex items-center gap-2 border border-white/10 rounded-lg px-3 py-1.5 bg-[#0a0c12]">
                <ArrowUpDown className="w-3.5 h-3.5 text-white/40" />
                <span className="text-white/40 text-[12px]">Sort by:</span>
                <select 
                  className="bg-transparent text-white text-[12px] font-medium outline-none appearance-none pr-4"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="fulfillment">Fulfillment</option>
                  <option value="assets">Assets</option>
                  <option value="cases">Cases</option>
                  <option value="attendance">Attendance</option>
                </select>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-white/40 text-[12px] mr-2">View:</span>
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={clsx("p-1.5 rounded", viewMode === 'grid' ? "text-emerald-500" : "text-white/40 hover:text-white")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={clsx("p-1.5 rounded", viewMode === 'list' ? "text-emerald-500" : "text-white/40 hover:text-white")}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Grid Area */}
          {filteredAndSorted.length === 0 ? (
            <div className="py-24 text-center text-white/40 font-serif italic text-lg border border-white/5 rounded-2xl bg-[#0a0c12]">
              No results match your current filters.
            </div>
          ) : viewMode === 'list' ? (
            <div className="flex flex-col gap-4">
              {filteredAndSorted.map((politician, idx) => (
                <PoliticianCard
                  key={politician.id}
                  politician={politician}
                  viewMode="list"
                  lazy={idx >= 10}
                  onClickPreview={() => router.push('/politicians/' + politician.id)}
                />
              ))}
            </div>
          ) : (
            <div ref={gridRef} style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const startIdx = virtualRow.index * colCount;
                const rowPoliticians = filteredAndSorted.slice(startIdx, startIdx + colCount);
                return (
                  <div
                    key={virtualRow.key}
                    style={{ position: 'absolute', top: 0, transform: `translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin}px)`, width: '100%' }}
                  >
                    <ScrollReveal
                      delay={Math.min(virtualRow.index, 3) * 70}
                      style={{ display: 'grid', gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`, gap: `${CARD_GAP}px`, paddingBottom: `${CARD_GAP}px` }}
                    >
                      {rowPoliticians.map((politician) => (
                        <PoliticianCard
                          key={politician.id}
                          politician={politician}
                          viewMode="grid"
                          onClickPreview={() => router.push('/politicians/' + politician.id)}
                        />
                      ))}
                    </ScrollReveal>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Mock */}
          <div className="flex items-center justify-center gap-2 mt-12 pb-20">
            <button className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-white/40 hover:bg-white/5 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded border border-emerald-500 text-emerald-500 bg-emerald-500/10 flex items-center justify-center text-[12px] font-bold">
              1
            </button>
            <button className="w-8 h-8 rounded flex items-center justify-center text-white/50 hover:text-white text-[12px] font-medium">2</button>
            <button className="w-8 h-8 rounded flex items-center justify-center text-white/50 hover:text-white text-[12px] font-medium">3</button>
            <button className="w-8 h-8 rounded flex items-center justify-center text-white/50 hover:text-white text-[12px] font-medium">4</button>
            <button className="w-8 h-8 rounded flex items-center justify-center text-white/50 hover:text-white text-[12px] font-medium">5</button>
            <span className="text-white/40">...</span>
            <button className="w-8 h-8 rounded flex items-center justify-center text-white/50 hover:text-white text-[12px] font-medium">256</button>
            <button className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-white/40 hover:bg-white/5 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </main>
      </div>

      <StickyCompareBar />

    </CheckboxSelectionProvider>
  );
}
