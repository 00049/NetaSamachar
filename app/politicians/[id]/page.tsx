import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { POLITICIANS } from '@/data/politicians';
import { getPoliticianDossier } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { computeOverallScore, generateVerdictEn, generateVerdictHi } from '@/lib/scoring';
import { Share2, Bookmark, AlertTriangle, ChevronRight, Calendar, ChevronDown } from 'lucide-react';

// New Architecture Components
import { PoliticianHero } from '@/components/politicians/PoliticianHero';
import { StickyNavigator } from '@/components/politicians/StickyNavigator';
import { InfoFooterBar } from '@/components/politicians/InfoFooterBar';
import { SectionWrapper } from '@/components/politicians/SectionWrapper';

// Content Components
import { PerformanceTab } from '@/components/politicians/PerformanceTab';
import { PromisesTab } from '@/components/politicians/PromisesTab';
import { BillsTab } from '@/components/politicians/BillsTab';
import { TimelineTab } from '@/components/politicians/TimelineTab';
import { FinancialsTab } from '@/components/politicians/FinancialsTab';
import { CasesTab } from '@/components/politicians/CasesTab';
import { SourcesTab } from '@/components/politicians/SourcesTab';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ActionButtons } from '@/components/politicians/ActionButtons';

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

  const { politician, party, promises: politicianPromises, bills: politicianBills, votes: politicianVotes, evidence } = dossier;

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
            <Breadcrumbs items={[
              { label: 'Politicians', href: '/politicians' },
              { label: politician.state, href: `/search?state=${encodeURIComponent(politician.state)}` },
              { label: politician.name, href: `/politicians/${politician.id}` }
            ]} />

            {/* Action Buttons */}
            <ActionButtons />
          </div>

          <div id="overview" className="px-[40px] pt-[48px] pb-[32px]">
            {/* ===== PREMIUM HERO ===== */}
            <PoliticianHero politician={politician} party={party} quickLook={quickLookData} />
          </div>
        </div>

        {/* ===== STICKY NAVIGATOR & FOOTER ===== */}
        <StickyNavigator />
        <InfoFooterBar />

        {/* ===== CONTINUOUS SCROLL SECTIONS ===== */}
        <div className="px-[40px] pb-[96px] pt-[64px] flex flex-col gap-[96px]">

          <SectionWrapper
            id="performance"
            label="PERFORMANCE"
            labelClassName="text-[var(--color-accent-positive)]"
            heading="Work & Attendance"
            description={`Detailed analysis of ${politician.name}'s legislative work, attendance and impact.`}
            rightElement={
              <button className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-lg border border-white/10 text-[#A1A1AA] text-[13px] hover:text-white hover:bg-white/[0.02] transition-colors">
                <Calendar className="w-[16px] h-[16px]" /> All Years <ChevronDown className="w-[16px] h-[16px]" />
              </button>
            }
          >
            <PerformanceTab politician={politician} quickLook={quickLookData} />
          </SectionWrapper>

          <SectionWrapper
            id="promises"
            label="PROMISES"
            labelClassName="text-[var(--color-accent-positive)]"
            heading="What Was Promised"
            description="Track progress of key promises made during election campaigns and terms."
            rightElement={
              <button className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-lg border border-white/10 text-[#A1A1AA] text-[13px] hover:text-white hover:bg-white/[0.02] transition-colors">
                All Promises <ChevronDown className="w-[16px] h-[16px]" />
              </button>
            }
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
            id="timeline"
            label="TIMELINE"
            heading="Political Journey"
            description="A chronological view of major milestones, controversies, and achievements."
          >
            <TimelineTab politician={politician} promises={politicianPromises} />
          </SectionWrapper>

          <SectionWrapper
            id="financials"
            label="FINANCIAL OVERVIEW"
            heading="Assets & Financials"
            description="Track declared assets, liabilities, income sources and financial growth over time."
          >
            <FinancialsTab politician={politician} />
          </SectionWrapper>

          <SectionWrapper
            id="cases"
            label="LEGAL PROCEEDINGS"
            heading="Cases"
            description="Overview of criminal cases, charges, and legal proceedings."
          >
            <CasesTab politician={politician} />
          </SectionWrapper>

          <SectionWrapper
            id="sources"
            label="DATA SOURCES & EVIDENCE"
            heading="Sources"
            description={`All official sources and documents used to collect and verify data on ${politician.name}.`}
          >
            <SourcesTab politician={politician} evidence={evidence} />
          </SectionWrapper>
        </div>

      </div>
    </div>
  );
}
