'use client';
import { useState, useRef, useEffect } from 'react';
import { PoliticianCard } from '@/components/politicians/PoliticianCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useRouter } from 'next/navigation';
import { Politician } from '@/lib/types';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const CARD_GAP = 16;
const MIN_CARD_WIDTH = 260;

export function PoliticianGrid({
  filteredAndSorted,
  viewMode,
  clearAllFilters,
}: any) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
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

  // Initial estimate, will be measured dynamically
  const itemHeight = viewMode === 'grid' ? 420 : 200;

  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => itemHeight + CARD_GAP,
    overscan: 3,
    scrollMargin,
  });

  if (filteredAndSorted.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="py-24 text-center text-white/40 font-serif italic text-lg border border-white/5 rounded-2xl bg-[var(--color-panel)]"
      >
        No results match your current filters.
      </motion.div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {filteredAndSorted.map((politician: Politician, idx: number) => (
            <motion.div
              key={politician.id}
              layout={shouldReduceMotion ? false : "position"}
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <PoliticianCard
                politician={politician}
                viewMode="list"
                lazy={idx >= 10}
                onClickPreview={() => router.push('/politicians/' + politician.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  // Grid view with window virtualizer
  return (
    <div ref={gridRef} style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const startIdx = virtualRow.index * colCount;
        const rowPoliticians = filteredAndSorted.slice(startIdx, startIdx + colCount);
        return (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={rowVirtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              transform: `translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin}px)`,
              width: '100%',
            }}
          >
            <ScrollReveal
              delay={Math.min(virtualRow.index, 3) * 70}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
                gap: `${CARD_GAP}px`,
                paddingBottom: `${CARD_GAP}px`,
              }}
            >
              <AnimatePresence mode="popLayout">
                {rowPoliticians.map((politician: Politician) => (
                  <motion.div
                    key={politician.id}
                    layout={shouldReduceMotion ? false : "position"}
                    initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <PoliticianCard
                      politician={politician}
                      viewMode="grid"
                      onClickPreview={() => router.push('/politicians/' + politician.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollReveal>
          </div>
        );
      })}
    </div>
  );
}
