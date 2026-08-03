'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SearchSlot } from './SearchSlot';
import { CompareTable } from './CompareTable';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { POLITICIANS, PARTIES } from '@/data/politicians';

export type CompareType = 'party' | 'state' | 'constituency' | 'politician';

const TYPES: { id: CompareType; label: string }[] = [
  { id: 'party', label: 'Party' },
  { id: 'state', label: 'State' },
  { id: 'constituency', label: 'Constituency' },
  { id: 'politician', label: 'Politician' },
];

export function CompareBuilder({ initialSearchParams }: { initialSearchParams: { type?: string; a?: string; b?: string; c?: string } }) {
  const router = useRouter();
  const pathname = usePathname();

  const [compareType, setCompareType] = useState<CompareType>(
    (initialSearchParams.type as CompareType) || 'politician'
  );
  
  // Slots hold the IDs of the selected entities. Null means empty slot.
  const [slots, setSlots] = useState<(string | null)[]>([
    initialSearchParams.a || null,
    initialSearchParams.b || null,
    initialSearchParams.c || null,
  ].slice(0, initialSearchParams.c ? 3 : 2));

  const [quickAddFilter, setQuickAddFilter] = useState<'All Parties' | 'INC' | 'BJP' | 'Independent'>('All Parties');
  const [quickAddSearch, setQuickAddSearch] = useState('');

  const filledSlots = slots.filter(s => s !== null) as string[];

  const [compareState, setCompareState] = useState<'disabled' | 'enabled' | 'loading' | 'compared'>(
    filledSlots.length >= 2 ? 'enabled' : 'disabled'
  );

  // Sync state to URL when changed (shallow routing)
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
    setSlots([null, null]); // reset slots on type change
    setCompareState('disabled');
  };

  const handleSlotSelect = (index: number, id: string | null) => {
    const newSlots = [...slots];
    newSlots[index] = id;
    setSlots(newSlots);
    
    const newFilled = newSlots.filter(s => s !== null);
    if (newFilled.length < 2) {
      setCompareState('disabled');
    } else {
      setCompareState('enabled');
    }
  };

  const addSlot = () => {
    if (slots.length < 3) {
      setSlots([...slots, null]);
    }
  };

  const removeSlot = (index: number) => {
    const newSlots = [...slots];
    newSlots.splice(index, 1);
    // Ensure we always have at least 2 slots
    while (newSlots.length < 2) newSlots.push(null);
    setSlots(newSlots);

    const newFilled = newSlots.filter(s => s !== null);
    if (newFilled.length < 2) {
      setCompareState('disabled');
    } else {
      setCompareState('enabled');
    }
  };

  const handleQuickAdd = (id: string) => {
    // Find first empty slot
    const firstEmptyIndex = slots.findIndex(s => s === null);
    if (firstEmptyIndex !== -1) {
      handleSlotSelect(firstEmptyIndex, id);
    } else if (slots.length < 3) {
      // Add a 3rd slot if possible and populate it
      const newSlots = [...slots, id];
      setSlots(newSlots);
      
      const newFilled = newSlots.filter(s => s !== null);
      if (newFilled.length >= 2) setCompareState('enabled');
    }
  };

  const handleCompareClick = () => {
    if (compareState !== 'enabled') return;
    setCompareState('loading');
    setTimeout(() => {
      setCompareState('compared');
      setTimeout(() => {
        document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }, 600);
  };

  const filteredPoliticians = useMemo(() => {
    return POLITICIANS.filter(p => {
      if (quickAddFilter !== 'All Parties' && PARTIES.find(pty => pty.id === p.partyId)?.abbreviation !== quickAddFilter) return false;
      if (quickAddSearch && !p.name.toLowerCase().includes(quickAddSearch.toLowerCase())) return false;
      return true;
    }).slice(0, 4); // Just show top 4 for the quick add tray
  }, [quickAddFilter, quickAddSearch]);

  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <Image
            src="/images/reference.png"
            alt="Compare Background"
            fill
            className="hero-bg-photo"
            priority
          />
        </div>
        <div className="wrap">
          <div className="eyebrow">Comparison Engine</div>
          <h1 className="headline">Side-by-<em>Side</em></h1>
          
          <div className="compareby-row">
            <div className="compareby-label">Compare By</div>
            <div className="toggle-group">
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTypeChange(t.id)}
                  className={`toggle-btn ${compareType === t.id ? 'active' : ''}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="slots-row">
            {slots.map((slotValue, idx) => (
              <SearchSlot 
                key={`slot-${idx}`}
                idx={idx}
                type={compareType} 
                value={slotValue}
                selectedIds={filledSlots} 
                onChange={(val) => handleSlotSelect(idx, val)} 
                onRemove={() => removeSlot(idx)}
                canRemove={idx === 2}
              />
            ))}
            
            {/* Add 3rd Slot Button */}
            {slots.length < 3 && (
              <div>
                <button onClick={addSlot} className="add-slot">
                  <span>+</span> Add Slot
                </button>
              </div>
            )}
          </div>
          
          <div className="slot-help">Drag a <b>{compareType}</b> from the tray below into a slot — or tap <b>+ Add</b> on any card.</div>
          
          <div className="compare-cta">
            <button 
              className={`cta-btn ${compareState === 'disabled' ? 'state-disabled' : compareState === 'loading' ? 'state-loading' : compareState === 'compared' ? 'state-compared' : ''}`}
              disabled={compareState === 'disabled' || compareState === 'loading'}
              onClick={handleCompareClick}
            >
              {compareState === 'disabled' ? 'Select at least two' : compareState === 'loading' ? 'Preparing Comparison...' : compareState === 'compared' ? 'Compared' : 'Compare Politicians'}
            </button>
          </div>
        </div>
      </section>

      {/* Quick Add Tray */}
      {compareType === 'politician' && (
        <section className="block wrap">
          <div className="block-head">
            <div>
              <h2 className="block-title">Quick Add — Politicians</h2>
              <div className="block-sub">Drag a card into a slot above, or tap Add. Sourced from your active dataset.</div>
            </div>
            <div className="filter-search">⌕<input type="text" placeholder="Filter by name or party..." value={quickAddSearch} onChange={(e) => setQuickAddSearch(e.target.value)} /></div>
          </div>

          <div className="party-pills">
            {['All Parties', 'INC', 'BJP', 'Independent'].map((filter) => (
              <button
                key={filter}
                onClick={() => setQuickAddFilter(filter as any)}
                className={`party-pill ${quickAddFilter === filter ? 'active' : ''}`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="politician-grid">
            {filteredPoliticians.map(p => {
              const pty = PARTIES.find(pt => pt.id === p.partyId);
              const score = Math.round((p.promisesFulfilled / p.promisesTotal) * 100) || 50;
              const initials = p.name.split(' ').map(n => n[0]).join('').substring(0,2);
              
              return (
                <div key={p.id} className="poli-card">
                  <div className="poli-top">
                    <div className="poli-avatar">{initials}</div>
                    <div>
                      <h3 className="poli-name">{p.name}</h3>
                      <div className="poli-meta">{pty?.abbreviation} • {p.state}</div>
                    </div>
                  </div>
                  
                  <div className="poli-meter-top">
                    <span>Fulfillment</span>
                    <b>{score}%</b>
                  </div>
                  <div className="meter-track">
                    <div className="meter-fill" style={{ width: `${score}%` }}></div>
                  </div>
                  
                  <div className="poli-foot">
                    <span className="drag-hint">⋮⋮ DRAG</span>
                    <button onClick={() => handleQuickAdd(p.id)} className="add-btn">+ ADD</button>
                  </div>
                </div>
              );
            })}
            
            {filteredPoliticians.length === 0 && (
              <div className="col-span-full py-10 text-center text-[var(--ink-faint)] text-[14px]">
                No politicians found matching your filters.
              </div>
            )}
          </div>
        </section>
      )}

      {/* Data Table */}
      {compareState === 'compared' && filledSlots.length >= 2 ? (
        <CompareTable type={compareType} entityIds={filledSlots} />
      ) : (
        <section className="block" id="resultsGate">
          <div className="wrap">
            <div className="gate-empty">
              {compareState === 'disabled' ? 'Select at least two to begin comparison.' : 
               compareState === 'loading' ? 'Preparing Comparison...' : 
               'Ready — click Compare above to view results.'}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
