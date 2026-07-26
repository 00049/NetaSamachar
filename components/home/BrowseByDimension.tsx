'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PARTIES, POLITICIANS } from '@/data/politicians';

type Dimension = 'party' | 'state' | 'category' | 'status';

const DIMENSIONS: { id: Dimension; label: string }[] = [
  { id: 'party', label: 'Party' },
  { id: 'state', label: 'State' },
  { id: 'category', label: 'Category' },
  { id: 'status', label: 'Status' },
];

export function BrowseByDimension() {
  const [activeDimension, setActiveDimension] = useState<Dimension>('category');

  // Dynamically extract active parties based on politicians in the dataset
  const activeParties = useMemo(() => {
    const presentPartyIds = new Set(POLITICIANS.map(p => p.partyId));
    return PARTIES.filter(party => presentPartyIds.has(party.id));
  }, []);

  // Dynamically extract active states based on politicians in the dataset
  const activeStates = useMemo(() => {
    const presentStates = new Set(POLITICIANS.map(p => p.state));
    return Array.from(presentStates).sort();
  }, []);

  return (
    <div className="mt-[24px] flex flex-col gap-[16px] w-full max-w-[920px]">
      {/* Segmented Control */}
      <div className="flex items-center gap-1 p-1 bg-white/[0.04] rounded-full w-fit border border-white/[0.06] h-[40px]">
        {DIMENSIONS.map((dim) => {
          const isActive = activeDimension === dim.id;
          return (
            <button
              key={dim.id}
              onClick={() => setActiveDimension(dim.id)}
              className={`relative h-full px-5 text-[13px] uppercase font-semibold rounded-full transition-colors duration-150 flex items-center justify-center ${
                isActive
                  ? 'text-black'
                  : 'text-[#A1A1AA] hover:text-[#D4D4D8]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-dimension-pill"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{dim.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Chip Row */}
      <div className="min-h-[40px] relative mt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDimension}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex flex-wrap items-center gap-[8px]"
          >
            {activeDimension === 'party' && (
              <>
                {activeParties.map((party) => (
                  <Link key={party.id} href={`/search?party=${party.id}`} className="chip">
                    <div 
                      className="w-2 h-2 rounded-full mr-2" 
                      style={{ backgroundColor: party.color }}
                    />
                    {party.abbreviation}
                  </Link>
                ))}
              </>
            )}

            {activeDimension === 'state' && (
              <>
                {activeStates.map((state) => (
                  <Link key={state} href={`/search?state=${encodeURIComponent(state)}`} className="chip">
                    {state}
                  </Link>
                ))}
              </>
            )}

            {activeDimension === 'category' && (
              <>
                <Link href="/search?category=infrastructure" className="chip">Infrastructure</Link>
                <Link href="/search?category=healthcare" className="chip">Healthcare</Link>
                <Link href="/search?category=education" className="chip">Education</Link>
                <Link href="/search?category=economy" className="chip">Economy</Link>
                <Link href="/search?category=social_welfare" className="chip">Social Welfare</Link>
              </>
            )}

            {activeDimension === 'status' && (
              <>
                <Link href="/search?status=fully_delivered" className="chip">
                  <div className="status-dot status-dot--verified mr-2" />Fully Delivered
                </Link>
                <Link href="/search?status=under_construction" className="chip">
                  <div className="status-dot status-dot--info mr-2" />Under Construction
                </Link>
                <Link href="/search?status=broken" className="chip">
                  <div className="status-dot status-dot--risk mr-2" />Broken Promises
                </Link>
                <Link href="/search?status=pending" className="chip">
                  <div className="status-dot status-dot--caution mr-2" />Pending Scrutiny
                </Link>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
