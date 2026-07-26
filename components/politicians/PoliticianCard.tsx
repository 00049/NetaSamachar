'use client';

import { Politician } from '@/lib/types';
import { PARTIES } from '@/data/politicians';
import { formatCurrency, getPromiseFulfillmentRate } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { CheckSquare, Square, ChevronRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
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
      <Link href={`/politicians/${politician.id}`} className="group block w-full outline-none">
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
      </Link>
    );
  }

  // ── Grid view ──────────────────────────────────────────────
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="group relative bg-[var(--bg-base)] border-r border-b border-[var(--border-subtle)] flex flex-col cursor-pointer overflow-hidden card-hover"
      onClick={() => onClickPreview?.(politician)}
    >
      <div className="p-8 flex flex-col items-center text-center flex-1">

        {/* Avatar — neutral, monochrome */}
        <Avatar 
          photoUrl={politician.photoUrl} 
          name={politician.name} 
          size={80} 
          className="mb-6 group-hover:border-[var(--border-default)] glide-transition" 
        />

        {/* Name */}
        <h3
          className="font-serif font-bold text-[var(--text-primary)] leading-tight mb-2"
          style={{ fontSize: '17px', letterSpacing: '-0.01em' }}
        >
          {politician.name}
        </h3>

        {/* Party + constituency */}
        <div className="flex items-center gap-2 justify-center mb-6 flex-wrap">
          <span className="badge">{party?.abbreviation || party?.name}</span>
          <span className="text-[var(--text-tertiary)]" style={{ fontSize: '10px' }}>·</span>
          <span
            className="text-[var(--text-tertiary)] font-medium uppercase"
            style={{ fontSize: '10px', letterSpacing: '0.06em' }}
          >
            {politician.constituency}
          </span>
        </div>

        {/* Divider */}
        <div className="divider-h w-full mb-6" />

        {/* Stats grid */}
        <div className="w-full grid grid-cols-2 gap-y-5 gap-x-6 text-left">

          {/* Promises */}
          <div>
            <div className="stat-block__label">Promises</div>
            <div className="font-mono font-bold text-[var(--text-primary)]" style={{ fontSize: '20px' }}>
              {fulfillmentRate}%
            </div>
            <div className="text-[var(--text-tertiary)] mt-0.5" style={{ fontSize: '10px' }}>
              {politician.promisesFulfilled}/{politician.promisesTotal} fulfilled
            </div>
          </div>

          {/* Attendance */}
          <div>
            <div className="stat-block__label">Attendance</div>
            <div className="font-mono font-bold text-[var(--text-primary)]" style={{ fontSize: '20px' }}>
              {politician.attendancePercent}%
            </div>
            <ProgressBar
              value={politician.attendancePercent}
              color={
                politician.attendancePercent < 50
                  ? 'var(--accent-negative)'
                  : politician.attendancePercent <= 80
                  ? 'var(--accent-warning)'
                  : 'var(--accent-positive)'
              }
              height="4px"
              className="mt-2"
            />
          </div>

          {/* Assets */}
          <div>
            <div className="stat-block__label">Net Assets</div>
            <div
              className="font-mono font-bold text-[var(--text-primary)] truncate"
              style={{ fontSize: '13px' }}
            >
              {formatCurrency(politician.latestNetWorth)}
            </div>
          </div>

          {/* Legal Risk — semantic color, no fill */}
          <div>
            <div className="stat-block__label">Legal Risk</div>
            {totalCases === 0 ? (
              <div className="font-mono font-bold text-[var(--accent-positive)]" style={{ fontSize: '13px' }}>
                Clear
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                {hasSevereCases && <AlertTriangle className="w-3 h-3 text-[var(--accent-negative)]" />}
                <span
                  className={clsx('font-mono font-bold', {
                    'text-[var(--accent-negative)]':    hasSevereCases,
                    'text-[var(--accent-warning)]': !hasSevereCases,
                  })}
                  style={{ fontSize: '13px' }}
                >
                  {totalCases} {totalCases === 1 ? 'case' : 'cases'}
                </span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Footer link */}
      <Link
        href={`/politicians/${politician.id}`}
        onClick={(e) => e.stopPropagation()}
        className="border-t border-[var(--border-subtle)] px-8 py-4 flex items-center justify-between text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] glide-transition"
        style={{ fontSize: '10px', letterSpacing: '0.1em', fontWeight: 700 }}
      >
        <span className="uppercase">View Full Dossier</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </motion.div>
  );
}
