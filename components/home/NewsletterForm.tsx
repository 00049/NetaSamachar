/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success' | 'unavailable'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    // Honest message: backend not ready yet
    setStatus('unavailable' as any);
  };

  return (
    <div className="w-full relative z-10 p-8 md:p-10 bg-white/[0.02] border border-white/5 rounded-2xl mb-16">
      <AnimatePresence mode="wait">
        {status === 'unavailable' ? (
          <motion.div
            key="unavailable"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 h-[52px]"
          >
            <span className="text-[var(--color-text-secondary)] font-bold tracking-wide text-sm">Our newsletter is launching soon! Check back later.</span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
            onSubmit={handleSubmit}
          >
            <div className="text-[var(--color-text-secondary)] font-medium text-sm flex-shrink-0">
              Get weekly promise-tracking updates
            </div>
            <div className="flex flex-1 w-full md:max-w-md gap-3 relative">
              <input
                type="text"
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                className={`flex-1 h-[48px] bg-[var(--color-raised)] border rounded-xl px-[16px] text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none transition-all duration-200 focus:border-[var(--color-text-primary)] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)] ${
                  status === 'error' ? 'border-[var(--color-accent-negative)]' : 'border-[var(--color-border-subtle)]'
                }`}
              />
              <button
                type="submit"
                className="h-[48px] px-6 bg-[var(--color-text-primary)] text-black rounded-xl font-bold uppercase tracking-wider text-[12px] hover:bg-[#E8E6E0] transition-colors flex-shrink-0"
              >
                Subscribe
              </button>
              {status === 'error' && (
                <div className="absolute top-[52px] left-0 text-[var(--color-accent-negative)] text-[11px] font-medium">
                  Please enter a valid email address.
                </div>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
