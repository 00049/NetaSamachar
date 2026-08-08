import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FilterControls } from '@/components/politicians/FilterControls';
import { X } from 'lucide-react';

export function FilterDrawer(props: any) {
  const { isOpen, onClose } = props;
  const shouldReduceMotion = useReducedMotion();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={shouldReduceMotion ? { y: 0, opacity: 0 } : { y: '100%' }}
            animate={shouldReduceMotion ? { y: 0, opacity: 1 } : { y: 0 }}
            exit={shouldReduceMotion ? { y: 0, opacity: 0 } : { y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-[101] flex flex-col bg-[var(--bg-base)] rounded-t-3xl border-t border-white/10 max-h-[90vh] lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          >
            {/* Handle & Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/10 shrink-0">
              <div className="text-[14px] font-bold text-white tracking-wide uppercase">Filters & Discover</div>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto hide-scrollbar flex-1">
              <FilterControls {...props} />
            </div>

            {/* Sticky Footer */}
            <div className="p-4 border-t border-white/10 shrink-0 bg-[var(--bg-base)] safe-area-bottom">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[var(--bg-base)] font-bold tracking-widest text-[13px] uppercase transition-colors"
              >
                View Results
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
