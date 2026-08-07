'use client';

import { useState, useMemo } from 'react';
import { PARTIES, POLITICIANS } from '@/data/politicians';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

type SortKey = 'alpha' | 'politicians' | 'founded';
type FilterKey = 'all' | 'national' | 'regional';

// National vs Regional classification based on ECI recognition
const NATIONAL_PARTY_IDS = new Set(['bjp', 'inc', 'cpi-m', 'aap']);

const IDEOLOGY_TAGS: Record<string, string[]> = {
  bjp:     ['Conservative', 'Hindu nationalism'],
  inc:     ['Social democracy', 'Secularism'],
  'cpi-m': ['Communism', 'Marxist'],
  aap:     ['Anti-corruption', 'Populism'],
  jdu:     ['Socialism', 'Secularism'],
  rjd:     ['Social justice', 'Regional'],
  ss:      ['Hindutva', 'Regionalism'],
  agp:     ['Regionalism', 'Assamese'],
  jsp:     ['Anti-corruption', 'Governance'],
};

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

export default function PartiesPage() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sort, setSort]     = useState<SortKey>('politicians');

  // Pre-compute politician counts per party from real data
  const politicianCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of POLITICIANS) {
      counts[p.partyId] = (counts[p.partyId] || 0) + 1;
    }
    return counts;
  }, []);

  const parties = useMemo(() => {
    let list = [...PARTIES];

    if (filter === 'national') list = list.filter(p => NATIONAL_PARTY_IDS.has(p.id));
    if (filter === 'regional') list = list.filter(p => !NATIONAL_PARTY_IDS.has(p.id));

    list.sort((a, b) => {
      if (sort === 'alpha')       return a.name.localeCompare(b.name);
      if (sort === 'politicians') return (politicianCounts[b.id] || 0) - (politicianCounts[a.id] || 0);
      if (sort === 'founded')     return a.founded - b.founded;
      return 0;
    });

    return list;
  }, [filter, sort, politicianCounts]);

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
                {PARTIES.length} parties represented in the dataset — politician counts,
                ideology, and founding year sourced from declared affidavit data.
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[40px] font-black text-white leading-none">
                {POLITICIANS.length}
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
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setFilter(opt.id)}
                aria-pressed={filter === opt.id}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                  filter === opt.id
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-[var(--text-tertiary)] hover:bg-white/10 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort buttons */}
          <div className="flex items-center gap-2" role="group" aria-label="Sort parties">
            <span className="text-[11px] uppercase tracking-widest font-bold text-[var(--text-tertiary)] mr-1">Sort:</span>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSort(opt.id)}
                aria-pressed={sort === opt.id}
                className={`px-3 py-1.5 rounded text-[12px] font-medium transition-all duration-200 ${
                  sort === opt.id
                    ? 'bg-white/10 text-white ring-1 ring-white/20'
                    : 'text-[var(--text-tertiary)] hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {parties.map(party => {
              const count    = politicianCounts[party.id] || 0;
              const isNatl   = NATIONAL_PARTY_IDS.has(party.id);
              const tags     = IDEOLOGY_TAGS[party.id] || [];
              const abbr     = party.abbreviation.slice(0, 4);
              const glowHex  = party.color;

              return (
                <Link
                  key={party.id}
                  href={`/parties/${party.id}`}
                  className="group premium-card p-6 flex flex-col gap-5 hover:border-white/20 transition-all duration-300"
                  style={{ '--tw-shadow-colored': glowHex } as React.CSSProperties}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      `0 0 0 1px ${glowHex}22, 0 8px 32px ${glowHex}18`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '';
                  }}
                >
                  {/* Top: monogram + name */}
                  <div className="flex items-start gap-4">
                    {/* Typographic monogram — party color coded, no placeholder "Logo" */}
                    <div
                      className="w-[56px] h-[56px] rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                      style={{
                        backgroundColor: glowHex + '1A',
                        border: `1.5px solid ${glowHex}44`,
                      }}
                      aria-hidden="true"
                    >
                      <span
                        className="font-black text-[11px] text-center leading-tight px-0.5"
                        style={{ color: glowHex }}
                      >
                        {abbr}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                          style={{ color: glowHex, backgroundColor: glowHex + '18' }}
                        >
                          {isNatl ? 'National' : 'Regional'}
                        </span>
                        <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                          Est.&nbsp;{party.founded}
                        </span>
                      </div>
                      <h2 className="text-white font-bold text-[15px] leading-snug group-hover:text-[var(--color-accent-positive)] transition-colors duration-200 line-clamp-2">
                        {party.name}
                      </h2>
                    </div>
                  </div>

                  {/* Ideology tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2 py-0.5 bg-white/5 text-[var(--text-tertiary)] rounded-full border border-white/[0.08]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats row */}
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-[28px] font-black text-[var(--color-accent-positive)] leading-none">
                        {count > 0 ? count : '—'}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mt-0.5">
                        {count === 1 ? 'Politician' : 'Politicians'} Tracked
                      </div>
                    </div>
                    <ArrowRight
                      className="w-[18px] h-[18px] text-[var(--text-tertiary)] group-hover:text-white group-hover:translate-x-1 transition-all duration-200"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              );
            })}
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
