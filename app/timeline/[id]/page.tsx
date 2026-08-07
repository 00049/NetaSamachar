import { getTimelineEvent } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ChevronRight, Activity, FileText, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getTimelineEvent(id);
  if (!event) return { title: 'Timeline Event Not Found' };
  return {
    title: `${event.title} | Timeline | Neta Samachar`,
    description: event.description,
  };
}

export default async function TimelineEventPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getTimelineEvent(id);
  
  if (!event) {
    notFound();
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'progress': return 'text-green-500 border-green-500/20 bg-green-500/5';
      case 'setback': return 'text-red-500 border-red-500/20 bg-red-500/5';
      case 'milestone': return 'text-[#e6b16a] border-[#e6b16a]/20 bg-[#e6b16a]/5';
      default: return 'text-blue-500 border-blue-500/20 bg-blue-500/5';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] pb-32">
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-raised)] pt-24 pb-12 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <Link href={`/promises/${event.promise.id}`} className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8A8F98] hover:text-white transition-colors mb-8">
            <ArrowLeft size={14} />
            Back to Promise
          </Link>
          
          <h1 className="font-serif text-3xl md:text-5xl font-black text-[#F5F5F7] mb-6 leading-tight">
            {event.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#A1A1AA]">
            <div className={`px-4 py-2 rounded-sm border ${getTypeColor(event.type)} flex items-center gap-2 font-bold uppercase tracking-widest`}>
              <Activity size={16} />
              {event.type}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(event.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.04] border border-[var(--border-subtle)] rounded-sm font-mono text-xs">
              Confidence Score: {event.confidenceScore}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16">
        <section className="mb-12">
          <div className="bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded-sm p-8 text-[#A1A1AA] leading-[1.8] text-[16px] md:text-[18px]">
            {event.description}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
            <FileText size={20} className="text-[#e6b16a]" />
            Evidence Sources
          </h2>
          {event.evidenceIds.length > 0 ? (
            <div className="space-y-4">
              {event.evidenceIds.map(id => (
                <div key={id} className="p-4 border border-[var(--border-subtle)] bg-white/[0.02] rounded-sm">
                  <div className="font-mono text-xs text-[#8A8F98] mb-1">Evidence ID: {id}</div>
                  <div className="text-sm text-white">Primary documentation for this event.</div>
                  {/* Ideally we would fetch actual evidence data here using a getEvidence function */}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#8A8F98] italic text-sm">No specific evidence documents attached to this timeline event.</p>
          )}
        </section>
      </div>
    </div>
  );
}
