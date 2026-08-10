'use client';

import { useMemo } from 'react';
import { POLITICIANS, PARTIES } from '@/data/politicians';
import { PROMISES } from '@/data/promises';
import { aggregateStats } from '@/lib/aggregation';
import { CompareType } from './CompareBuilder';
import { useSearchCache } from '@/lib/useSearchCache';
import { CheckCircle2 } from 'lucide-react';
import { METRICS_REGISTRY, MetricDefinition } from '@/lib/metrics';
import { motion, useReducedMotion } from 'framer-motion';

interface CompareTableProps {
  type: CompareType;
  entityIds: string[];
}

// Per-slot accent colors — same 4 as before
const SLOT_COLORS = ['#E6B16A', '#6C8FD1', '#3FA76A', '#B98A6B'];

export function CompareTable({ type, entityIds }: CompareTableProps) {
  const hasDuplicates = new Set(entityIds).size !== entityIds.length;
  const cache         = useSearchCache<any>('aggregateStats');
  const shouldReduceMotion = useReducedMotion();

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
      let photoUrl = '';
      let partyName = '';

      if (type === 'party') {
        const party = PARTIES.find(p => p.id === id);
        name       = party?.name || id;
        shortName  = party?.abbreviation || id;
        partyName  = 'Party';
        matchedPoliticians = POLITICIANS.filter(p => p.partyId === id);
        matchedPromises    = PROMISES.filter(p => p.partyId === id);
      } else if (type === 'state') {
        const stateName = Array.from(new Set(POLITICIANS.map(p => p.state)))
          .find(s => s.toLowerCase().replace(/\s+/g, '-') === id);
        name      = stateName || id;
        shortName = name;
        partyName = 'State';
        matchedPoliticians = POLITICIANS.filter(p => p.state === stateName);
        matchedPromises    = PROMISES.filter(p => p.state === stateName);
      } else if (type === 'constituency') {
        const constName = Array.from(new Set(POLITICIANS.map(p => p.constituency)))
          .find(c => c.toLowerCase().replace(/\s+/g, '-') === id);
        name      = constName || id;
        shortName = name;
        partyName = 'Constituency';
        matchedPoliticians = POLITICIANS.filter(p => p.constituency === constName);
        const polIds = new Set(matchedPoliticians.map(p => p.id));
        matchedPromises = PROMISES.filter(p => polIds.has(p.politicianId));
      } else if (type === 'politician') {
        const pol = POLITICIANS.find(p => p.id === id);
        name      = pol?.name || id;
        shortName = name.split(' ').slice(-1)[0];
        photoUrl  = pol?.photoUrl || '';
        partyName = PARTIES.find(p => p.id === pol?.partyId)?.abbreviation || '';
        if (pol) matchedPoliticians = [pol];
        matchedPromises = PROMISES.filter(p => p.politicianId === id);
      }

      const result = {
        id, name, shortName, photoUrl, partyName,
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
    METRICS_REGISTRY.totalPromises,
    METRICS_REGISTRY.avgFulfillment,
    METRICS_REGISTRY.avgAttendance,
    METRICS_REGISTRY.avgNetAssets,
    METRICS_REGISTRY.totalCases,
  ];

  const fmtVal = (metric: MetricDefinition, v: number) =>
    metric.format ? metric.format(v) : metric.isPercentage ? `${v}%` : String(v ?? 0);

  // Who leads each metric
  const getLeader = (metric: MetricDefinition) => {
    if (metric.polarity === 'context_only') {
      return columnsData.map(() => false);
    }
    const vals = columnsData.map(c => c.stats[metric.id as keyof typeof c.stats] as number ?? 0);
    const best = metric.polarity === 'lower_is_better' ? Math.min(...vals) : Math.max(...vals);
    return vals.map(v => (v === best && vals.filter(x => x === best).length < vals.length));
  };

  return (
    <div className="border-t border-[var(--border-subtle)]">
      {/* ── TOOLBAR ─────────────────────────────────── */}
      <div className="sticky top-[80px] z-40 bg-[var(--bg-base)] border-b border-[var(--border-subtle)]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-end">
          <button
            onClick={() => window.print()}
            className="text-[12px] font-medium text-[var(--text-tertiary)] hover:text-white transition-colors"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-10">
        <div className="overflow-x-auto relative scrollbar-hide">
          <table className="w-full border-collapse">
            <thead className="sticky top-[133px] z-30 bg-[var(--bg-base)]">
              <tr>
                <th className="sticky left-0 z-40 bg-[var(--bg-base)] text-left pb-6 pr-6 text-[11px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] min-w-[160px] align-bottom border-b border-[var(--border-subtle)]">
                  Metric
                </th>
                {columnsData.map(col => (
                  <th
                    key={col.id}
                    className="text-center pb-6 px-4 min-w-[140px] align-bottom border-b border-[var(--border-subtle)]"
                  >
                    <div className="flex flex-col items-center gap-3">
                      {col.photoUrl ? (
                        <img 
                          src={col.photoUrl} 
                          alt={col.name} 
                          className="w-[56px] h-[56px] rounded-[var(--radius-sm)] object-cover" 
                          style={{ border: `2px solid ${col.color}44` }} 
                        />
                      ) : (
                        <div
                          className="w-[56px] h-[56px] rounded-[var(--radius-sm)] flex items-center justify-center text-[16px] font-black text-white flex-shrink-0"
                          style={{ backgroundColor: col.color + '22', border: `2px solid ${col.color}44` }}
                        >
                          <span style={{ color: col.color }}>{col.initials}</span>
                        </div>
                      )}
                      <div className="min-w-0 flex flex-col items-center">
                        <div className="text-[14px] font-bold truncate" style={{ color: col.color }}>{col.shortName}</div>
                        {col.partyName && <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-semibold mt-0.5">{col.partyName}</div>}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, mIdx) => {
                const vals    = columnsData.map(c => (c.stats[metric.id as keyof typeof c.stats] as number) ?? 0);
                const leaders = getLeader(metric);
                const max     = Math.max(...vals);
                const barMax  = max > 0 ? max : 1;
                const isContext = metric.polarity === 'context_only';

                return (
                  <tr
                    key={metric.id}
                    className="group"
                  >
                    <td className="sticky left-0 z-20 bg-[var(--bg-base)] py-6 pr-6 text-[13px] font-medium text-[var(--text-tertiary)] border-b border-[var(--border-subtle)] group-hover:bg-white/[0.02] transition-colors">
                      {metric.label}
                    </td>
                    {columnsData.map((col, idx) => {
                      const val      = vals[idx] ?? 0;
                      const isLeader = leaders[idx];
                      
                      let barPct = metric.isPercentage ? val : (val / barMax) * 100;
                      if (!metric.isPercentage && metric.polarity === 'lower_is_better') {
                        barPct = ((barMax - val) / barMax) * 100;
                      }

                      return (
                        <td 
                          key={col.id} 
                          className="py-6 px-4 text-center border-b border-[var(--border-subtle)] relative transition-colors"
                          style={{ 
                            backgroundColor: isLeader && !isContext ? `${col.color}15` : undefined 
                          }}
                        >
                          <div className="flex flex-col items-center gap-2.5">
                            <div className="flex items-center gap-1.5 justify-center min-h-[24px]">
                              {isLeader && !isContext && (
                                <motion.div
                                  initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: shouldReduceMotion ? 0 : 0.6, type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                  <CheckCircle2 className="w-[14px] h-[14px]" style={{ color: col.color }} aria-label="Winner" />
                                </motion.div>
                              )}
                              <span
                                className={`text-[16px] tracking-tight ${
                                  isLeader && !isContext ? 'font-black text-white'
                                  : 'font-semibold text-[var(--text-secondary)]'
                                }`}
                              >
                                {fmtVal(metric, val)}
                              </span>
                            </div>
                            <div className="w-full max-w-[80px] h-[4px] bg-white/5 rounded-full overflow-hidden mx-auto">
                              <motion.div
                                className="h-full rounded-full"
                                initial={{ width: shouldReduceMotion ? `${Math.min(Math.max(barPct, 0), 100)}%` : 0 }}
                                whileInView={{ width: `${Math.min(Math.max(barPct, 0), 100)}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: "easeOut" }}
                                style={{
                                  backgroundColor: col.color,
                                  opacity: isLeader && !isContext ? 1 : 0.3
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Data footnote */}
        <p className="mt-10 text-[11px] text-[var(--text-tertiary)] leading-relaxed pt-6 border-t border-[var(--border-subtle)] text-center">
          All statistics aggregated from primary source affidavit data and verified parliamentary records.<br/>
          <span className="opacity-70">Fulfillment % = promises fulfilled ÷ total tracked promises. Attendance % = self-reported from parliamentary records.</span>
        </p>
      </div>
    </div>
  );
}
