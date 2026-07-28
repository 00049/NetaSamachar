/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PROMISES, EVIDENCE } from '@/data/promises';
import { POLITICIANS, PARTIES } from '@/data/politicians';
import { StatusBadge, CategoryBadge } from '@/components/ui/Badges';
import { TimelineSpine } from '@/components/promises/TimelineSpine';
import { ConfidenceScore } from '@/components/ui/ConfidenceScore';
import { EVIDENCE_TYPE_CONFIG, STATUS_CONFIG } from '@/lib/utils';
import clsx from 'clsx';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const promise = PROMISES.find(p => p.id === id);
  if (!promise) return { title: 'Promise Not Found' };
  return {
    title: `${promise.title} | Evidence Log`,
    description: `Tracking the status and evidence for: "${promise.fullStatement}"`,
  };
}

export function generateStaticParams() {
  return PROMISES.map(p => ({ id: p.id }));
}

export default async function PromiseDetailPage({ params }: Props) {
  const { id } = await params;
  const promise = PROMISES.find(p => p.id === id);
  if (!promise) notFound();

  const politician = POLITICIANS.find(p => p.id === promise.politicianId);
  const party = PARTIES.find(p => p.id === promise.partyId);
  const promiseEvidence = EVIDENCE.filter(e => promise.evidenceIds.includes(e.id));
  const statusConfig = STATUS_CONFIG[promise.status];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-12">
        <Link href="/promises" className="hover:text-[var(--text-primary)] transition-colors">Database</Link>
        <span>/</span>
        <span className="text-[var(--text-primary)] truncate max-w-sm">{promise.title}</span>
      </div>

      {/* ===== PROMISE HEADER ===== */}
      <div className="border-b-4 border-[var(--text-primary)] pb-12 mb-12">
        <div className="flex flex-wrap items-start gap-4 mb-8">
          <StatusBadge status={promise.status} size="lg" />
          <CategoryBadge category={promise.category} size="lg" />
          <div className="ml-auto w-48">
            <ConfidenceScore score={promise.confidenceScore} size="md" showLabel showBar />
          </div>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-black text-[var(--text-primary)] leading-tight mb-8 max-w-4xl">
          {promise.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <div className="border border-[var(--border-subtle)] p-6 mb-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-3">Original Promise Statement</div>
              <p className="font-serif text-xl text-[var(--text-primary)] leading-relaxed italic">
                "{promise.fullStatement}"
              </p>
            </div>

            {promise.manifestoExcerpt !== promise.fullStatement && (
              <div className="p-6 bg-[var(--bg-base)]">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Manifesto Excerpt ({promise.manifestoYear})</div>
                <p className="text-sm text-[var(--text-primary)] leading-relaxed">"{promise.manifestoExcerpt}"</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Meta */}
            <div className="border border-[var(--border-subtle)] p-4 space-y-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">Promised On</div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">{new Date(promise.madeDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              {promise.deadline && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">Target Deadline</div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">{new Date(promise.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              )}
              {promise.state && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">Jurisdiction / Scope</div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">{promise.state}</div>
                </div>
              )}
            </div>

            {/* Politician */}
            {politician && (
              <Link href={`/politicians/${politician.id}`} className="block border border-[var(--border-subtle)] p-4 hover:border-[var(--text-primary)] transition-colors">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-3">Made By</div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border border-[var(--border-subtle)] flex items-center justify-center font-serif font-black text-lg text-[var(--text-primary)]">
                    {politician.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[var(--text-primary)] text-sm font-bold">{politician.name}</div>
                    <div className="text-[var(--text-tertiary)] text-[10px] uppercase tracking-widest mt-0.5">{party?.abbreviation} • {politician.constituency}</div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* ===== TIMELINE ===== */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-subtle)]">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)]">
              Evidence Log & Timeline
            </h2>
            <span className="text-[var(--text-tertiary)] text-xs font-bold">{promise.timeline.length} EVENTS</span>
          </div>
          
          <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-[4px] p-6 md:p-10 mt-6">
            <TimelineSpine promise={promise} />
          </div>
        </div>

        {/* ===== SIDEBAR: Evidence + Classification ===== */}
        <div className="space-y-8">
          {/* Current Status */}
          <div className="border-t-4 border-[var(--text-primary)] pt-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-4">Current Status Classification</h3>
            <div className={clsx('flex items-start gap-4 p-4 border', statusConfig.colorClass)}>
              <span className="text-2xl">{statusConfig.icon}</span>
              <div>
                <div className="font-bold uppercase tracking-widest text-sm mb-1">{statusConfig.label}</div>
                <div className="text-[var(--text-tertiary)] text-xs leading-relaxed">{statusConfig.description}</div>
              </div>
            </div>
          </div>

          {/* Evidence Documents */}
          {promiseEvidence.length > 0 && (
            <div className="border-t border-[var(--border-subtle)] pt-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-4">
                Primary Evidence Sources
              </h3>
              <div className="space-y-4">
                {promiseEvidence.map(ev => {
                  const typeConfig = EVIDENCE_TYPE_CONFIG[ev.type];
                  return (
                    <div key={ev.id} className="p-4 border border-[var(--border-subtle)] bg-[var(--bg-base)]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest">Tier {typeConfig.tier}</span>
                        <span className="text-[var(--border-subtle)]">|</span>
                        <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest line-clamp-1">{typeConfig.label}</span>
                      </div>
                      <h4 className="font-serif font-bold text-[var(--text-primary)] text-sm mb-2">{ev.title}</h4>
                      <p className="text-[var(--text-tertiary)] text-xs leading-relaxed mb-4 italic">"{ev.excerpt}"</p>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-0.5">SHA-256 Checksum</span>
                          <code className="text-[10px] font-mono text-[var(--text-primary)] bg-[var(--border-subtle)] px-1" title={ev.sha256Hash}>
                            {ev.sha256Hash.substring(0, 16)}...
                          </code>
                        </div>
                        {ev.sourceUrl && (
                          <a
                            href={ev.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-info)] hover-underline"
                          >
                            Source →
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dispute Portal */}
          <div className="border border-[var(--border-subtle)] p-6 bg-[var(--bg-base)]">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-2">Dispute Classification</h3>
            <p className="text-[var(--text-tertiary)] text-xs leading-relaxed mb-4">
              If you possess primary evidence that contradicts this classification (e.g. a subsequent Gazette notification), submit it for editorial review. Response within 72h.
            </p>
            <button className="w-full py-3 border border-[var(--text-primary)] text-[var(--text-primary)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--text-primary)] hover:text-[var(--bg-base)] transition-colors">
              Submit Counter-Evidence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
