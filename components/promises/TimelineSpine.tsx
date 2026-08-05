import { Promise as PromiseType, TimelineEvent } from '@/lib/types';
import { FileText, Megaphone, Landmark, FileCheck, FileSignature, Scale, ArrowRight, Flag } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

interface Props {
  promise: PromiseType;
}

const LIFECYCLE_STAGES = [
  { key: 'manifesto', label: 'Election Manifesto', icon: FileText },
  { key: 'speech', label: 'Public Speech', icon: Megaphone },
  { key: 'budget', label: 'Budget Allocation', icon: Landmark },
  { key: 'order', label: 'Government Order', icon: FileCheck },
  { key: 'tender', label: 'Tender', icon: FileSignature },
  { key: 'court', label: 'Court Order', icon: Scale },
];

function isEventMapped(event: TimelineEvent): boolean {
  const lower = event.title.toLowerCase() + event.description.toLowerCase();
  return (
    lower.includes('speech') ||
    lower.includes('budget') ||
    lower.includes('order') ||
    lower.includes('cabinet') ||
    lower.includes('notification') ||
    lower.includes('tender') ||
    lower.includes('court') ||
    lower.includes('supreme')
  );
}

export function TimelineSpine({ promise }: Props) {

  const getStageEvent = (stageKey: string): TimelineEvent | null => {
    return promise.timeline.find(t => {
      const lower = t.title.toLowerCase() + t.description.toLowerCase();
      if (stageKey === 'speech' && lower.includes('speech')) return true;
      if (stageKey === 'budget' && lower.includes('budget')) return true;
      if (stageKey === 'order' && (lower.includes('order') || lower.includes('cabinet') || lower.includes('notification'))) return true;
      if (stageKey === 'tender' && lower.includes('tender')) return true;
      if (stageKey === 'court' && (lower.includes('court') || lower.includes('supreme'))) return true;
      return false;
    }) || null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'operational': return 'text-[var(--accent-positive)]';
      case 'in_progress': case 'construction_started': case 'implementation_started':
      case 'tender_issued': case 'planning': return 'text-[var(--accent-info)]';
      case 'delayed': case 'partially_completed': case 'mostly_completed': return 'text-[var(--accent-warning)]';
      case 'cancelled': case 'no_verified_progress': return 'text-[var(--accent-negative)]';
      default: return 'text-[var(--text-tertiary)]';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed': case 'operational': return 'bg-[var(--accent-positive)]';
      case 'in_progress': case 'construction_started': case 'implementation_started':
      case 'tender_issued': case 'planning': return 'bg-[var(--accent-info)]';
      case 'delayed': case 'partially_completed': case 'mostly_completed': return 'bg-[var(--accent-warning)]';
      case 'cancelled': case 'no_verified_progress': return 'bg-[var(--accent-negative)]';
      default: return 'bg-[var(--text-tertiary)]';
    }
  };

  const statusColor = getStatusColor(promise.status);
  const statusBg = getStatusBg(promise.status);

  // If any unmapped (reported outcome) events exist in the timeline, hollow
  // intermediate stages are genuine evidence gaps — not just inapplicable.
  const hasVerifiedOutcome = promise.timeline.some(e => !isEventMapped(e));

  return (
    <div className="relative pl-6 py-4">
      {/* Vertical Spine */}
      <div className="absolute top-8 bottom-8 left-[35px] w-[2px] bg-[rgba(255,255,255,0.1)]" />

      {/* 1. Manifesto (always present) */}
      <div className="relative flex items-start gap-6 mb-10">
        <div className="relative z-10 w-6 h-6 rounded-full bg-[var(--bg-base)] border-[3px] border-[var(--text-primary)] mt-1 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-[var(--text-primary)]" />
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">Election Manifesto</h4>
            <span className="text-[11px] uppercase text-[#71717A] ml-2 font-bold">{new Date(promise.madeDate).getFullYear()}</span>
          </div>
          <p className="text-[13px] text-[#A1A1AA] leading-relaxed">
            &ldquo;{promise.manifestoExcerpt}&rdquo;
          </p>
        </div>
      </div>

      {/* 2–6. Canonical evidence chain stages */}
      {LIFECYCLE_STAGES.slice(1).map((stage) => {
        const event = getStageEvent(stage.key);
        const hasOccurred = !!event;
        // An evidence gap = stage missing but a later reported outcome is verified.
        const isEvidenceGap = !hasOccurred && hasVerifiedOutcome;
        const Icon = stage.icon;

        return (
          <div
            key={stage.key}
            className={clsx(
              "relative flex items-start gap-6 mb-10 transition-opacity duration-300",
              !hasOccurred && (isEvidenceGap ? "opacity-65" : "opacity-40")
            )}
          >
            <div className={clsx(
              "relative z-10 w-6 h-6 rounded-full mt-1 flex-shrink-0 border-[3px]",
              hasOccurred
                ? `bg-[var(--bg-base)] ${statusColor.replace('text-', 'border-')}`
                : isEvidenceGap
                  ? "bg-[var(--bg-base)] border-[#FBBF24]"
                  : "bg-[var(--bg-base)] border-[#71717A]"
            )} />

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={clsx(
                  "w-4 h-4",
                  hasOccurred ? "text-[var(--text-primary)]"
                  : isEvidenceGap ? "text-[#FBBF24]"
                  : "text-[#71717A]"
                )} />
                <h4 className={clsx(
                  "text-sm font-semibold",
                  hasOccurred ? "text-[var(--text-primary)]"
                  : isEvidenceGap ? "text-[#FBBF24]"
                  : "text-[#71717A]"
                )}>
                  {stage.label}
                </h4>
                {hasOccurred && event.date && (
                  <span className="text-[11px] uppercase text-[#71717A] ml-2 font-bold">
                    {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>

              {hasOccurred ? (
                <>
                  <p className="text-[13px] text-[#A1A1AA] leading-relaxed mb-2">{event.description}</p>
                  {event.evidenceIds.length > 0 && (
                    <Link href="/evidence" className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent-info)] transition-colors">
                      View Document <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </>
              ) : isEvidenceGap ? (
                <div className="mt-1">
                  <p className="text-[13px] text-[#D4D4D8] leading-relaxed">
                    No verified {stage.label.toLowerCase()} on record — this stage would normally precede the reported outcome below, but we have not located the primary document yet.
                  </p>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#FBBF24] hover:text-white transition-colors mt-2"
                  >
                    Have a source? Submit evidence <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <p className="text-[13px] text-[#A1A1AA] leading-relaxed">
                  No verified {stage.label.toLowerCase()} on record.
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Unmapped events = Reported Outcomes — distinct visual treatment from canonical evidence */}
      {promise.timeline.filter(e => !isEventMapped(e)).map(event => {
        const dotBorder =
          event.type === 'setback' ? 'border-[var(--accent-negative)]'
          : event.type === 'progress' ? 'border-[var(--accent-info)]'
          : 'border-[#FBBF24]';

        return (
          <div key={event.id} className="relative flex items-start gap-6 mb-10">
            <div className={clsx(
              "relative z-10 w-6 h-6 rounded-full mt-1 flex-shrink-0 border-[3px] bg-[var(--bg-base)]",
              dotBorder
            )} />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {/* Flag icon distinguishes this as a reported event, not a primary document stage */}
                <Flag className="w-4 h-4 text-[#FBBF24]" />
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">{event.title}</h4>
                <span className="text-[11px] uppercase text-[#71717A] font-bold">
                  {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.25)] text-[10px] font-bold uppercase tracking-widest text-[#FBBF24]">
                  Reported Outcome
                </span>
              </div>
              <p className="text-[13px] text-[#A1A1AA] leading-relaxed">{event.description}</p>
              <p className="text-[11px] text-[#52525B] mt-1.5 italic">
                Reported but may not be backed by a primary government document in our current archive.
              </p>
            </div>
          </div>
        );
      })}

      {/* Final: Current Status */}
      <div className="relative flex items-start gap-6">
        <div className={clsx("relative z-10 w-6 h-6 rounded-full mt-1 flex-shrink-0", statusBg)} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className={clsx("text-sm font-semibold", statusColor)}>Current Status</h4>
          </div>
          <div className={clsx(
            "inline-flex items-center px-3 py-1.5 rounded-[4px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]",
            statusColor
          )}>
            <span className="text-xs font-bold uppercase tracking-widest">{promise.status.replace(/_/g, ' ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
