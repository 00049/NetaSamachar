import clsx from 'clsx';
import { Search, User, TrendingUp, Clock, Star, MapPin, Globe, Map, Building2, SlidersHorizontal } from 'lucide-react';
import { FILTERS, FilterOption } from '@/app/politicians/PoliticiansClient';

export function FilterSidebar({
  sidebarWidth,
  isResizing,
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
  return (
<aside 
          className="relative shrink-0 border-r border-white/20 bg-[#05060a] hidden lg:flex flex-col"
          style={{ width: sidebarWidth }}
        >
          <div className="p-6 flex-1 overflow-y-auto hide-scrollbar">
            <div className="mb-4 text-[11px] uppercase tracking-widest font-bold text-white/40 px-2">Search & Discover</div>
            
            <div className="flex flex-col gap-2 mb-8">
              <button 
                onClick={() => setDiscoverMode('all')}
                className={clsx(
                  "flex items-center gap-4 w-full p-2.5 rounded-2xl border transition-all text-left group",
                  discoverMode === 'all' 
                    ? "border-emerald-500/20 bg-emerald-500/[0.03]" 
                    : "border-transparent hover:bg-white/[0.04]"
                )}
              >
                <div className={clsx(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm",
                  discoverMode === 'all'
                    ? "bg-emerald-500/10 border border-emerald-500/20"
                    : "bg-[#0a0c12] border border-white/5 group-hover:bg-white/5 group-hover:scale-105"
                )}>
                  <User className={clsx("w-6 h-6 transition-colors", discoverMode === 'all' ? "text-emerald-500" : "text-white/50 group-hover:text-white")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-white truncate transition-colors">All Politicians</div>
                  <div className="text-[12px] text-white/50 mt-0.5 truncate">Browse the complete database</div>
                </div>
              </button>
              
              <button 
                onClick={() => setDiscoverMode('trending')}
                className={clsx(
                  "flex items-center gap-4 w-full p-2.5 rounded-2xl border transition-all text-left group",
                  discoverMode === 'trending' 
                    ? "border-emerald-500/20 bg-emerald-500/[0.03]" 
                    : "border-transparent hover:bg-white/[0.04]"
                )}
              >
                <div className={clsx(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm",
                  discoverMode === 'trending'
                    ? "bg-emerald-500/10 border border-emerald-500/20"
                    : "bg-[#0a0c12] border border-white/5 group-hover:bg-white/5 group-hover:scale-105"
                )}>
                  <TrendingUp className={clsx("w-6 h-6 transition-colors", discoverMode === 'trending' ? "text-emerald-500" : "text-white/50 group-hover:text-white")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-white truncate transition-colors">Trending Now</div>
                  <div className="text-[12px] text-white/40 mt-0.5 truncate">Most viewed this week</div>
                </div>
              </button>
              
              <button 
                onClick={() => setDiscoverMode('new')}
                className={clsx(
                  "flex items-center gap-4 w-full p-2.5 rounded-2xl border transition-all text-left group",
                  discoverMode === 'new' 
                    ? "border-emerald-500/20 bg-emerald-500/[0.03]" 
                    : "border-transparent hover:bg-white/[0.04]"
                )}
              >
                <div className={clsx(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm",
                  discoverMode === 'new'
                    ? "bg-emerald-500/10 border border-emerald-500/20"
                    : "bg-[#0a0c12] border border-white/5 group-hover:bg-white/5 group-hover:scale-105"
                )}>
                  <Clock className={clsx("w-6 h-6 transition-colors", discoverMode === 'new' ? "text-emerald-500" : "text-white/50 group-hover:text-white")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-white truncate transition-colors">Newly Added</div>
                  <div className="text-[12px] text-white/40 mt-0.5 truncate">Recently added profiles</div>
                </div>
              </button>
              
              <button 
                onClick={() => setDiscoverMode('featured')}
                className={clsx(
                  "flex items-center gap-4 w-full p-2.5 rounded-2xl border transition-all text-left group",
                  discoverMode === 'featured' 
                    ? "border-emerald-500/20 bg-emerald-500/[0.03]" 
                    : "border-transparent hover:bg-white/[0.04]"
                )}
              >
                <div className={clsx(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm",
                  discoverMode === 'featured'
                    ? "bg-emerald-500/10 border border-emerald-500/20"
                    : "bg-[#0a0c12] border border-white/5 group-hover:bg-white/5 group-hover:scale-105"
                )}>
                  <Star className={clsx("w-6 h-6 transition-colors", discoverMode === 'featured' ? "text-emerald-500" : "text-white/50 group-hover:text-white")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-white truncate transition-colors">Featured Profiles</div>
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
                      {availableStates.map((state: string) => <option key={state} value={state} />)}
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
  );
}
