'use client';

import { Politician } from '@/lib/types';
import { PARTIES } from '@/data/politicians';
import { formatCurrency, getPromiseFulfillmentRate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import Link from 'next/link';

interface Props {
  politician: Politician | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PoliticianDrawer({ politician, isOpen, onClose }: Props) {
  if (!politician) return null;

  const party = PARTIES.find(p => p.id === politician.partyId);
  const fulfillmentRate = getPromiseFulfillmentRate(politician.promisesFulfilled, politician.promisesTotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-[var(--bg-base)] border-l border-[var(--border-subtle)] shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-base)]">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
                Dossier Preview
              </div>
              <button onClick={onClose} className="p-2 hover:bg-[var(--border-subtle)] transition-colors">
                <X className="w-5 h-5 text-[var(--text-primary)]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="flex items-start gap-6 mb-8">
                <Avatar 
                  photoUrl={politician.photoUrl} 
                  name={politician.name} 
                  size={80} 
                />
                <div>
                  <h2 className="font-serif text-3xl font-black text-[var(--text-primary)] mb-1">
                    {politician.name}
                  </h2>
                  <div className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] font-bold mb-3">
                    {party?.name} • {politician.constituency}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-12">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">Fulfillment</div>
                  <div className="font-mono text-3xl font-black text-[var(--text-primary)]">{fulfillmentRate}%</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">Attendance</div>
                  <div className="font-mono text-3xl font-black text-[var(--text-primary)]">{politician.attendancePercent}%</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">Declared Assets</div>
                  <div className="font-mono text-3xl font-black text-[var(--text-primary)]">{formatCurrency(politician.latestNetWorth)}</div>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-3 border-b border-[var(--border-subtle)] pb-2">
                  Legal Risk Profile
                </div>
                {politician.criminalCases.length > 0 ? (
                  <ul className="space-y-4">
                    {politician.criminalCases.map((c, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${c.severity === 'heinous' ? 'bg-[var(--accent-negative)]' : 'bg-[var(--accent-warning)]'}`} />
                        <div>
                          <div className="font-bold text-sm text-[var(--text-primary)]">{c.chargeDescription}</div>
                          <div className="text-xs text-[var(--text-tertiary)]">IPC Section {c.section} • {c.status}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm font-bold text-[var(--accent-positive)] uppercase tracking-wider">
                    Zero Pending Cases Declared
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-base)]">
              <Link 
                href={`/politicians/${politician.id}`}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--text-primary)] text-[var(--bg-base)] text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Access Full Dossier <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
