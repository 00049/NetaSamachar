import { getPromise } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Target, ChevronRight, User, Calendar, Tag, ShieldCheck, Clock, FileText } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const promise = await getPromise(id);
  if (!promise) return { title: 'Promise Not Found' };
  return {
    title: `${promise.title} | Promise Record | Neta Samachar`,
    description: promise.fullStatement,
    alternates: {
      canonical: `/promises/${promise.id}`,
    },
  };
}

export default async function PromiseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const promise = await getPromise(id);
  
  if (!promise) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'operational': return 'text-green-500 border-green-500/20 bg-green-500/5';
      case 'partially_completed':
      case 'mostly_completed':
      case 'construction_started':
      case 'implementation_started': return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5';
      case 'delayed':
      case 'insufficient_evidence':
      case 'no_verified_progress': return 'text-orange-500 border-orange-500/20 bg-orange-500/5';
      case 'cancelled': return 'text-red-500 border-red-500/20 bg-red-500/5';
      default: return 'text-[#A1A1AA] border-[#A1A1AA]/20 bg-[#A1A1AA]/5';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] pb-32">
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-raised)] pt-24 pb-12 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-[#8A8F98] mb-6">
            <Link href="/investigations" className="hover:text-white transition-colors">Promises</Link>
            <ChevronRight size={14} />
            <span className="text-[#e6b16a]">{promise.category.replace('_', ' ')}</span>
          </div>
          
          <h1 className="font-serif text-3xl md:text-5xl font-black text-[#F5F5F7] mb-6 leading-tight">
            {promise.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#A1A1AA]">
            <div className={`px-4 py-2 rounded-sm border ${getStatusColor(promise.status)} flex items-center gap-2 font-bold uppercase tracking-widest`}>
              <Target size={16} />
              {promise.status.replace(/_/g, ' ')}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              Made: {new Date(promise.madeDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {promise.deadline && (
              <div className="flex items-center gap-2 text-[#e6b16a]">
                <Clock size={16} />
                Deadline: {new Date(promise.deadline).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.04] border border-[var(--border-subtle)] rounded-sm font-mono text-xs">
              Score: {promise.confidenceScore}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
              <FileText size={20} className="text-[#e6b16a]" />
              Original Statement
            </h2>
            <div className="relative">
              <div className="absolute -left-4 top-0 text-6xl text-white/5 font-serif leading-none select-none">"</div>
              <div className="text-[#A1A1AA] leading-[1.8] text-[18px] font-serif italic relative z-10 pl-6 border-l-2 border-[var(--border-subtle)]">
                {promise.fullStatement}
              </div>
            </div>
          </section>

          {promise.timeline && promise.timeline.length > 0 && (
            <section>
              <h2 className="text-xl font-serif font-bold text-white mb-6">Status Timeline</h2>
              <div className="relative border-l border-[var(--border-subtle)] ml-3 space-y-8 pb-4">
                {promise.timeline.map((event, i) => (
                  <div key={event.id} className="relative pl-8">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--bg-base)] border-2 border-[#e6b16a]" />
                    <div className="text-[12px] text-[#e6b16a] font-bold tracking-widest uppercase mb-1">{new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="text-white font-bold mb-1 hover:text-[#e6b16a] transition-colors">
                      <Link href={`/timeline/${event.id}`}>
                        {event.title}
                      </Link>
                    </div>
                    <div className="text-sm text-[#A1A1AA]">{event.description}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {promise.tags && promise.tags.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#8A8F98] mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {promise.tags.map(tag => (
                  <div key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded-sm text-xs text-[#A1A1AA]">
                    <Tag size={12} />
                    {tag}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8">
          {promise.politician && (
            <div className="bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded-sm p-6">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8A8F98] mb-4">Promising Official</h3>
              <Link href={`/politicians/${promise.politician.id}`} className="group flex items-center gap-4 p-3 -mx-3 rounded-sm hover:bg-white/[0.04] transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white overflow-hidden flex-shrink-0">
                  {promise.politician.photoUrl ? (
                    <img src={promise.politician.photoUrl} alt={promise.politician.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-[#e6b16a] transition-colors">{promise.politician.name}</div>
                  <div className="text-[11px] text-[#A1A1AA] uppercase tracking-wider mt-1">{promise.politician.position}</div>
                </div>
              </Link>
            </div>
          )}
          
          <div className="bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded-sm p-6">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8A8F98] mb-4 flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#e6b16a]" />
              Evidence Assessment
            </h3>
            <p className="text-sm text-[#A1A1AA] leading-relaxed mb-4">
              This promise has a confidence score of {promise.confidenceScore}/100 based on {promise.evidenceIds.length} primary source documents.
            </p>
            <Link href="/methodology#confidence" className="text-[12px] font-bold text-[#e6b16a] hover:text-white uppercase tracking-widest transition-colors flex items-center">
              View Scoring Methodology <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
