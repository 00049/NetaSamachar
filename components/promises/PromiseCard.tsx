'use client';

import Link from 'next/link';
import { Promise } from '@/lib/types';
import { POLITICIANS } from '@/data/politicians';
import { motion } from 'framer-motion';
import {
  Circle, CircleDot, CheckCircle2, XCircle, AlertCircle,
  Clock, FileText, ChevronRight, ArrowRight
} from 'lucide-react';
import clsx from 'clsx';

interface Props {
  promise: Promise;
  viewMode?: 'default' | 'compact';
}

const getStatusMeta = (status: string): { color: string; bg: string; label: string } => {
  switch (status) {
    case 'completed':
    case 'operational':
      return { color: '#34D399', bg: 'rgba(52,211,153,0.12)', label: status.replace(/_/g, ' ') };
    case 'in_progress':
    case 'construction_started':
    case 'implementation_started':
    case 'tender_issued':
    case 'planning':
      return { color: '#60A5FA', bg: 'rgba(96,165,250,0.12)', label: status.replace(/_/g, ' ') };
    case 'delayed':
    case 'no_verified_progress':
    case 'partially_completed':
    case 'mostly_completed':
      return { color: '#FBBF24', bg: 'rgba(251,191,36,0.12)', label: status.replace(/_/g, ' ') };
    case 'cancelled':
    case 'insufficient_evidence':
    case 'unable_to_verify':
      return { color: '#F87171', bg: 'rgba(248,113,113,0.12)', label: status.replace(/_/g, ' ') };
    default:
      return { color: '#A1A1AA', bg: 'rgba(161,161,170,0.12)', label: status.replace(/_/g, ' ') };
  }
};

