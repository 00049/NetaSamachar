import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { POLITICIANS } from '@/data/politicians';
import { getPoliticianDossier } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { computeOverallScore, generateVerdictEn, generateVerdictHi } from '@/lib/scoring';
import { Share2, Bookmark, AlertTriangle, ChevronRight } from 'lucide-react';

// New Architecture Components
import { PoliticianHero } from '@/components/politicians/PoliticianHero';
import { StickyNavigator } from '@/components/politicians/StickyNavigator';
import { InfoFooterBar } from '@/components/politicians/InfoFooterBar';
import { SectionWrapper } from '@/components/politicians/SectionWrapper';

// Content Components
import { OverviewTab } from '@/components/politicians/OverviewTab';
import { PromisesTab } from '@/components/politicians/PromisesTab';
import { BillsTab } from '@/components/politicians/BillsTab';
import { VotingRecordTab } from '@/components/politicians/VotingRecordTab';
import { TimelineTab } from '@/components/politicians/TimelineTab';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const politician = POLITICIANS.find(p => p.id === id);
  if (!politician) return { title: 'Politician Not Found' };
  return {
    title: `${politician.name} — Legislative Dossier | Neta Samachar`,
    description: `Complete accountability profile for ${politician.name}. Track promises, criminal cases, financial declarations, and legislative activity.`,
  };
}

export function generateStaticParams() {
  return POLITICIANS.map(p => ({ id: p.id }));
}

// Define the sections for the sticky navigator (handled in StickyNavigator.tsx)

export default async function PoliticianProfilePage({ params }: Props) {
  const { id } = await params;

  const dossier = await getPoliticianDossier(id);
  if (!dossier) notFound();

  const { politician, promises: politicianPromises, bills: politicianBills, votes: politicianVotes } = dossier;

  const overallScore = computeOverallScore(politician);
  const quickLookData = {
    score: overallScore,
    verdictEn: generateVerdictEn(politician),
    verdictHi: generateVerdictHi(politician),
    promisesKept: politician.promisesFulfilled,
    promisesTotal: politician.promisesTotal,
    legalCases: politician.criminalCases.length,
    netWorthCr: formatCurrency(politician.latestNetWorth),
    billsIntroduced: politicianBills.length,
    billsPassed: politicianBills.filter(b => b.status === 'passed').length,
    attendancePercent: politician.attendancePercent,
  };

  return (
    <div className="w-full min-h-screen bg-[var(--color-base)] overflow-x-hidden relative">
      <div className="w-full relative">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[400px] bg-[#3B82F6]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full">
          <div className="px-[40px] py-[28px] flex items-center justify-between border-b border-white/10">

            {/* Breadcrumbs */}
            <div className="flex items-center gap-[12px] text-[16px] font-medium text-white/80">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-[16px] h-[16px] text-white/40" />
              <Link href="/politicians" className="hover:text-white transition-colors">Politicians</Link>
              <ChevronRight className="w-[16px] h-[16px] text-white/40" />
              <span className="hover:text-white transition-colors cursor-pointer">Himachal Pradesh</span>
              <ChevronRight className="w-[16px] h-[16px] text-white/40" />
              <span className="text-white drop-shadow-sm">{politician.name}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-[16px]">
              <button className="flex items-center gap-[8px] text-[15px] font-semibold text-white px-5 py-2.5 rounded-xl border border-white/20 bg-white/[0.05] hover:bg-white/[0.1] transition-all shadow-sm hover:shadow-md">
                <Share2 className="w-[18px] h-[18px]" /> Share
              </button>
              <button className="flex items-center gap-[8px] text-[15px] font-semibold text-white px-5 py-2.5 rounded-xl border border-white/20 bg-white/[0.05] hover:bg-white/[0.1] transition-all shadow-sm hover:shadow-md">
                <Bookmark className="w-[18px] h-[18px]" /> Save
              </button>
              <button className="flex items-center gap-[8px] text-[15px] font-semibold text-white px-5 py-2.5 rounded-xl border border-white/20 bg-white/[0.05] hover:bg-white/[0.1] transition-all shadow-sm hover:shadow-md">
                <AlertTriangle className="w-[18px] h-[18px] text-red-500" /> Report Issue
              </button>
            </div>
          </div>

          <div className="px-[40px] pt-[48px] pb-[32px]">
            {/* ===== PREMIUM HERO ===== */}
            <PoliticianHero politician={politician} quickLook={quickLookData} />
          </div>
        </div>

        {/* ===== STICKY NAVIGATOR & FOOTER ===== */}
        <StickyNavigator />
        <InfoFooterBar />

        {/* ===== CONTINUOUS SCROLL SECTIONS ===== */}
        <div className="px-[40px] pb-[96px] pt-[64px] flex flex-col gap-[96px]">
          <SectionWrapper
            id="overview"
            label="PUBLIC RECORD SUMMARY"
            heading="Executive Brief"
            description="Generated from verified public records. Every statement links to supporting evidence."
          >
            <OverviewTab politician={politician} />
          </SectionWrapper>

          <SectionWrapper
            id="promises"
            label="PROMISES"
            heading="Commitment Tracking"
            description="Detailed status of all public promises made during election campaigns and terms."
          >
            <PromisesTab promises={politicianPromises} />
          </SectionWrapper>

          <SectionWrapper
            id="legislation"
            label="LEGISLATION"
            heading="Bills & Lawmaking"
            description="Bills introduced, sponsored, and passed during their legislative tenure."
          >
            <BillsTab politician={politician} bills={politicianBills} />
          </SectionWrapper>

          <SectionWrapper
            id="attendance"
            label="ATTENDANCE & VOTING"
            heading="Parliamentary Activity"
            description="Session attendance records and key voting decisions."
          >
            <VotingRecordTab politician={politician} votes={politicianVotes} />
          </SectionWrapper>

          <SectionWrapper
            id="timeline"
            label="TIMELINE"
            heading="Political Journey"
            description="A chronological view of major milestones, controversies, and achievements."
          >
            <TimelineTab politician={politician} promises={politicianPromises} />
          </SectionWrapper>
        </div>

      </div>
    </div>
  );
}
