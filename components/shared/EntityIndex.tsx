'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDownUp, CheckSquare, Square } from 'lucide-react';
import { EntityStats } from '@/lib/aggregation';
import { CheckboxSelectionProvider, useSelection } from '@/components/ui/CheckboxSelectionProvider';
import { StickyCompareBar } from '@/components/ui/StickyCompareBar';

export interface EntityCardData {
  id: string;
  name: string;
  abbreviation?: string;
  color?: string; // for parties
  stats: EntityStats;
  type: 'party' | 'state';
}

interface EntityIndexProps {
  title: string;
  entities: EntityCardData[];
}

type SortOption = 'alpha-asc' | 'alpha-desc' | 'fulfillment' | 'promises' | 'cases';

export function EntityIndex(props: EntityIndexProps) {
  return (
    <CheckboxSelectionProvider type={props.entities[0]?.type || 'party'}>
      <EntityIndexInner {...props} />
    </CheckboxSelectionProvider>
  );
}

function EntityIndexInner({ title, entities }: EntityIndexProps) {
  const [sortBy, setSortBy] = useState<SortOption>('alpha-asc');
  const { toggleSelection, isSelected } = useSelection()!;

  const sortedEntities = [...entities].sort((a, b) => {
    switch (sortBy) {
      case 'alpha-asc':
        return a.name.localeCompare(b.name);
      case 'alpha-desc':
        return b.name.localeCompare(a.name);
      case 'fulfillment':
        return b.stats.avgFulfillment - a.stats.avgFulfillment;
      case 'promises':
        return b.stats.totalPromises - a.stats.totalPromises;
      case 'cases':
        return b.stats.totalCases - a.stats.totalCases;
      default:
        return 0;
    }
  });

  // Base folder for routing
  const getHref = (type: 'party' | 'state', id: string) => {
    return type === 'party' ? `/parties/${id}` : `/states/${id}`;
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-20 py-32 lg:py-40 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="section-label">Directory</div>
          <h1 className="font-serif font-black text-[var(--text-primary)] text-4xl lg:text-5xl tracking-tight">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
            Sort By:
          </label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-white/[0.04] border border-white/[0.08] text-[var(--text-secondary)] text-sm px-4 py-2 pr-10 rounded-md focus:outline-none focus:border-white/[0.2] transition-colors"
            >
              <option value="alpha-asc">Alphabetical (A-Z)</option>
              <option value="alpha-desc">Alphabetical (Z-A)</option>
              <option value="fulfillment">Highest Fulfillment</option>
              <option value="promises">Most Promises Tracked</option>
              <option value="cases">Most Legal Cases</option>
            </select>
            <ArrowDownUp className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedEntities.map((entity, i) => (
          <motion.div
            key={entity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link 
              href={getHref(entity.type, entity.id)}
              className="block h-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {entity.color && (
                    <div 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: entity.color }}
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight">
                      {entity.name}
                    </h3>
                    {entity.abbreviation && (
                      <div className="text-xs text-[var(--text-tertiary)] tracking-wider mt-1">
                        {entity.abbreviation}
                      </div>
                    )}
                  </div>
                </div>
                
                <div 
                  className="p-2 -mr-2 text-[var(--text-tertiary)] hover:text-white transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSelection(entity.id);
                  }}
                >
                  {isSelected(entity.id) ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-1">
                    Politicians
                  </div>
                  <div className="text-xl font-semibold text-[var(--text-secondary)] tabular-nums">
                    {entity.stats.totalPoliticians}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-1">
                    Fulfillment
                  </div>
                  <div className={`text-xl font-semibold tabular-nums ${
                    entity.stats.avgFulfillment >= 75 ? 'text-emerald-400' :
                    entity.stats.avgFulfillment >= 40 ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
                    {entity.stats.avgFulfillment}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-1">
                    Legal Cases
                  </div>
                  <div className="text-xl font-semibold text-[var(--text-secondary)] tabular-nums">
                    {entity.stats.totalCases}
                  </div>
                </div>
              </div>

              <div className="flex items-center text-sm font-semibold text-[var(--text-tertiary)] group-hover:text-white transition-colors">
                View {entity.type === 'party' ? 'Party' : 'State'} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      <StickyCompareBar />
    </div>
  );
}
