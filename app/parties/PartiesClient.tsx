'use client';

import { useState, useMemo } from 'react';
import { ArrowRight, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Party } from '@/lib/types';
import { PartyCard } from '@/components/parties/PartyCard';
import { motion } from 'framer-motion';

type SortKey = 'alpha' | 'politicians' | 'founded';
type FilterKey = 'all' | 'national' | 'regional';


const FILTER_OPTIONS: { id: FilterKey; label: string }[] = [
  { id: 'all',      label: 'All Parties' },
  { id: 'national', label: 'National' },
  { id: 'regional', label: 'Regional' },
];

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'politicians', label: 'Politicians ↓' },
  { id: 'alpha',       label: 'A – Z' },
  { id: 'founded',     label: 'Founded' },
];

interface PartiesClientProps {
  initialParties: (Party & { _count: { politicians: number } })[];
}

export function PartiesClient({ initialParties }: PartiesClientProps) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sort, setSort]     = useState<SortKey>('politicians');

  const totalPoliticians = useMemo(() => {
    return initialParties.reduce((sum, party) => sum + party._count.politicians, 0);
  }, [initialParties]);

  const parties = useMemo(() => {
    let list = [...initialParties];

    if (filter === 'national') list = list.filter(p => p.isNational);
    if (filter === 'regional') list = list.filter(p => !p.isNational);

    list.sort((a, b) => {
      if (sort === 'alpha')       return a.name.localeCompare(b.name);
      if (sort === 'politicians') return b._count.politicians - a._count.politicians;
      if (sort === 'founded')     return a.founded - b.founded;
      return 0;
    });

    return list;
  }, [filter, sort, initialParties]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">

      {/* ── PAGE HEADER ──────────────────────────────── */}
      <div className="pt-[100px] pb-12 border-b border-[var(--border-subtle)]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <Breadcrumbs items={[{ label: 'Political Parties' }]} />

          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-[var(--border-subtle)]" aria-hidden="true" />
                Party Registry
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-3">
                Political Parties
              </h1>
              <p className="text-[var(--text-tertiary)] text-base max-w-xl leading-relaxed">
                {initialParties.length} parties represented in the dataset — politician counts,
                ideology, and founding year sourced from declared affidavit data.
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[40px] font-black text-white leading-none">
                {totalPoliticians}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mt-1">
                Total Politicians Tracked
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTROLS BAR ─────────────────────────────── */}
      <div className="sticky top-[80px] z-30 bg-[var(--bg-base)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          {/* Filter pills */}
          <div className="flex items-center gap-2" role="group" aria-label="Filter parties by type">
            {FILTER_OPTIONS.map(opt => {
              const isActive = filter === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setFilter(opt.id)}
                  aria-pressed={isActive}
                  className={`relative px-4 py-2 rounded-full text-[13px] font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'text-black'
                      : 'text-[var(--text-tertiary)] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="partyFilterBackground"
                      className="absolute inset-0 bg-white rounded-full z-0"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-10 pl-10 pr-8 rounded-xl bg-[var(--color-panel,rgba(255,255,255,0.05))] border border-white/10 text-white text-[13px] font-bold outline-none appearance-none cursor-pointer hover:border-white/20 transition-colors"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-white/40" />
            </div>
          </div>
        </div>
      </div>

      {/* ── PARTY GRID ───────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-10">
        {parties.length === 0 ? (
          <div className="py-24 text-center text-[var(--text-tertiary)] font-serif italic text-lg border border-white/5 rounded-2xl">
            No parties match the selected filter.
          </div>
        ) : (
          <div className={`grid gap-6 ${
            parties.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
            parties.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto' :
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {parties.map(party => (
              <PartyCard key={party.id} party={party} />
            ))}
          </div>
        )}

        {/* Dataset footnote */}
        <p className="mt-12 text-center text-[11px] text-[var(--text-tertiary)] leading-relaxed max-w-xl mx-auto">
          Politician counts reflect only politicians currently indexed in the Neta Samachar dataset.
          National / Regional classification follows Election Commission of India recognition status.
        </p>
      </div>
    </div>
  );
}
