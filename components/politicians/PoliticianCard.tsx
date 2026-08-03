'use client';

import React from 'react';
import { Politician } from '@/lib/types';
import { PARTIES } from '@/data/politicians';
import { formatCurrency, getPromiseFulfillmentRate } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { HoverPrefetchLink } from '@/components/ui/HoverPrefetchLink';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { CheckSquare, Square, ChevronRight, AlertTriangle } from 'lucide-react';
import { useSelection } from '@/components/ui/CheckboxSelectionProvider';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface Props {
  politician: Politician;
  viewMode?: 'grid' | 'list' | 'compact';
  onClickPreview?: (politician: Politician) => void;
  /** Set to true for cards below the viewport fold so avatars don't block initial render */
  lazy?: boolean;
}

export function PoliticianCard({
  politician,
  viewMode = 'grid',
  onClickPreview,
}: Props) {
  const party           = PARTIES.find(p => p.id === politician.partyId);
  const fulfillmentRate = getPromiseFulfillmentRate(politician.promisesFulfilled, politician.promisesTotal);
  const hasSevereCases  = politician.criminalCases.some(c => c.severity === 'heinous');
  const totalCases      = politician.criminalCases.length;
  
  const selection = useSelection();
  const isSelected = selection?.isSelected(politician.id);
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    selection?.toggleSelection(politician.id);
  };

  // ── List view ──────────────────────────────────────────────
  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ backgroundColor: 'var(--bg-raised)' }}
        className="group relative flex items-center gap-6 px-6 py-4 border-b border-[var(--border-subtle)] cursor-pointer glide-transition"
        onClick={() => onClickPreview?.(politician)}
      >
        {/* Checkbox (if in selection context) */}
        {selection && (
          <div 
            className="p-2 -ml-2 text-[var(--text-tertiary)] hover:text-white transition-colors cursor-pointer"
            onClick={handleToggle}
          >
            {isSelected ? (
              <CheckSquare className="w-5 h-5 text-emerald-400" />
            ) : (
              <Square className="w-5 h-5" />
            )}
          </div>
        )}

        {/* Avatar — neutral, no party color */}
        <Avatar photoUrl={politician.photoUrl} name={politician.name} size={40} />

        <div className="flex-1 min-w-0 grid grid-cols-12 items-center gap-4">
          {/* Name + meta */}
          <div className="col-span-12 md:col-span-4 min-w-0">
            <div
              className="font-serif font-bold text-[var(--text-primary)] truncate"
              style={{ fontSize: '15px' }}
            >
              {politician.name}
            </div>
            <div className="text-[var(--text-tertiary)] truncate mt-0.5" style={{ fontSize: '11px', letterSpacing: '0.06em' }}>
              {party?.abbreviation} · {politician.constituency}
            </div>
          </div>

          {/* Fulfillment */}
          <div className="hidden md:block col-span-2">
            <div className="stat-block__label">Fulfillment</div>
            <div className="font-mono text-sm font-bold text-[var(--text-primary)]">{fulfillmentRate}%</div>
          </div>

          {/* Attendance */}
          <div className="hidden md:block col-span-2">
            <div className="stat-block__label">Attendance</div>
            <div className="font-mono text-sm font-bold text-[var(--text-primary)]">{politician.attendancePercent}%</div>
          </div>

          {/* Assets */}
          <div className="hidden lg:block col-span-2">
            <div className="stat-block__label">Net Assets</div>
            <div className="font-mono text-sm font-bold text-[var(--text-primary)]">{formatCurrency(politician.latestNetWorth)}</div>
          </div>

          {/* Risk */}
          <div className="hidden md:block col-span-2">
            <div className="stat-block__label">Legal Risk</div>
            <div className={clsx('font-mono text-sm font-bold', {
              'text-[var(--accent-positive)]': totalCases === 0,
              'text-[var(--accent-negative)]':     hasSevereCases,
              'text-[var(--accent-warning)]':  totalCases > 0 && !hasSevereCases,
            })}>
              {totalCases === 0 ? 'Clear' : `${totalCases} cases`}
            </div>
          </div>
        </div>

      <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--text-tertiary)] glide-transition flex-shrink-0" />
      </motion.div>
    );
  }

  // ── Compact view (Homepage) ────────────────────────────────
  if (viewMode === 'compact') {
    const fulfillmentColor = fulfillmentRate <= 33 ? '#F87171' : fulfillmentRate <= 66 ? '#FBBF24' : '#34D399';
    const partyNeutralTones = ['#52525B', '#71717A', '#A1A1AA', '#3F3F46', '#27272A'];
    const partyRingColor = partyNeutralTones[(party?.abbreviation?.length || 0) % partyNeutralTones.length];

    return (
      <HoverPrefetchLink href={`/politicians/${politician.id}`} className="group block w-full outline-none">
        <div
          className="h-auto md:h-[340px] p-[32px] bg-white/[0.02] border border-white/8 rounded-[4px] flex flex-col items-center text-center transition-all duration-220 ease-out hover:bg-white/[0.04] hover:border-white/20 hover:-translate-y-[2px] hover:shadow-[0_12px_24px_rgba(0,0,0,0.3)]"
        >
          {/* Avatar */}
          <div className="relative mb-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] rounded-full">
            <Avatar photoUrl={politician.photoUrl} name={politician.name} size={88} />
            {/* Colored Ring */}
            <div 
              className="absolute inset-[-4px] rounded-full border-[2px] opacity-70 pointer-events-none"
              style={{ borderColor: partyRingColor }}
            />
          </div>

          {/* Name */}
          <h3 className="font-serif font-black text-[#F5F5F7] leading-tight mb-3 text-[22px] tracking-tight line-clamp-2 min-h-[52px]">
            {politician.name}
          </h3>

          {/* Party */}
          <div className="flex items-center gap-2 justify-center mb-8">
            <span 
              className="px-[10px] py-[4px] rounded-[3px] text-[11px] font-semibold uppercase tracking-[0.05em] text-[#D4D4D8]"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
            >
              {party?.abbreviation || party?.name}
            </span>
          </div>

          <div className="w-full flex items-center justify-between mb-3">
            <span className="text-[#71717A] text-[12px] uppercase tracking-[0.1em]">Fulfillment</span>
            <span className="font-bold text-[20px] tabular-nums" style={{ color: fulfillmentColor }}>
              {fulfillmentRate}%
            </span>
          </div>
          
          <ProgressBar
            value={fulfillmentRate}
            color={fulfillmentColor}
            height="6px"
            className="mb-8"
          />

          <div className="mt-auto w-full flex justify-center">
            <div className="inline-flex items-center text-white text-[13px] uppercase tracking-[0.08em] font-medium group-focus-visible:ring-2 ring-white/50 ring-offset-4 ring-offset-[#090B12]">
              VIEW PROFILE
              <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </HoverPrefetchLink>
    );
  }

  // ── Grid view ──────────────────────────────────────────────
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="group relative bg-[#0a0c12] border border-white/5 rounded-2xl flex flex-col cursor-pointer overflow-hidden transition-all duration-300 hover:border-white/10"
      onClick={() => onClickPreview?.(politician)}
    >
      <div className="p-6 flex flex-col items-center text-center flex-1 relative">
        {/* Star Icon */}
        <div className="absolute top-6 right-6">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30 hover:text-white transition-colors">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        {/* Avatar */}
        <div className="mt-4 mb-4">
          <Avatar 
            photoUrl={politician.photoUrl} 
            name={politician.name} 
            size={88} 
            className="group-hover:ring-2 ring-white/10 transition-all duration-300" 
          />
        </div>

        {/* Name */}
        <h3 className="font-serif font-bold text-white text-[20px] leading-tight mb-2">
          {politician.name}
        </h3>

        {/* Party Badge */}
        {party && (
          <div className="mb-4">
            <span 
              className={clsx(
                "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider",
                party.id === 'bjp' ? "bg-[#f97316]/20 text-[#f97316]" : 
                party.id === 'inc' ? "bg-[#3b82f6]/20 text-[#3b82f6]" : 
                party.id === 'aap' ? "bg-[#0ea5e9]/20 text-[#0ea5e9]" : 
                "bg-white/10 text-white/70"
              )}
            >
              {party.abbreviation || party.name}
            </span>
          </div>
        )}

        {/* Location & Role */}
        <div className="flex flex-col items-center gap-1.5 mb-8">
          <div className="flex items-center gap-1.5 text-white/40 text-[12px]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>{politician.constituency}, {politician.state}</span>
          </div>
          {politician.position && (
            <div className="text-emerald-500/90 text-[12px] font-medium">
              {politician.position}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-3 gap-2 mt-auto pb-4 border-b border-white/5">
          <div className="text-center">
            <div className="text-white text-[16px] font-bold mb-0.5">
              {Math.max(1, Math.floor((2024 - (politician.termsSince || 2014)) / 5))}
            </div>
            <div className="text-white/40 text-[10px] uppercase tracking-wider">
              Terms
            </div>
          </div>
          <div className="text-center">
            <div className="text-white text-[16px] font-bold mb-0.5">
              {politician.yearsInPolitics || '10+'}
            </div>
            <div className="text-white/40 text-[10px] uppercase tracking-wider">
              Years in Politics
            </div>
          </div>
          <div className="text-center">
            <div className="text-white text-[16px] font-bold mb-0.5">
              {politician.attendancePercent}%
            </div>
            <div className="text-white/40 text-[10px] uppercase tracking-wider">
              Attendance
            </div>
          </div>
        </div>
      </div>

      {/* Footer link */}
      <HoverPrefetchLink
        href={`/politicians/${politician.id}`}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="w-full py-4 flex items-center justify-center gap-2 text-emerald-500/80 hover:text-emerald-400 bg-emerald-500/[0.02] hover:bg-emerald-500/[0.05] transition-all"
        style={{ fontSize: '12px', fontWeight: 600 }}
      >
        View Profile <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
      </HoverPrefetchLink>
    </motion.div>
  );
}
