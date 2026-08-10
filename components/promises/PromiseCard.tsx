'use client';

import Link from 'next/link';
import { Promise as PromiseType } from '@/lib/types';
import { POLITICIANS } from '@/data/politicians';
import { Clock, ArrowRight, FileText, AlertCircle, Users } from 'lucide-react';
import { PoliticianHoverCard } from '../politicians/PoliticianHoverCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { motion, useReducedMotion } from 'framer-motion';
import { getCompletionPercentage, getCompletionColor, getStatusMeta } from '@/lib/promises';

interface Props {
  promise: PromiseType;
  viewMode?: 'default' | 'compact';
  politicianProfileMode?: boolean;
  index?: number;
}


export function PromiseCard({ promise, viewMode = 'default', politicianProfileMode = false, index = 0 }: Props) {
  const shouldReduceMotion = useReducedMotion();
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
    current: 'text-[var(--color-accent-warning)]',
    overdue: 'text-[var(--color-accent-negative)]'
  } as const;

  
  if (viewMode === 'compact') {
    return (
      <motion.div 
        className="group block w-full outline-none"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.4, 
          delay: Math.min(index, 10) * 0.05,
          ease: 'easeOut'
        }}
      >
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
          className="card-glass h-full flex flex-col min-h-[340px]"
        >
          {/* Header row: status + category + confidence */}
          <div className="flex items-center gap-3 flex-wrap mb-6">
            <div 
              className="badge-meta !border-0"
              style={{ backgroundColor: statusMeta.bg, color: statusMeta.color }}
            >
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusMeta.color }} />
              <span>{statusMeta.label}</span>
            </div>

            <span className="text-[var(--color-border-strong)]">&middot;</span>

            <span className="text-meta">
              {promise.category.replace(/_/g, ' ')}
            </span>

            <span className="ml-auto font-mono font-bold text-[#A1A1AA] text-sm">
              <span className="font-sans mr-2 text-[10px] uppercase tracking-[0.08em] text-gray-500 hidden sm:inline">CONFIDENCE</span>
              {promise.confidenceScore}<span className="text-gray-500">/100</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-heading-md mb-4 text-balance">
            {promise.title}
          </h3>

          {/* Excerpt */}
          <p className="text-body-base line-clamp-3 mb-8">
            {promise.fullStatement}
          </p>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
            {politicianProfileMode ? (
              <Link href={`?tab=timeline&promiseId=${promise.id}`} className="inline-flex items-center text-white text-meta group-focus-visible:ring-2 ring-white/50 ring-offset-4 ring-offset-[var(--color-base)]">
                VIEW TIMELINE
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </Link>
            ) : (
              <div className="inline-flex items-center text-[var(--text-tertiary)] opacity-60 text-meta cursor-not-allowed">
                DETAILS COMING SOON
              </div>
            )}
            
            {promise.deadline && (
              <span className={`flex items-center gap-1.5 text-meta ${urgencyColors[urgency as keyof typeof urgencyColors]}`}>
                <Clock className="w-3.5 h-3.5" />
                {targetText}
              </span>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: Math.min(index, 10) * 0.05,
        ease: 'easeOut'
      }}
      whileHover={shouldReduceMotion ? {} : {
        y: -4,
        boxShadow: [
          'inset 0 0 0 1px rgba(255,255,255,0.12)',
          '0 8px 24px rgba(0,0,0,0.4)',
          '0 20px 48px rgba(0,0,0,0.28)',
          '0 1px 0 rgba(255,255,255,0.04)',
        ].join(', '),
      }}
      className="card-glass group flex flex-col md:flex-row mb-8 p-0 overflow-hidden"
    >
      {/* ── Left: Vertical Audit Trail (35%) ─────────────────── */}
      <div className="md:w-[35%] border-b md:border-b-0 md:border-r border-white/5 p-8 md:p-10 flex-shrink-0 bg-[#1A1F2E]">
        <div className="text-meta mb-8 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          Audit Trail
        </div>

        <div className="relative border-l border-white/20 ml-2 space-y-0">
          {recentEvents.length === 0 && (
            <div className="pl-6 pb-4 text-body-sm text-gray-500">
              No updates recorded.
            </div>
          )}
          {recentEvents.map((event, idx) => (
            <div key={idx} className="relative pl-6 pb-6 last:pb-0">
              <div className="absolute -left-[5px] top-[4px] w-2.5 h-2.5 rounded-full bg-[var(--color-text-tertiary)] ring-4 ring-[var(--color-raised)]" />
              <div className="text-meta mb-1 !text-[#A1A1AA]">
                {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </div>
              <div className="text-body-sm line-clamp-2">
                {event.description}
              </div>
              <div className="text-meta !text-[var(--text-tertiary)] opacity-60 mt-2 inline-block cursor-not-allowed">
                Details coming soon
              </div>
            </div>
          ))}
          {promise.timeline.length > 3 && (
            <div className="relative pl-6 mt-6">
              <div className="absolute -left-[5px] top-[4px] w-2.5 h-2.5 rounded-full bg-transparent border-2 border-white/20" />
              <div className="text-meta !text-gray-500">
                +{promise.timeline.length - 3} earlier events
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Editorial Content (65%) ─────────────────────── */}
      <div className="md:w-[65%] p-8 md:p-10 flex flex-col">

        {/* Header row: status + category + docs + confidence */}
        <div className="flex items-center gap-3 flex-wrap mb-6">
          <div
            className="badge-meta !border-0"
            style={{ color: statusMeta.color, backgroundColor: statusMeta.bg }}
          >
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusMeta.color }} />
            {statusMeta.label}
          </div>

          <span className="text-[var(--color-border-strong)]">&middot;</span>

          <span className="text-meta">
            {promise.category.replace(/_/g, ' ')}
          </span>

          <div className="flex items-center gap-1.5 badge-meta">
            <FileText className="w-3.5 h-3.5 text-gray-500" />
            {promise.evidenceIds.length} DOCS
          </div>

          {/* Data-quality flag: high confidence score but no attached documents */}
          {promise.evidenceIds.length === 0 && promise.confidenceScore > 70 && (
            <div
              className="flex items-center gap-1.5 text-meta !text-[var(--color-accent-warning)] bg-[var(--color-accent-warning-dim)] px-2 py-1.5 rounded-[var(--radius-sm)] ml-1"
              title="High confidence score assigned, but no primary documents are currently attached to this entry. This may indicate a data-completeness gap."
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Docs missing
            </div>
          )}

          <span className="ml-auto font-mono font-bold text-[#A1A1AA] text-sm">
            <span className="font-sans mr-2 text-[10px] uppercase tracking-[0.08em] text-gray-500 hidden sm:inline">CONFIDENCE</span>
            {promise.confidenceScore}<span className="text-gray-500">/100</span>
          </span>
        </div>

        {/* Title */}
        <div className="block mb-6 group/link">
          <h3 className="text-heading-xl">
            {promise.title}
          </h3>
        </div>

        {/* Excerpt */}
        <p className="text-body-lg mb-8 line-clamp-3">
          {promise.fullStatement}
        </p>

        {/* Completion Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-meta mb-3">
            <span>Completion</span>
            <span style={{ color: getCompletionColor(getCompletionPercentage(promise.status)) }}>
              {getCompletionPercentage(promise.status)}%
            </span>
          </div>
          <ProgressBar 
            value={getCompletionPercentage(promise.status)} 
            color={getCompletionColor(getCompletionPercentage(promise.status))} 
            height="8px" 
          />
        </div>

        {/* Footer row */}
        <div className="mt-10 flex items-center justify-between flex-wrap gap-4 pt-8 border-t border-white/5">
          <div className="flex items-center gap-4">
            {politicianProfileMode ? (
              <Link href={`?tab=timeline&promiseId=${promise.id}`} className="flex items-center text-meta text-white hover:text-[var(--color-accent-info)] transition-colors">
                View Timeline <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            ) : (
              <span className="text-meta !text-[#A1A1AA]">
                <PoliticianHoverCard politicianId={promise.politicianId}>
                  <span className="hover:text-white transition-colors cursor-pointer">{politician?.name || 'Unknown'}</span>
                </PoliticianHoverCard>
              </span>
            )}
          </div>

          {promise.deadline && (
            <span className={`flex items-center gap-1.5 text-meta ${urgencyColors[urgency as keyof typeof urgencyColors]}`}>
              <Clock className="w-4 h-4" />
              {targetText}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
