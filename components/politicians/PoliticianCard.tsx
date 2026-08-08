'use client';

import React, { useState } from 'react';
import { Politician } from '@/lib/types';
import { PARTIES } from '@/data/politicians';
import { formatCurrency, getPromiseFulfillmentRate } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { HoverPrefetchLink } from '@/components/ui/HoverPrefetchLink';
import { motion, useReducedMotion } from 'framer-motion';
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
  lazy = false,
}: Props) {
  const [isStarred, setIsStarred] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
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
        <Avatar photoUrl={politician.photoUrl} name={politician.name} size={40} priority={!lazy} />

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
          className="h-auto md:h-[340px] p-[32px] bg-white/[0.02] border border-white/8 rounded-sm flex flex-col items-center text-center transition-all duration-220 ease-out hover:bg-white/[0.04] hover:border-white/20 hover:-translate-y-[2px] hover:shadow-[0_12px_24px_rgba(0,0,0,0.3)]"
        >
          {/* Avatar */}
          <div className="relative mb-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] rounded-full">
            <Avatar photoUrl={politician.photoUrl} name={politician.name} size={88} priority={!lazy} />
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
              className="px-[10px] py-[4px] rounded-sm text-[11px] font-semibold uppercase tracking-[0.05em] text-[#D4D4D8]"
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
            <div className="inline-flex items-center text-white text-[13px] uppercase tracking-[0.08em] font-medium group-focus-visible:ring-2 ring-white/50 ring-offset-4 ring-offset-[var(--bg-base)]">
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
      whileHover={shouldReduceMotion ? {} : {
        y: -4,
        boxShadow: [
          'inset 0 0 0 1px rgba(255,255,255,0.12)',
          '0 8px 24px rgba(0,0,0,0.4)',
          '0 20px 48px rgba(0,0,0,0.28)',
          '0 1px 0 rgba(255,255,255,0.04)',
        ].join(', '),
      }}
      transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 25 }}
      className="card-elevated h-full group relative flex flex-col cursor-pointer overflow-hidden"
      onClick={() => onClickPreview?.(politician)}
    >
      <div className="px-7 pt-7 pb-6 flex flex-col items-center text-center flex-1 relative">
        {/* Star Icon — interactive with micro-animation */}
        <div className="absolute top-5 right-5 z-20">
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsStarred(!isStarred);
            }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.85 }}
            className="focus:outline-none p-1 -m-1 rounded-full"
          >
            <motion.svg 
              width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" 
              className="transition-colors duration-200"
              initial={false}
              animate={{ 
                fill: "var(--color-brand-primary)",
                fillOpacity: isStarred ? 1 : 0,
                stroke: isStarred ? "var(--color-brand-primary)" : "rgba(255,255,255,0.2)",
                scale: isStarred && !shouldReduceMotion ? [1, 1.25, 1] : 1 
              }}
              transition={{
                default: shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 17 },
                scale: { type: 'tween', duration: 0.3 }
              }}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </motion.svg>
          </motion.button>
        </div>

        {/* Avatar — inset ring matches detail page avatar treatment */}
        <div className="mt-4 mb-5 relative">
          <div className="rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
            <Avatar
              photoUrl={politician.photoUrl}
              name={politician.name}
              size={84}
              priority={!lazy}
            />
          </div>
        </div>

        {/* Name — serif, tight tracking, matches detail page h1 treatment */}
        <h3 className="font-serif font-bold text-white text-[19px] leading-[1.2] tracking-[-0.01em] mb-1.5 px-2">
          {politician.name}
        </h3>

        {/* Party Badge */}
        {party && (
          <div className="mb-3">
            <span
              className={clsx(
                'px-2 py-0.5 rounded text-[10px] font-bold tracking-[0.06em] uppercase',
                party.id === 'bjp' ? 'bg-[#f97316]/15 text-[#f97316]' :
                party.id === 'inc' ? 'bg-[#3b82f6]/15 text-[#3b82f6]' :
                party.id === 'aap' ? 'bg-[#0ea5e9]/15 text-[#0ea5e9]' :
                'bg-white/8 text-white/60'
              )}
            >
              {party.abbreviation || party.name}
            </span>
          </div>
        )}

        {/* Location & Role */}
        <div className="flex flex-col items-center gap-1 mb-6">
          <div className="flex items-center gap-1.5 text-[var(--text-tertiary)] text-[11px] tracking-wide">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>{politician.constituency}, {politician.state}</span>
          </div>
          {/* Position is biographical metadata — secondary text, not brand green */}
          {politician.position && (
            <div className="text-[var(--text-secondary)] text-[11px] font-medium tracking-wide">
              {politician.position}
            </div>
          )}
        </div>

        {/* Stats Grid — mono labels for editorial hierarchy */}
        <div className="w-full grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-white/[0.06]">
          <div className="text-center">
            <div className="text-white text-[15px] font-bold tabular-nums mb-0.5">
              {Math.max(1, Math.floor((2024 - (politician.termsSince || 2014)) / 5))}
            </div>
            <div className="font-mono text-[var(--text-tertiary)] text-[9px] uppercase tracking-[0.08em]">
              Terms
            </div>
          </div>
          <div className="text-center">
            <div className="text-white text-[15px] font-bold tabular-nums mb-0.5">
              {politician.yearsInPolitics || '10+'}
            </div>
            <div className="font-mono text-[var(--text-tertiary)] text-[9px] uppercase tracking-[0.08em]">
              Yrs Active
            </div>
          </div>
          <div className="text-center">
            <div className="text-white text-[15px] font-bold tabular-nums mb-0.5">
              {politician.attendancePercent}%
            </div>
            <div className="font-mono text-[var(--text-tertiary)] text-[9px] uppercase tracking-[0.08em]">
              Attendance
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA — brand-primary green is correct here: it's the site's action accent */}
      <HoverPrefetchLink
        href={`/politicians/${politician.id}`}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="w-full py-3.5 flex items-center justify-center gap-2 text-[var(--color-brand-primary)]/70 hover:text-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/[0.03] hover:bg-[var(--color-brand-primary)]/[0.07] transition-all duration-200 border-t border-white/[0.04]"
        style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em' }}
      >
        VIEW PROFILE
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
      </HoverPrefetchLink>
    </motion.div>
  );
}
