'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SearchSlot } from './SearchSlot';
import { CompareTable } from './CompareTable';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

export type CompareType = 'party' | 'state' | 'constituency' | 'politician';

const TYPES: { id: CompareType; label: string }[] = [
  { id: 'party', label: 'Party' },
  { id: 'state', label: 'State' },
  { id: 'constituency', label: 'Constituency' },
  { id: 'politician', label: 'Politician' },
];

export function CompareBuilder({ initialSearchParams }: { initialSearchParams: { type?: string; a?: string; b?: string; c?: string } }) {
  const router = useRouter();
  const pathname = usePathname();

  const [compareType, setCompareType] = useState<CompareType>(
    (initialSearchParams.type as CompareType) || 'politician'
  );
  
  // Slots hold the IDs of the selected entities. Null means empty slot.
  const [slots, setSlots] = useState<(string | null)[]>([
    initialSearchParams.a || null,
    initialSearchParams.b || null,
    initialSearchParams.c || null,
  ].slice(0, initialSearchParams.c ? 3 : 2));

  // Sync state to URL when changed (shallow routing)
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('type', compareType);
    if (slots[0]) params.set('a', slots[0]);
    if (slots[1]) params.set('b', slots[1]);
    if (slots[2]) params.set('c', slots[2]);
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [compareType, slots, pathname, router]);

  const handleTypeChange = (newType: CompareType) => {
    if (newType === compareType) return;
    setCompareType(newType);
    setSlots([null, null]); // reset slots on type change
  };

  const handleSlotSelect = (index: number, id: string | null) => {
    const newSlots = [...slots];
    newSlots[index] = id;
    setSlots(newSlots);
  };

  const addSlot = () => {
    if (slots.length < 3) {
      setSlots([...slots, null]);
    }
  };

  const removeSlot = (index: number) => {
    const newSlots = [...slots];
    newSlots.splice(index, 1);
    // Ensure we always have at least 2 slots
    while (newSlots.length < 2) newSlots.push(null);
    setSlots(newSlots);
  };

  const filledSlots = slots.filter(s => s !== null) as string[];

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-20 py-32 lg:py-40">
      
      {/* Header & Type Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-6">
        <div>
          <div className="section-label">Comparison Engine</div>
          <h1 className="font-serif font-black text-[var(--text-primary)] text-4xl lg:text-5xl tracking-tight">
            Side-by-Side
          </h1>
        </div>
        
        {/* Type Selector (Segmented Control style) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 shrink-0 mt-4 md:mt-0">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#71717A]">
            Compare By
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {TYPES.map((t) => {
              const isActive = compareType === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTypeChange(t.id)}
                  className={`relative h-[36px] px-4 text-[13px] uppercase font-semibold rounded-[18px] transition-all duration-150 flex items-center justify-center ${
                    isActive 
                      ? 'bg-white text-black border border-transparent shadow-sm' 
                      : 'bg-transparent text-[#A1A1AA] border border-white/[0.12] hover:border-white/[0.3] hover:text-[#D4D4D8]'
                  }`}
                >
                  <span className="relative z-10">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Slots Picker Area */}
      <div className="flex flex-col md:flex-row gap-6 mb-16">
        <AnimatePresence>
          {slots.map((slotValue, idx) => (
            <motion.div 
              key={`slot-${idx}`}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex-1 relative overflow-visible"
            >
              <div className="text-xs uppercase tracking-widest text-[#71717A] mb-3 font-semibold">
                Slot {String.fromCharCode(65 + idx)}
              </div>
              <SearchSlot 
                type={compareType} 
                value={slotValue}
                selectedIds={filledSlots} 
                onChange={(val) => handleSlotSelect(idx, val)} 
              />
              
              {/* Only allow removing slot C (idx 2) */}
              {idx === 2 && (
                <button 
                  onClick={() => removeSlot(idx)}
                  className="absolute top-0 right-0 p-1 text-[#71717A] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Add 3rd Slot Button */}
        {slots.length < 3 && (
          <div className="flex-1 flex flex-col pt-[32px] md:pt-[28px] max-w-[200px]">
            <button 
              onClick={addSlot}
              className="h-[60px] border border-dashed border-white/[0.15] hover:border-white/[0.4] rounded-lg text-sm uppercase tracking-wider text-[#A1A1AA] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Slot
            </button>
          </div>
        )}
      </div>

      {/* Empty / Partial States */}
      {filledSlots.length === 0 && (
        <div className="text-center text-[#71717A] italic py-20 border-t border-white/[0.06]">
          Use the search slots above to select {compareType}s to compare.
        </div>
      )}
      
      {filledSlots.length === 1 && (
        <div className="text-center text-[#71717A] italic py-20 border-t border-white/[0.06]">
          Select a second {compareType} to compare &rarr;
        </div>
      )}

      {/* Data Table */}
      {filledSlots.length >= 2 && (
        <CompareTable type={compareType} entityIds={filledSlots} />
      )}
      
    </div>
  );
}
