'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SearchSlot } from './SearchSlot';
import { CompareTable } from './CompareTable';
import { POLITICIANS, PARTIES } from '@/data/politicians';
import { Plus, ArrowRight, BarChart2 } from 'lucide-react';

export type CompareType = 'party' | 'state' | 'constituency' | 'politician';

const TYPES: { id: CompareType; label: string }[] = [
  { id: 'politician',   label: 'Politician' },
  { id: 'party',        label: 'Party' },
  { id: 'state',        label: 'State' },
  { id: 'constituency', label: 'Constituency' },
];

export function CompareBuilder({
  initialSearchParams,
}: {
  initialSearchParams: { type?: string; a?: string; b?: string; c?: string };
}) {
  const router   = useRouter();
  const pathname = usePathname();

  const [compareType, setCompareType] = useState<CompareType>(
    (initialSearchParams.type as CompareType) || 'politician'
  );

  const [slots, setSlots] = useState<(string | null)[]>([
    initialSearchParams.a || null,
    initialSearchParams.b || null,
    ...(initialSearchParams.c ? [initialSearchParams.c] : []),
  ]);

  const [quickAddFilter, setQuickAddFilter] = useState<'All' | 'INC' | 'BJP' | 'Independent'>('All');
  const [quickAddSearch, setQuickAddSearch] = useState('');
  const [compareState, setCompareState]     = useState<'idle' | 'loading' | 'done'>(
    (initialSearchParams.a && initialSearchParams.b) ? 'done' : 'idle'
  );

  const filledSlots = slots.filter(Boolean) as string[];
  const canCompare  = filledSlots.length >= 2;

  // Sync state to URL (shallow routing)
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('type', compareType);
    if (slots[0]) params.set('a', slots[0]);
    if (slots[1]) params.set('b', slots[1]);
    if (slots[2]) params.set('c', slots[2]);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [compareType, slots, pathname, router]);

  const handleTypeChange = (newType: CompareType) => {
    if (newType === compareType) return;
    setCompareType(newType);
    setSlots([null, null]);
    setCompareState('idle');
  };

  const handleSlotSelect = (index: number, id: string | null) => {
    const newSlots = [...slots];
    newSlots[index] = id;
    setSlots(newSlots);
    if (compareState === 'done') setCompareState('idle');
  };

  const addSlot = () => {
    if (slots.length < 3) setSlots([...slots, null]);
  };

  const removeSlot = (index: number) => {
    const newSlots = [...slots];
    newSlots.splice(index, 1);
    while (newSlots.length < 2) newSlots.push(null);
    setSlots(newSlots);
    if (compareState === 'done') setCompareState('idle');
  };

  const handleQuickAdd = (id: string) => {
    const firstEmpty = slots.findIndex(s => s === null);
    if (firstEmpty !== -1) {
      handleSlotSelect(firstEmpty, id);
    } else if (slots.length < 3) {
      setSlots([...slots, id]);
    }
  };

  const handleCompare = () => {
    if (!canCompare) return;
    setCompareState('loading');
    setTimeout(() => {
      setCompareState('done');
      setTimeout(() => {
        document.getElementById('compare-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }, 500);
  };

  const filteredPoliticians = useMemo(() => {
    return POLITICIANS.filter(p => {
      if (quickAddFilter !== 'All') {
        const abbr = PARTIES.find(pt => pt.id === p.partyId)?.abbreviation;
        if (abbr !== quickAddFilter) return false;
      }
      if (quickAddSearch && !p.name.toLowerCase().includes(quickAddSearch.toLowerCase())) return false;
      return true;
    }).slice(0, 6);
  }, [quickAddFilter, quickAddSearch]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">

      {/* ── PAGE HEADER ──────────────────────────────── */}
      <div className="pt-[100px] pb-10 border-b border-[var(--border-subtle)]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-[var(--border-subtle)]" aria-hidden="true" />
            Comparison Engine
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-3">
                Side-by-Side
              </h1>
              <p className="text-[var(--text-tertiary)] text-base max-w-lg leading-relaxed">
                Compare politicians, parties, states, or constituencies on the same verified metrics.
              </p>
            </div>
            {/* Compare-by toggle */}
            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-tertiary)]">Compare By</span>
              <div className="flex items-center gap-2" role="group" aria-label="Select comparison type">
                {TYPES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleTypeChange(t.id)}
                    aria-pressed={compareType === t.id}
                    className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                      compareType === t.id
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-[var(--text-tertiary)] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SLOT BUILDER ─────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-10">
        <div className="flex flex-col md:flex-row items-stretch gap-4 mb-4">
          {slots.map((slotValue, idx) => (
            <SearchSlot
              key={`slot-${idx}`}
              idx={idx}
              type={compareType}
              value={slotValue}
              selectedIds={filledSlots}
              onChange={val => handleSlotSelect(idx, val)}
              onRemove={() => removeSlot(idx)}
              canRemove={idx === 2}
            />
          ))}

          {/* Add 3rd slot */}
          {slots.length < 3 && (
            <div className="flex items-end">
              <button
                onClick={addSlot}
                className="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] border border-dashed border-white/20 text-[var(--text-tertiary)] hover:text-white hover:border-white/40 transition-all duration-200 text-[13px] font-semibold whitespace-nowrap"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Add 3rd
              </button>
            </div>
          )}
        </div>

        {/* Help text */}
        <p className="text-[12px] text-[var(--text-tertiary)] mb-8">
          Select at least two <strong className="text-white">{compareType}s</strong> to compare — or use the quick-add tray below.
        </p>

        {/* CTA */}
        <button
          onClick={handleCompare}
          disabled={!canCompare || compareState === 'loading'}
          className={`flex items-center gap-3 px-8 py-4 rounded-[var(--radius-md)] font-bold text-[14px] uppercase tracking-wider transition-all duration-200 ${
            !canCompare
              ? 'bg-white/5 text-[var(--text-tertiary)] cursor-not-allowed'
              : compareState === 'loading'
              ? 'bg-[var(--color-accent-positive)]/60 text-black cursor-wait'
              : compareState === 'done'
              ? 'bg-white/10 text-white ring-1 ring-[var(--color-accent-positive)]'
              : 'bg-[var(--color-accent-positive)] text-black hover:brightness-110'
          }`}
        >
          <BarChart2 className="w-5 h-5" aria-hidden="true" />
          {!canCompare
            ? 'Select at least two'
            : compareState === 'loading'
            ? 'Preparing comparison…'
            : compareState === 'done'
            ? 'Refresh comparison'
            : `Compare ${filledSlots.length} ${compareType}s`}
          {canCompare && compareState === 'idle' && (
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* ── QUICK-ADD TRAY ───────────────────────────── */}
      {compareType === 'politician' && (
        <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-raised)]">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-[14px] font-bold text-white mb-0.5">Quick Add — Politicians</h2>
                <p className="text-[12px] text-[var(--text-tertiary)]">Click + Add to populate a slot. Shows up to 6 politicians from the dataset.</p>
              </div>
              <input
                type="text"
                placeholder="Filter by name…"
                value={quickAddSearch}
                onChange={e => setQuickAddSearch(e.target.value)}
                aria-label="Filter politicians in quick-add tray"
                className="w-full sm:w-[200px] bg-white/5 border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2 text-[13px] text-white placeholder-[var(--text-tertiary)] focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            {/* Party filter pills */}
            <div className="flex items-center gap-2 mb-6 flex-wrap" role="group" aria-label="Filter by party">
              {(['All', 'INC', 'BJP', 'Independent'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setQuickAddFilter(f)}
                  aria-pressed={quickAddFilter === f}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                    quickAddFilter === f
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-[var(--text-tertiary)] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Politician mini-cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {filteredPoliticians.map(p => {
                const party   = PARTIES.find(pt => pt.id === p.partyId);
                const score   = Math.round((p.promisesFulfilled / Math.max(p.promisesTotal, 1)) * 100);
                const initials = p.name.split(' ').map(n => n[0]).join('').substring(0, 2);
                const inSlots  = filledSlots.includes(p.id);

                return (
                  <div
                    key={p.id}
                    className={`premium-card p-4 flex flex-col gap-3 transition-all duration-200 ${inSlots ? 'opacity-40' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-[32px] h-[32px] rounded-full bg-white/10 flex items-center justify-center text-[11px] font-black text-white flex-shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12px] font-bold text-white truncate">{p.name}</div>
                        <div className="text-[10px] text-[var(--text-tertiary)] truncate">{party?.abbreviation}</div>
                      </div>
                    </div>

                    {/* Fulfillment bar */}
                    <div>
                      <div className="flex justify-between text-[9px] text-[var(--text-tertiary)] mb-1">
                        <span>Fulfillment</span>
                        <span className="text-white font-bold">{score}%</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--color-accent-positive)] rounded-full transition-all duration-500"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickAdd(p.id)}
                      disabled={inSlots || (filledSlots.length >= 3 && !slots.includes(null))}
                      className="w-full py-1.5 rounded-[var(--radius-sm)] bg-white/5 hover:bg-white/10 text-[11px] font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {inSlots ? 'Added' : '+ Add'}
                    </button>
                  </div>
                );
              })}

              {filteredPoliticians.length === 0 && (
                <div className="col-span-full py-8 text-center text-[var(--text-tertiary)] text-[13px]">
                  No politicians match your filter.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── COMPARISON TABLE ─────────────────────────── */}
      <div id="compare-results">
        {compareState === 'done' && filledSlots.length >= 2 ? (
          <CompareTable type={compareType} entityIds={filledSlots} />
        ) : (
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-16">
            <div className="py-16 text-center border border-dashed border-white/10 rounded-[var(--radius-lg)]">
              <BarChart2 className="w-10 h-10 text-white/20 mx-auto mb-4" aria-hidden="true" />
              <p className="text-[var(--text-tertiary)] text-[14px]">
                {compareState === 'loading'
                  ? 'Preparing comparison…'
                  : canCompare
                  ? 'Click Compare above to see the side-by-side analysis.'
                  : 'Select at least two to begin comparison.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
