'use client';

import { useMemo } from 'react';
import { POLITICIANS, PARTIES } from '@/data/politicians';
import { PROMISES } from '@/data/promises';
import { aggregateStats } from '@/lib/aggregation';
import { CompareType } from './CompareBuilder';
import { Info, ExternalLink } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import Link from 'next/link';

interface CompareTableProps {
  type: CompareType;
  entityIds: string[];
}

export function CompareTable({ type, entityIds }: CompareTableProps) {
  // Defense-in-depth: Duplicate entity check
  const hasDuplicates = new Set(entityIds).size !== entityIds.length;
  if (hasDuplicates) {
    return (
      <div className="mt-12 text-center text-[#71717A] italic py-20 bg-white/[0.02] border border-white/[0.06] rounded-xl">
        You've selected the same {type} twice — choose a different one in Slot B to see a comparison.
      </div>
    );
  }

  // Aggregate data for each slot based on type
  const columnsData = useMemo(() => {
    return entityIds.map(id => {
      let matchedPoliticians: typeof POLITICIANS = [];
      let matchedPromises: typeof PROMISES = [];
      let name = '';
      
      if (type === 'party') {
        const party = PARTIES.find(p => p.id === id);
        name = party?.name || id;
        matchedPoliticians = POLITICIANS.filter(p => p.partyId === id);
        matchedPromises = PROMISES.filter(p => p.partyId === id);
      } else if (type === 'state') {
        const stateName = Array.from(new Set(POLITICIANS.map(p => p.state))).find(s => s.toLowerCase().replace(/\s+/g, '-') === id);
        name = stateName || id;
        matchedPoliticians = POLITICIANS.filter(p => p.state === stateName);
        matchedPromises = PROMISES.filter(p => p.state === stateName);
      } else if (type === 'constituency') {
        const constName = Array.from(new Set(POLITICIANS.map(p => p.constituency))).find(c => c.toLowerCase().replace(/\s+/g, '-') === id);
        name = constName || id;
        matchedPoliticians = POLITICIANS.filter(p => p.constituency === constName);
        
        const polIds = new Set(matchedPoliticians.map(p => p.id));
        matchedPromises = PROMISES.filter(p => polIds.has(p.politicianId));
      } else if (type === 'politician') {
        const pol = POLITICIANS.find(p => p.id === id);
        name = pol?.name || id;
        if (pol) matchedPoliticians = [pol];
        matchedPromises = PROMISES.filter(p => p.politicianId === id);
      }

      return {
        id,
        name,
        stats: aggregateStats(matchedPoliticians, matchedPromises),
      };
    });
  }, [type, entityIds]);

  // Check sample sizes (total promises)
  const sampleSizes = columnsData.map(c => c.stats.totalPromises);
  const minSample = Math.min(...sampleSizes);
  const maxSample = Math.max(...sampleSizes);
  const isDiffWarning = minSample > 0 && maxSample / minSample >= 2;

  // Formatting metrics to a common matrix shape
  const metrics = type === 'politician' ? [
    { label: 'Promises Tracked', key: 'totalPromises', isPercentage: false, invertColor: false },
    { label: 'Fulfillment %', key: 'avgFulfillment', isPercentage: true, invertColor: false },
    { label: 'Attendance %', key: 'avgAttendance', isPercentage: true, invertColor: false },
    { label: 'Net Assets (Cr)', key: 'avgNetAssets', isPercentage: false, invertColor: false, format: (v: number) => `₹${(v / 10000000).toFixed(1)} Cr` },
    { label: 'Legal Risk (Cases)', key: 'totalCases', isPercentage: false, invertColor: true },
  ] : [
    { label: 'Promises Tracked', key: 'totalPromises', isPercentage: false, invertColor: false },
    { label: 'Avg Fulfillment %', key: 'avgFulfillment', isPercentage: true, invertColor: false },
    { label: 'Avg Attendance %', key: 'avgAttendance', isPercentage: true, invertColor: false },
    { label: 'Total Legal Cases', key: 'totalCases', isPercentage: false, invertColor: true },
    { label: 'Avg Net Assets (Cr)', key: 'avgNetAssets', isPercentage: false, invertColor: false, format: (v: number) => `₹${(v / 10000000).toFixed(1)} Cr` },
    { label: 'Verified Complete', key: 'verifiedComplete', isPercentage: false, invertColor: false },
    { label: 'Under Scrutiny', key: 'underScrutiny', isPercentage: false, invertColor: false },
  ];

  const warningText = entityIds.length === 2 
    ? `Sample sizes differ significantly (A: n=${sampleSizes[0]}, B: n=${sampleSizes[1]}).`
    : `Sample sizes vary widely (${minSample}–${maxSample} promises) — percentages may not be directly comparable across all three.`;

  return (
    <div className="mt-12">
      {/* Legend */}
      <div className="flex justify-end mb-3">
        <div className="flex items-center gap-4 text-[11px] text-[#71717A]">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> &lt;34%</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> 34–66%</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> &gt;66%</div>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
        {/* Header Row */}
        <div className="flex border-b border-white/[0.06]">
          <div className="w-[240px] shrink-0 p-6 flex flex-col justify-end bg-white/[0.02]">
            <div className="text-xs uppercase tracking-widest text-[#71717A] mb-3 font-semibold">METRIC</div>
            {isDiffWarning && (
              <div className="flex items-start gap-2 text-amber-400/90 text-[11px] leading-snug bg-amber-500/10 border border-amber-500/20 p-2.5 rounded group relative cursor-help">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{warningText}</span>
                
                <div className="absolute top-full left-0 mt-2 w-[240px] bg-[#18181B] border border-white/[0.1] rounded p-3 text-[#A1A1AA] text-xs shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                  Percentages may not be directly comparable when sample sizes (n) differ by more than 2x. A 100% score on n=3 holds different weight than 75% on n=40.
                </div>
              </div>
            )}
          </div>
        
        {columnsData.map((col, i) => (
          <div key={`header-${col.id}-${i}`} className="flex-1 p-6 border-l border-white/[0.06] flex flex-col items-start justify-end">
            <div className="text-xs uppercase tracking-widest text-[#71717A] mb-2 font-semibold">
              Slot {String.fromCharCode(65 + i)}
            </div>
            <div className="font-serif font-bold text-xl text-white">
              {col.name}
            </div>
            <div className="text-[#A1A1AA] text-xs mt-1">
              n={col.stats.totalPromises} promises
            </div>
          </div>
        ))}
      </div>

      {/* Metric Rows */}
      {metrics.map(metric => {
        // Calculate max value for the bar graph in this row
        const rowValues = columnsData.map(c => c.stats[metric.key as keyof typeof c.stats] as number);
        const maxVal = Math.max(...rowValues);
        
        return (
          <div key={metric.key} className="flex border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors">
            <div className="w-[240px] shrink-0 p-6 flex items-center bg-white/[0.01]">
              <span className="text-[#D4D4D8] font-medium text-sm">{metric.label}</span>
            </div>
            
            {columnsData.map((col, i) => {
              const val = col.stats[metric.key as keyof typeof col.stats] as number;
              
              // If there are zero politicians/promises mapped, or val is undefined/NaN, handle empty state.
              if (col.stats.totalPoliticians === 0 || val === undefined || Number.isNaN(val)) {
                return (
                  <div key={i} className="flex-1 p-6 border-l border-white/[0.04] flex items-center">
                    <span className="text-[#71717A] text-sm italic">No data</span>
                  </div>
                );
              }

              // Format value
              const displayVal = metric.format ? metric.format(val) : metric.isPercentage ? `${val}%` : val;
              
              // Calculate bar width (min 2% so it's visible, max 100%)
              const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
              const barWidth = Math.max(2, Math.min(100, pct));
              
              // Determine semantic color (absolute value, not relative rank)
              let barColor = 'rgba(255,255,255,0.2)';
              if (metric.isPercentage) {
                if (val >= 66) barColor = 'var(--accent-positive)';
                else if (val >= 34) barColor = 'var(--accent-warning)';
                else barColor = 'var(--accent-negative)';
              } else if (metric.invertColor) {
                if (val === 0) barColor = 'var(--accent-positive)';
                else if (val <= 2) barColor = 'var(--accent-warning)';
                else barColor = 'var(--accent-negative)';
              }

              return (
                <div key={i} className="flex-1 p-6 border-l border-white/[0.04] flex flex-col justify-center gap-3">
                  <div className="text-white font-semibold tabular-nums text-lg">
                    {displayVal}
                  </div>
                  <ProgressBar
                    value={barWidth}
                    color={barColor}
                    height="6px"
                  />
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Footer / Methodology Link */}
      <div className="p-4 border-t border-white/[0.06] bg-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#71717A]">
        <div>
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
        <Link href="/methodology" className="flex items-center gap-1.5 hover:text-white transition-colors">
          How we calculate these numbers <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      </div>
    </div>
  );
}
