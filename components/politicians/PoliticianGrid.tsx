'use client';
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
{/* Grid Area */}
          {filteredAndSorted.length === 0 ? (
            <div className="py-24 text-center text-white/40 font-serif italic text-lg border border-white/5 rounded-2xl bg-[#0a0c12]">
              No results match your current filters.
            </div>
          ) : viewMode === 'list' ? (
            <div className="flex flex-col gap-4">
              {filteredAndSorted.map((politician: Politician, idx: number) => (
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
                      {rowPoliticians.map((politician: Politician) => (
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
    </>
  );
}
