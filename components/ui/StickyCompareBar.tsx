'use client';

import { useSelection } from './CheckboxSelectionProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, X } from 'lucide-react';
import { POLITICIANS, PARTIES } from '@/data/politicians';

export function StickyCompareBar() {
  const selection = useSelection();
  const router = useRouter();

  if (!selection || selection.selectedIds.length < 2) return null;
  const { selectedIds, type, clearSelection } = selection;

  // Derive names for display
  const names = selectedIds.map(id => {
    if (type === 'party') return PARTIES.find(p => p.id === id)?.abbreviation || id;
    if (type === 'politician') return POLITICIANS.find(p => p.id === id)?.name || id;
    if (type === 'state') {
      const stateName = Array.from(new Set(POLITICIANS.map(p => p.state))).find(s => s.toLowerCase().replace(/\s+/g, '-') === id);
      return stateName || id;
    }
    return id;
  });

  const handleCompare = () => {
    const params = new URLSearchParams();
    params.set('type', type);
    params.set('a', selectedIds[0]);
    params.set('b', selectedIds[1]);
    if (selectedIds[2]) params.set('c', selectedIds[2]);
    router.push(`/compare?${params.toString()}`);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
        className="fixed bottom-0 left-0 right-0 h-[64px] bg-[#18181B] border-t border-white/[0.1] shadow-2xl z-50 flex items-center justify-center px-6"
      >
        <div className="flex items-center justify-between w-full max-w-[920px]">
          <div className="flex items-center gap-4">
            <button onClick={clearSelection} className="p-1 hover:bg-white/[0.1] rounded-full text-[#A1A1AA] hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="text-sm font-semibold text-white flex gap-1">
              Selected: <span className="text-[#A1A1AA] ml-1">{names.join(' vs ')}</span>
            </div>
          </div>
          
          <button 
            onClick={handleCompare}
            className="flex items-center text-xs font-bold uppercase tracking-wider bg-white text-black px-6 py-2 rounded hover:bg-black/80 transition-colors"
          >
            Compare {names.length} {type}s <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
