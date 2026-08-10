'use client';

import { PoliticianCard } from '@/components/politicians/PoliticianCard';
import { PromiseCard } from '@/components/promises/PromiseCard';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { EntityStats } from '@/lib/aggregation';
import { Politician, Promise as AppPromise } from '@/lib/types';
import { ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';

interface EntityScorecardProps {
  entityId: string;
  entityName: string;
  entityType: 'party' | 'state' | 'city';
  parentState?: string; // for cities
  stats: EntityStats;
  politicians: Politician[];
  promises: AppPromise[];
}

export function EntityScorecard({ 
  entityId, 
  entityName, 
  entityType, 
  stats, 
  politicians, 
  promises 
}: EntityScorecardProps) {
  // Stats bar metrics
  const STATS = [
    { label: 'Total Politicians', value: stats.totalPoliticians, color: '#F4F5F7' },
    { label: 'Avg Fulfillment', value: stats.avgFulfillment, suffix: '%', color: stats.avgFulfillment >= 75 ? '#34d399' : stats.avgFulfillment >= 40 ? '#fbbf24' : '#f87171' },
    { label: 'Total Promises', value: stats.totalPromises, color: '#F4F5F7' },
    { label: 'Total Legal Cases', value: stats.totalCases, color: stats.totalCases > 0 ? '#f87171' : '#F4F5F7' },
  ];

  const typeLabel = entityType === 'party' ? 'Political Party' : entityType === 'state' ? 'State' : 'Constituency';

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-20 py-32 lg:py-40">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="section-label">{typeLabel}</div>
          <h1 className="font-serif font-black text-[var(--text-primary)] text-4xl lg:text-6xl tracking-tight">
            {entityName}
          </h1>
        </div>
        
        {/* Compare Button */}
        <Link 
          href={`/compare?type=${entityType}&a=${entityId}`}
          className="flex items-center justify-center font-bold uppercase text-[#090B12] bg-white hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150 px-6 py-3 rounded-sm gap-2 shrink-0"
          style={{ fontSize: '12px', letterSpacing: '0.06em' }}
        >
          <ArrowRightLeft className="w-4 h-4" /> Compare This {typeLabel}
        </Link>
      </div>

      {/* Aggregate Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/8 border border-white/8 mb-24">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="px-[32px] py-[40px] bg-[var(--bg-base)]"
          >
            <div className="text-[12px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-3">
              {stat.label}
            </div>
            <div 
              className="text-[48px] font-semibold leading-none"
              style={{ color: stat.color, fontVariantNumeric: 'tabular-nums' }}
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </div>
          </div>
        ))}
      </div>

      {/* Roster: Politicians */}
      <div className="mb-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="section-label">Active Members</div>
            <h2 className="font-serif font-black text-[var(--text-primary)] text-3xl tracking-tight">
              Politicians Roster
            </h2>
          </div>
        </div>
        
        {politicians.length > 0 ? (
          <div className={`grid gap-8 ${
            politicians.length === 1 ? 'grid-cols-1 max-w-sm' :
            politicians.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl' :
            politicians.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl' :
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          }`}>
            {politicians.map((pol) => (
              <div key={pol.id}>
                <PoliticianCard politician={pol} viewMode="compact" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[var(--text-secondary)] italic">No politicians tracked for this {typeLabel.toLowerCase()} yet.</div>
        )}
      </div>

      {/* Roster: Promises */}
      <div>
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="section-label">Active Monitoring</div>
            <h2 className="font-serif font-black text-[var(--text-primary)] text-3xl tracking-tight">
              Promises Roster
            </h2>
          </div>
        </div>

        {promises.length > 0 ? (
          <div className={`grid gap-8 ${
            promises.length === 1 ? 'grid-cols-1 max-w-md' :
            promises.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {promises.map((promise, index) => (
              <div key={promise.id} className="h-full">
                <PromiseCard promise={promise} viewMode="compact" index={index} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[var(--text-secondary)] italic">No promises tracked for this {typeLabel.toLowerCase()} yet.</div>
        )}
      </div>
    </div>
  );
}
