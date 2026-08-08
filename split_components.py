import re

with open("/tmp/original.tsx", "r") as f:
    text = f.read()

# Extract sidebar
sidebar_start = text.find('<aside')
sidebar_end = text.find('</aside>') + len('</aside>')
sidebar_jsx = text[sidebar_start:sidebar_end]

# Modify sidebar jsx slightly for props
sidebar_jsx = sidebar_jsx.replace('onClick={() => setDiscoverMode(\'all\')}', 'onClick={() => setDiscoverMode(\'all\')}')
# We will just write a new file for FilterSidebar

filter_sidebar = """import clsx from 'clsx';
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
""" + sidebar_jsx + """
  );
}
"""

with open("components/politicians/FilterSidebar.tsx", "w") as f:
    f.write(filter_sidebar)


# Extract SortBar
sortbar_start = text.find('{/* Top Trending / Insights Bar */}')
sortbar_end = text.find('{/* Grid Area */}')
sortbar_jsx = text[sortbar_start:sortbar_end]

sort_bar = """import clsx from 'clsx';
import { LayoutGrid, List, ArrowUpDown, ChevronRight, TrendingUp } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { SortOption } from '@/app/politicians/PoliticiansClient';

export function SortBar({
  trending,
  filteredCount,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
}: any) {
  return (
    <>
""" + sortbar_jsx + """
    </>
  );
}
"""

with open("components/politicians/SortBar.tsx", "w") as f:
    f.write(sort_bar)

# Extract PoliticianGrid
grid_start = text.find('{/* Grid Area */}')
grid_end = text.find('{/* Pagination Mock */}')
grid_jsx = text[grid_start:grid_end]

# For grid, we need the virtualizer and window hooks
grid = """'use client';
import { useState, useRef, useEffect } from 'react';
import { PoliticianCard } from '@/components/politicians/PoliticianCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useRouter } from 'next/navigation';
import { Politician } from '@/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CARD_GAP = 16;
const MIN_CARD_WIDTH = 260;

export function PoliticianGrid({
  filteredAndSorted,
  viewMode,
  clearAllFilters,
}: any) {
  const router = useRouter();
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridWidth, setGridWidth] = useState(800);

  useEffect(() => {
    if (!gridRef.current) return;
    const obs = new ResizeObserver(([entry]) => setGridWidth(entry.contentRect.width));
    obs.observe(gridRef.current);
    return () => obs.disconnect();
  }, [filteredAndSorted.length]);

  const colCount = Math.max(1, Math.floor((gridWidth + CARD_GAP) / (MIN_CARD_WIDTH + CARD_GAP)));
  const rowCount = Math.ceil(filteredAndSorted.length / colCount);
  const scrollMargin = gridRef.current?.offsetTop ?? 0;
  
  // Bug fix: different heights for different modes
  const itemHeight = viewMode === 'grid' ? 310 : 200;

  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => itemHeight + CARD_GAP,
    overscan: 3,
    scrollMargin,
  });

  return (
    <>
""" + grid_jsx + """
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
    </>
  );
}
"""

with open("components/politicians/PoliticianGrid.tsx", "w") as f:
    f.write(grid)

