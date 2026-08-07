'use client';

import { useMemo, useState } from 'react';
import { POLITICIANS, PARTIES } from '@/data/politicians';
import { PROMISES } from '@/data/promises';
import { aggregateStats } from '@/lib/aggregation';
import { CompareType } from './CompareBuilder';
import { useSearchCache } from '@/lib/useSearchCache';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CompareTableProps {
  type: CompareType;
  entityIds: string[];
}

// Per-slot accent colors — same 4 as before
const SLOT_COLORS = ['#E6B16A', '#6C8FD1', '#3FA76A', '#B98A6B'];

export function CompareTable({ type, entityIds }: CompareTableProps) {
  const [currentView, setCurrentView] = useState<'executive' | 'detailed'>('executive');

  const hasDuplicates = new Set(entityIds).size !== entityIds.length;
  const cache         = useSearchCache<any>('aggregateStats');

  const columnsData = useMemo(() => {
    if (hasDuplicates) return [];
    return entityIds.map((id, index) => {
      const cacheKey = `${type}:${id}`;
      const cached   = cache.get(cacheKey);
      if (cached) return { ...cached, color: SLOT_COLORS[index] };

      let matchedPoliticians: typeof POLITICIANS = [];
      let matchedPromises: typeof PROMISES = [];
      let name = '';
      let shortName = '';

      if (type === 'party') {
        const party = PARTIES.find(p => p.id === id);
        name       = party?.name || id;
        shortName  = party?.abbreviation || id;
        matchedPoliticians = POLITICIANS.filter(p => p.partyId === id);
        matchedPromises    = PROMISES.filter(p => p.partyId === id);
      } else if (type === 'state') {
        const stateName = Array.from(new Set(POLITICIANS.map(p => p.state)))
          .find(s => s.toLowerCase().replace(/\s+/g, '-') === id);
        name      = stateName || id;
        shortName = name;
        matchedPoliticians = POLITICIANS.filter(p => p.state === stateName);
        matchedPromises    = PROMISES.filter(p => p.state === stateName);
      } else if (type === 'constituency') {
        const constName = Array.from(new Set(POLITICIANS.map(p => p.constituency)))
          .find(c => c.toLowerCase().replace(/\s+/g, '-') === id);
        name      = constName || id;
        shortName = name;
        matchedPoliticians = POLITICIANS.filter(p => p.constituency === constName);
        const polIds = new Set(matchedPoliticians.map(p => p.id));
        matchedPromises = PROMISES.filter(p => polIds.has(p.politicianId));
      } else if (type === 'politician') {
        const pol = POLITICIANS.find(p => p.id === id);
        name      = pol?.name || id;
        shortName = name.split(' ').slice(-1)[0];
        if (pol) matchedPoliticians = [pol];
        matchedPromises = PROMISES.filter(p => p.politicianId === id);
      }

      const result = {
        id, name, shortName,
        stats: aggregateStats(matchedPoliticians, matchedPromises),
        color: SLOT_COLORS[index],
        initials: name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
      };
      cache.set(cacheKey, result);
      return result;
    });
  }, [type, entityIds, cache, hasDuplicates]);

  if (hasDuplicates) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-12">
        <div className="premium-card p-8 text-center text-[var(--text-tertiary)]">
          You have selected the same {type} twice — choose a different one to see a comparison.
        </div>
      </div>
    );
  }

  if (columnsData.length < 2) return null;

  const metrics = [
    { label: 'Promises Tracked',  key: 'totalPromises',  isPercentage: false, invertColor: false, format: null },
    { label: 'Fulfillment',       key: 'avgFulfillment', isPercentage: true,  invertColor: false, format: null },
    { label: 'Attendance',        key: 'avgAttendance',  isPercentage: true,  invertColor: false, format: null },
    { label: 'Net Assets',        key: 'avgNetAssets',   isPercentage: false, invertColor: false,
      format: (v: number) => `₹${(v / 10000000).toFixed(1)} Cr` },
    { label: 'Legal Cases',       key: 'totalCases',     isPercentage: false, invertColor: true,  format: null },
  ];

  const fmtVal = (metric: typeof metrics[0], v: number) =>
    metric.format ? metric.format(v) : metric.isPercentage ? `${v}%` : String(v ?? 0);

  // Who leads each metric
  const getLeader = (metric: typeof metrics[0]) => {
    const vals = columnsData.map(c => c.stats[metric.key as keyof typeof c.stats] as number ?? 0);
    const best = metric.invertColor ? Math.min(...vals) : Math.max(...vals);
    return vals.map(v => (v === best && vals.filter(x => x === best).length < vals.length));
  };

  return (
    <div className="border-t border-[var(--border-subtle)]">
      {/* ── TOOLBAR ─────────────────────────────────── */}
      <div className="sticky top-[80px] z-30 bg-[var(--bg-base)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2" role="group" aria-label="Switch comparison view">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-tertiary)] mr-2">View:</span>
            {(['executive', 'detailed'] as const).map(v => (
              <button
                key={v}
                onClick={() => setCurrentView(v)}
                aria-pressed={currentView === v}
                className={`px-4 py-2 rounded-full text-[12px] font-semibold capitalize transition-all duration-200 ${
                  currentView === v
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-[var(--text-tertiary)] hover:bg-white/10 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            onClick={() => window.print()}
            className="text-[12px] font-medium text-[var(--text-tertiary)] hover:text-white transition-colors"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-10">

        {/* ── ENTITY COLUMN HEADERS ──────────────────── */}
        <div className="grid gap-4 mb-10"
          style={{ gridTemplateColumns: `repeat(${columnsData.length}, 1fr)` }}
        >
          {columnsData.map(col => (
            <div key={col.id} className="premium-card p-5 flex items-center gap-4">
              <div
                className="w-[48px] h-[48px] rounded-[var(--radius-sm)] flex items-center justify-center text-[13px] font-black text-white flex-shrink-0"
                style={{ backgroundColor: col.color + '22', border: `1.5px solid ${col.color}44` }}
              >
                <span style={{ color: col.color }}>{col.initials}</span>
              </div>
              <div className="min-w-0">
                <div className="text-[16px] font-bold text-white truncate">{col.name}</div>
                <div className="text-[11px] text-[var(--text-tertiary)] truncate capitalize">{type}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── EXECUTIVE VIEW ─────────────────────────── */}
        {currentView === 'executive' && (
          <div className="space-y-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[var(--border-subtle)]" aria-hidden="true" />
              Executive Summary — Key Metrics
            </div>

            {metrics.map(metric => {
              const vals    = columnsData.map(c => (c.stats[metric.key as keyof typeof c.stats] as number) ?? 0);
              const leaders = getLeader(metric);
              const max     = Math.max(...vals);
              const barMax  = max > 0 ? max : 1;

              return (
                <div key={metric.key} className="premium-card p-5">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-4">
                    {metric.label}
                  </div>
                  <div className="space-y-3">
                    {columnsData.map((col, idx) => {
                      const val      = (vals[idx] ?? 0);
                      const isLeader = leaders[idx];
                      const barPct   = metric.isPercentage ? val : (val / barMax) * 100;

                      return (
                        <div key={col.id} className="flex items-center gap-4">
                          <div className="w-[80px] text-[12px] font-semibold text-white truncate flex-shrink-0">
                            {col.shortName}
                          </div>
                          <div className="flex-1 h-[6px] bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${Math.min(barPct, 100)}%`,
                                backgroundColor: col.color,
                              }}
                            />
                          </div>
                          <div className="w-[80px] text-right flex items-center justify-end gap-1.5 flex-shrink-0">
                            <span className="text-[13px] font-black" style={{ color: col.color }}>
                              {fmtVal(metric, val)}
                            </span>
                            {isLeader ? (
                              <TrendingUp className="w-[12px] h-[12px] text-[var(--color-accent-positive)]" aria-label="Leads this metric" />
                            ) : val === Math.min(...vals) && max !== Math.min(...vals) ? (
                              <TrendingDown className="w-[12px] h-[12px] text-[var(--color-accent-negative)]" aria-label="Lowest on this metric" />
                            ) : (
                              <Minus className="w-[12px] h-[12px] text-[var(--text-tertiary)]" aria-hidden="true" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── DETAILED VIEW — comparison table ───────── */}
        {currentView === 'detailed' && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[var(--border-subtle)]" aria-hidden="true" />
              Detailed Comparison Table
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="text-left pb-4 pr-6 text-[11px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] w-[160px]">
                      Metric
                    </th>
                    {columnsData.map(col => (
                      <th
                        key={col.id}
                        className="text-right pb-4 px-4 text-[13px] font-bold"
                        style={{ color: col.color }}
                      >
                        {col.shortName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric, mIdx) => {
                    const vals    = columnsData.map(c => (c.stats[metric.key as keyof typeof c.stats] as number) ?? 0);
                    const leaders = getLeader(metric);

                    return (
                      <tr
                        key={metric.key}
                        className={`border-b border-[var(--border-subtle)] ${mIdx % 2 === 0 ? 'bg-white/[0.01]' : ''}`}
                      >
                        <td className="py-4 pr-6 text-[13px] font-medium text-[var(--text-tertiary)]">
                          {metric.label}
                        </td>
                        {columnsData.map((col, idx) => {
                          const val      = vals[idx] ?? 0;
                          const isLeader = leaders[idx];
                          const isLowest = val === Math.min(...vals) && Math.max(...vals) !== Math.min(...vals);

                          return (
                            <td key={col.id} className="py-4 px-4 text-right">
                              <span
                                className={`text-[14px] font-black ${
                                  isLeader ? 'text-[var(--color-accent-positive)]'
                                  : isLowest ? 'text-[var(--color-accent-negative)]'
                                  : 'text-white'
                                }`}
                              >
                                {fmtVal(metric, val)}
                              </span>
                              {isLeader && (
                                <span className="ml-1.5 text-[9px] font-black uppercase tracking-wider text-[var(--color-accent-positive)]">
                                  HIGH
                                </span>
                              )}
                              {isLowest && (
                                <span className="ml-1.5 text-[9px] font-black uppercase tracking-wider text-[var(--color-accent-negative)]">
                                  LOW
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-[11px] text-[var(--text-tertiary)]">
              <strong className="text-white">Legend —</strong>{' '}
              <span className="text-[var(--color-accent-positive)]">GREEN HIGH</span> = best performer ·{' '}
              <span className="text-[var(--color-accent-negative)]">RED LOW</span> = lowest performer.
              For Legal Cases, lower is better.
            </p>
          </div>
        )}

        {/* Data footnote */}
        <p className="mt-10 text-[11px] text-[var(--text-tertiary)] leading-relaxed border-t border-[var(--border-subtle)] pt-6">
          All statistics aggregated from primary source affidavit data and verified parliamentary records.
          Fulfillment % = promises fulfilled ÷ total tracked promises.
          Attendance % = self-reported from parliamentary records.
        </p>
      </div>
    </div>
  );
}