export function PromiseCard({ promise, viewMode = 'default' }: Props) {
  const politician = POLITICIANS.find(p => p.id === promise.politicianId);
  const statusMeta = getStatusMeta(promise.status);

  // Most recent 3 timeline events
  const recentEvents = [...promise.timeline]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  
  const currentYear = new Date().getFullYear();
  let urgency = 'neutral';
  let targetText = promise.deadline ? `Target ${new Date(promise.deadline).getFullYear()}` : '';
  
  if (promise.deadline && !['completed', 'operational'].includes(promise.status)) {
    const targetYear = new Date(promise.deadline).getFullYear();
    if (targetYear < currentYear) {
      urgency = 'overdue';
      targetText = `OVERDUE — Target was ${targetYear}`;
    } else if (targetYear === currentYear) {
      urgency = 'current';
    } else {
      urgency = 'future';
    }
  }

  const urgencyColors = {
    neutral: 'text-[#A1A1AA]',
    current: 'text-[var(--accent-warning)]',
    overdue: 'text-[var(--accent-negative)]'
  } as const;

  
  if (viewMode === 'compact') {
    return (
      <Link href={`/promises/${promise.id}`} className="group block w-full outline-none">
        <div
          className="h-auto md:h-[340px] p-[32px] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-[4px] flex flex-col transition-all duration-220 ease-out hover:bg-[rgba(255,255,255,0.04)] hover:border-white/20 hover:-translate-y-[2px] hover:shadow-[0_12px_24px_rgba(0,0,0,0.3)]"
        >
          {/* Header row: status + category + confidence */}
          <div className="flex items-center gap-3 flex-wrap mb-6">
            <div 
              className="h-[24px] px-[10px] rounded-[3px] flex items-center gap-[6px]"
              style={{ backgroundColor: statusMeta.bg }}
            >
              <div className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ backgroundColor: statusMeta.color }} />
              <span className="text-[11px] uppercase font-semibold tracking-[0.04em] leading-none mt-px" style={{ color: statusMeta.color }}>
                {statusMeta.label}
              </span>
            </div>

            <span className="text-[var(--border-default)]">&middot;</span>

            <span
              className="text-[var(--text-tertiary)] font-bold uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.08em' }}
            >
              {promise.category.replace(/_/g, ' ')}
            </span>

            <span className="ml-auto font-mono font-bold text-[var(--text-secondary)]" style={{ fontSize: '12px' }}>
              <span className="font-sans mr-2 text-[10px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] hidden sm:inline">CONFIDENCE</span>
              {promise.confidenceScore}<span className="text-[var(--text-tertiary)]">/100</span>
            </span>
          </div>

          {/* Title */}
          <h3 
            className="text-[22px] font-semibold text-[#F5F5F7] line-clamp-2 mb-4 group-hover:underline"
            style={{ lineHeight: 1.3 }}
          >
            {promise.title}
          </h3>

          {/* Excerpt */}
          <p 
            className="text-[15px] text-[#A1A1AA] line-clamp-3 mb-6"
            style={{ lineHeight: 1.6 }}
          >
            {promise.fullStatement}
          </p>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] pt-6">
            <div className="inline-flex items-center text-white text-[13px] uppercase tracking-[0.08em] font-medium group-focus-visible:ring-2 ring-white/50 ring-offset-4 ring-offset-[#090B12]">
              VIEW INVESTIGATION
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </div>
            
            {promise.deadline && (
              <span
                className={`flex items-center gap-1.5 font-bold uppercase ${urgencyColors[urgency as keyof typeof urgencyColors]}`}
                style={{ fontSize: '11px', letterSpacing: '0.05em' }}
              >
                <Clock className="w-3.5 h-3.5" />
                {targetText}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.2)' }}
      className="group bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-[4px] p-[32px] flex flex-col md:flex-row glide-transition mb-6"
    >
      {/* ── Left: Vertical Audit Trail (35%) ─────────────────── */}
      <div className="md:w-[35%] border-b md:border-b-0 md:border-r border-[rgba(255,255,255,0.08)] pb-8 md:pb-0 md:pr-8 flex-shrink-0">
        <div className="text-[#D4D4D8] font-bold uppercase mb-6 flex items-center gap-2 text-[11px] tracking-[0.1em]">
          <Clock className="w-3.5 h-3.5 text-[#A1A1AA]" />
          Audit Trail
        </div>

        <div className="relative border-l-2 border-[rgba(255,255,255,0.1)] ml-1.5 space-y-0">
          {recentEvents.length === 0 && (
            <div className="pl-5 pb-3 text-[#A1A1AA] text-[13px]">
              No updates recorded.
            </div>
          )}
          {recentEvents.map((event, idx) => (
            <div key={idx} className="relative pl-5 pb-[12px]">
              <div className="absolute -left-[5px] top-[5px] w-2 h-2 rounded-full bg-[#71717A] ring-4 ring-[var(--bg-base)]" />
              <div className="text-[#71717A] font-semibold uppercase mb-1 text-[11px] tracking-[0.05em]">
                {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </div>
              <div className="text-[#A1A1AA] text-[13px] leading-[1.5] line-clamp-2">
                {event.description}
              </div>
              <Link href={`/promises/${promise.id}`} className="text-[11px] font-semibold text-white/50 hover:text-white mt-1 inline-block">Read more &rarr;</Link>
            </div>
          ))}
          {promise.timeline.length > 3 && (
            <div className="relative pl-5">
              <div className="absolute -left-[5px] top-[5px] w-2 h-2 rounded-full bg-transparent border border-[rgba(255,255,255,0.2)]" />
              <div className="text-[#71717A] text-[11px] font-medium">
                +{promise.timeline.length - 3} earlier events
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Editorial Content (65%) ─────────────────────── */}
      <div className="md:w-[65%] pt-8 md:pt-0 md:pl-8 flex flex-col">

        {/* Header row: status + category + docs + confidence */}
        <div className="flex items-center gap-3 flex-wrap mb-5">
          <div
            className="flex items-center gap-[6px] font-bold uppercase h-[24px] px-[10px] rounded-[3px]"
            style={{ color: statusMeta.color, backgroundColor: statusMeta.bg, fontSize: '11px', letterSpacing: '0.04em' }}
          >
            <div className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ backgroundColor: statusMeta.color }} />
            {statusMeta.label}
          </div>

          <span className="text-[var(--border-default)]">&middot;</span>

          <span
            className="text-[var(--text-tertiary)] font-bold uppercase"
            style={{ fontSize: '10px', letterSpacing: '0.08em' }}
          >
            {promise.category.replace(/_/g, ' ')}
          </span>

          <div
            className="flex items-center gap-1.5 font-semibold text-[12px] bg-white/[0.06] rounded-[4px] px-[10px] py-[4px] text-white ml-2"
          >
            <FileText className="w-3.5 h-3.5 text-[#A1A1AA]" />
            {promise.evidenceIds.length} DOCS
          </div>

          <span className="ml-auto font-mono font-bold text-[var(--text-secondary)]" style={{ fontSize: '12px' }}>
            <span className="font-sans mr-2 text-[10px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] hidden sm:inline">CONFIDENCE</span>
            {promise.confidenceScore}<span className="text-[var(--text-tertiary)]">/100</span>
          </span>
        </div>

        {/* Title */}
        <Link href={`/promises/${promise.id}`} className="block mb-4 group/link">
          <h3
            className="font-serif font-bold text-[var(--text-primary)] leading-tight hover:underline"
            style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', letterSpacing: '-0.01em' }}
          >
            {promise.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-[var(--text-secondary)] leading-[1.6] mb-8 line-clamp-3" style={{ fontSize: '15px' }}>
          {promise.fullStatement}
        </p>

        {/* Footer row */}
        <div className="mt-auto flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-4" style={{ fontSize: '11px', letterSpacing: '0.06em' }}>
            <span className="text-[#A1A1AA] font-bold uppercase">
              {politician?.name || 'Unknown'}
            </span>
          </div>

          {promise.deadline && (
            <span
              className={`flex items-center gap-1.5 font-bold uppercase ${urgencyColors[urgency as keyof typeof urgencyColors]}`}
              style={{ fontSize: '11px', letterSpacing: '0.05em' }}
            >
              <Clock className="w-3.5 h-3.5" />
              {targetText}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
