import { getState, getPoliticiansByState } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { MapPin, AlertCircle } from 'lucide-react';
import { PoliticianCard } from '@/components/politicians/PoliticianCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const state = await getState(slug);
  if (!state) return { title: 'State Not Found' };
  return {
    title: `${state.name} | Politicians | Neta Samachar`,
    description: `Political data and accountability records for ${state.name}.`,
    alternates: {
      canonical: `/states/${slug}`,
    },
  };
}

export default async function StatePage({ params }: PageProps) {
  const { slug } = await params;
  const state = await getState(slug);
  
  if (!state) {
    notFound();
  }

  const politicians = await getPoliticiansByState(state.name);
  const isHimachal = state.slug === 'himachal-pradesh';

  return (
    <div className="min-h-screen bg-[var(--bg-base)] pb-32">
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-raised)] pt-24 pb-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-white/[0.04] border border-white/10 text-white">
              <MapPin size={28} />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-5xl font-black text-[#F5F5F7] leading-tight">
                {state.name}
              </h1>
              <div className="text-[13px] font-bold uppercase tracking-widest text-[#8A8F98] mt-2">
                Regional Index
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <div className="px-4 py-2 rounded-sm border border-[var(--border-subtle)] bg-white/[0.02] flex items-center gap-2 text-sm font-bold tracking-widest text-white">
              <span className="text-[#e6b16a]">{politicians.length}</span> Indexed Politicians
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        {isHimachal && (
          <div className="mb-12 p-6 border border-[#e6b16a]/30 bg-[#e6b16a]/5 rounded-sm flex gap-4 max-w-4xl">
            <AlertCircle className="text-[#e6b16a] flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="text-white font-bold mb-2">Phase 1 Rollout Area</h3>
              <p className="text-[#A1A1AA] text-sm leading-relaxed">
                Himachal Pradesh is our inaugural coverage state. We are actively indexing all sitting MLAs and MPs representing the state. Data collection involves scraping assembly records, parsing affidavits, and tracking local media for promise fulfillment. Coverage for other states will expand in subsequent phases.
              </p>
            </div>
          </div>
        )}

        {!isHimachal && (
          <div className="mb-12 p-6 border border-[var(--border-subtle)] bg-[var(--bg-raised)] rounded-sm flex gap-4 max-w-4xl">
            <AlertCircle className="text-[#8A8F98] flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="text-white font-bold mb-2">Limited Coverage Area</h3>
              <p className="text-[#A1A1AA] text-sm leading-relaxed">
                Our active indexing is currently focused on Himachal Pradesh. Data for {state.name} may be incomplete or limited to specific high-profile representatives as we expand our backend infrastructure.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {politicians.map(politician => (
            <PoliticianCard key={politician.id} politician={politician} />
          ))}
        </div>
      </div>
    </div>
  );
}
