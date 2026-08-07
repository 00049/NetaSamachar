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
    <div className="w-full relative z-10 py-6 border-b border-[var(--border-subtle)] mb-12">
      <AnimatePresence mode="wait">
        {status === 'unavailable' ? (
          <motion.div
            key="unavailable"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 h-[52px]"
          >
            <span className="text-[var(--text-secondary)] font-bold tracking-wide text-sm">Our newsletter is launching soon! Check back later.</span>
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
            <div className="text-[var(--text-secondary)] font-medium text-sm flex-shrink-0">
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
                className={`flex-1 h-[48px] bg-[var(--bg-card)] border rounded-[var(--radius-soft)] px-[16px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none transition-all duration-200 focus:border-[var(--text-primary)] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)] ${
                  status === 'error' ? 'border-[var(--accent-negative)]' : 'border-[var(--border-subtle)]'
                }`}
              />
              <button
                type="submit"
                className="h-[48px] px-6 bg-[var(--text-primary)] text-black rounded-[var(--radius-soft)] font-bold uppercase tracking-wider text-[12px] hover:bg-[#E8E6E0] transition-colors flex-shrink-0"
              >
                Subscribe
              </button>
              {status === 'error' && (
                <div className="absolute top-[52px] left-0 text-[var(--accent-negative)] text-[11px] font-medium">
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
