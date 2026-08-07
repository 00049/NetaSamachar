'use client';

import Link from 'next/link';
import { Promise as PromiseType } from '@/lib/types';
import { POLITICIANS } from '@/data/politicians';
import { Clock, ArrowRight, FileText, AlertCircle, Users } from 'lucide-react';
import { PoliticianHoverCard } from '../politicians/PoliticianHoverCard';

interface Props {
  promise: PromiseType;
  viewMode?: 'default' | 'compact';
  politicianProfileMode?: boolean;
}

const getCompletionPercentage = (status: string): number => {
  switch (status) {
    case 'completed':
    case 'operational': return 100;
    case 'mostly_completed': return 75;
    case 'partially_completed': return 50;
    case 'in_progress':
    case 'construction_started':
    case 'implementation_started': return 25;
    case 'tender_issued': return 10;
    case 'planning': return 5;
    case 'delayed': return 25;
    default: return 0;
  }
};

const getCompletionColor = (percent: number): string => {
  if (percent >= 66) return 'var(--color-accent-positive)';
  if (percent >= 34) return 'var(--color-accent-warning)';
  return 'var(--color-accent-negative)';
};

const getStatusMeta = (status: string): { color: string; bg: string; label: string } => {
  switch (status) {
    case 'completed':
    case 'operational':
      return { color: 'var(--color-accent-positive)', bg: 'var(--color-accent-positive-dim)', label: status.replace(/_/g, ' ') };
    case 'in_progress':
    case 'construction_started':
    case 'implementation_started':
    case 'tender_issued':
    case 'planning':
      return { color: 'var(--color-accent-info)', bg: 'var(--color-accent-info-dim)', label: status.replace(/_/g, ' ') };
    case 'delayed':
    case 'no_verified_progress':
    case 'partially_completed':
    case 'mostly_completed':
      return { color: 'var(--color-accent-warning)', bg: 'var(--color-accent-warning-dim)', label: status.replace(/_/g, ' ') };
    case 'cancelled':
    case 'insufficient_evidence':
    case 'unable_to_verify':
      return { color: 'var(--color-accent-negative)', bg: 'var(--color-accent-negative-dim)', label: status.replace(/_/g, ' ') };
    default:
      return { color: 'var(--color-text-secondary)', bg: 'var(--color-border-subtle)', label: status.replace(/_/g, ' ') };
  }
};

export function PromiseCard({ promise, viewMode = 'default', politicianProfileMode = false }: Props) {
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
      <Link href={`/promises/${promise.id}`} className="group block w-full outline-none">
        <div className="card-glass card-hover h-full flex flex-col min-h-[340px]">
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
          <h3 className="text-heading-md mb-4 group-hover:underline text-balance">
            {promise.title}
          </h3>

          {/* Excerpt */}
          <p className="text-body-base line-clamp-3 mb-8">
            {promise.fullStatement}
          </p>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
            {politicianProfileMode ? (
              <Link href={`?tab=timeline&promiseId=${promise.id}`} className="inline-flex items-center text-white text-meta group-focus-visible:ring-2 ring-white/50 ring-offset-4 ring-offset-[var(--color-base)]">
                VIEW TIMELINE
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </Link>
            ) : (
              <div className="inline-flex items-center text-white text-meta group-focus-visible:ring-2 ring-white/50 ring-offset-4 ring-offset-[var(--color-base)]">
                VIEW INVESTIGATION
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </div>
            )}
            
            {promise.deadline && (
              <span className={`flex items-center gap-1.5 text-meta ${urgencyColors[urgency as keyof typeof urgencyColors]}`}>
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
    <div className="card-glass card-hover group flex flex-col md:flex-row mb-8 p-0 overflow-hidden">
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
              <Link href={`/promises/${promise.id}`} className="text-meta !text-gray-500 hover:!text-white mt-2 inline-block">
                Read more &rarr;
              </Link>
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
        <Link href={`/promises/${promise.id}`} className="block mb-6 group/link">
          <h3 className="text-heading-xl hover:underline">
            {promise.title}
          </h3>
        </Link>

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
          <div className="w-full bg-[var(--color-border-subtle)] h-2 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-out" 
              style={{ 
                width: `${getCompletionPercentage(promise.status)}%`,
                backgroundColor: getCompletionColor(getCompletionPercentage(promise.status))
              }} 
            />
          </div>
        </div>

        {/* Footer row */}
        <div className="mt-auto flex items-center justify-between flex-wrap gap-4 pt-8 border-t border-white/5">
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
    </div>
  );
}
