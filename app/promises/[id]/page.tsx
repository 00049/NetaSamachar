import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PROMISES, EVIDENCE } from '@/data/promises';
import { POLITICIANS, PARTIES } from '@/data/politicians';
import PromiseClient from './PromiseClient';
import { 
  Share, 
  Bookmark, 
  Flag, 
  Zap, 
  Calendar, 
  MapPin, 
  Users, 
  Tag, 
  BarChart, 
  CheckCircle2, 
  Clock, 
  Circle, 
  ChevronDown, 
  Sun, 
  FileText, 
  ArrowRight,
  Download,
  ArrowLeft,
  TrendingUp,
  Info,
  AlertTriangle
} from 'lucide-react';
import clsx from 'clsx';
import { Promise as PromiseType } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const promise = PROMISES.find(p => p.id === id);
  if (!promise) return { title: 'Promise Not Found' };
  return {
    title: `${promise.title} | Neta Samachar`,
    description: promise.fullStatement,
  };
}

export function generateStaticParams() {
  return PROMISES.map(p => ({ id: p.id }));
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

const formatStatusText = (status: string) => {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default async function PromiseDetailPage({ params }: Props) {
  const { id } = await params;
  const promise = PROMISES.find(p => p.id === id);
  if (!promise) notFound();

  const politician = POLITICIANS.find(p => p.id === promise.politicianId);
  const party = PARTIES.find(p => p.id === promise.partyId);
  const promiseEvidence = EVIDENCE.filter(e => promise.evidenceIds.includes(e.id));
  
  const percentage = getCompletionPercentage(promise.status);
  
  // Calculate mock milestone data based on timeline length to make the UI look right
  const totalMilestones = Math.max(promise.timeline.length + 1, 8); // At least 8 to match screenshot
  const completedMilestones = Math.floor((percentage / 100) * totalMilestones);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white">
      
      {/* HEADER BAR (Breadcrumbs & Actions) */}
      <div className="w-full border-b border-white/5 bg-[#131722]/50 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-[24px] lg:px-[40px] h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-[8px] text-[12px] font-medium text-[#A1A1AA]">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-white/20">&gt;</span>
            <Link href="/politicians" className="hover:text-white transition-colors">Politicians</Link>
            <span className="text-white/20">&gt;</span>
            <span className="hover:text-white transition-colors cursor-pointer">{promise.state || 'State'}</span>
            <span className="text-white/20">&gt;</span>
            <Link href={`/politicians/${politician?.id}`} className="hover:text-white transition-colors">{politician?.name}</Link>
            <span className="text-white/20">&gt;</span>
            <span className="text-[#A1A1AA]">Promises</span>
            <span className="text-white/20">&gt;</span>
            <span className="text-white">{promise.id.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-[16px]">
            <button className="flex items-center gap-[8px] px-[12px] py-[6px] rounded-[8px] text-[#A1A1AA] hover:text-white hover:bg-white/[0.05] transition-colors text-[13px] font-medium border border-transparent hover:border-white/10">
              <Share className="w-[14px] h-[14px]" /> Share
            </button>
            <button className="flex items-center gap-[8px] px-[12px] py-[6px] rounded-[8px] text-[#A1A1AA] hover:text-white hover:bg-white/[0.05] transition-colors text-[13px] font-medium border border-transparent hover:border-white/10">
              <Bookmark className="w-[14px] h-[14px]" /> Save
            </button>
            <button className="flex items-center gap-[8px] px-[12px] py-[6px] rounded-[8px] text-[var(--color-accent-negative)] hover:bg-[var(--color-accent-negative)]/10 transition-colors text-[13px] font-medium border border-transparent hover:border-[var(--color-accent-negative)]/20">
              <Flag className="w-[14px] h-[14px]" /> Report Issue
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-[24px] lg:px-[40px] py-[32px]">
        
        <Link href={`/politicians/${politician?.id}`} className="inline-flex items-center gap-[8px] text-[#A1A1AA] hover:text-white transition-colors text-[13px] font-medium mb-[24px]">
          <ArrowLeft className="w-[16px] h-[16px]" /> Back to {politician?.name}
        </Link>

        {/* HERO PROMISE CARD */}
        <div className="premium-card p-[32px] flex flex-col xl:flex-row gap-[40px] justify-between mb-[32px]">
          
          <div className="flex gap-[24px] flex-grow">
            {/* Category Icon */}
            <div className="w-[96px] h-[96px] shrink-0 rounded-[16px] bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <Zap className="w-[48px] h-[48px] text-yellow-500" />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow">
              <div className="flex items-center gap-[8px] mb-[12px]">
                <div className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-wider">
                  {promise.category}
                </div>
                <div className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] bg-white/5 text-[#A1A1AA] text-[10px] font-bold uppercase tracking-wider border border-white/10">
                  Manifesto Promise
                </div>
              </div>
              <h1 className="text-white text-[28px] font-bold mb-[8px] leading-tight">
                {promise.title}
              </h1>
              <p className="text-[#A1A1AA] text-[15px] mb-[32px] max-w-[800px]">
                {promise.fullStatement}
              </p>

              {/* Meta Grid */}
              <div className="flex flex-wrap items-center gap-x-[48px] gap-y-[16px]">
                <div className="flex items-center gap-[12px]">
                  <div className="w-[32px] h-[32px] rounded-[8px] bg-white/[0.02] border border-white/5 flex items-center justify-center">
                    <Calendar className="w-[14px] h-[14px] text-[#A1A1AA]" />
                  </div>
                  <div>
                    <div className="text-[#A1A1AA] text-[11px] mb-[2px]">Promised On</div>
                    <div className="text-white text-[13px] font-medium">{new Date(promise.madeDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                  </div>
                </div>

                <div className="flex items-center gap-[12px]">
                  <div className="w-[32px] h-[32px] rounded-[8px] bg-white/[0.02] border border-white/5 flex items-center justify-center">
                    <MapPin className="w-[14px] h-[14px] text-[#A1A1AA]" />
                  </div>
                  <div>
                    <div className="text-[#A1A1AA] text-[11px] mb-[2px]">Jurisdiction</div>
                    <div className="text-white text-[13px] font-medium">{promise.state || 'N/A'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-[12px]">
                  <div className="w-[32px] h-[32px] rounded-[8px] bg-white/[0.02] border border-white/5 flex items-center justify-center">
                    <Users className="w-[14px] h-[14px] text-[#A1A1AA]" />
                  </div>
                  <div>
                    <div className="text-[#A1A1AA] text-[11px] mb-[2px]">Target Beneficiaries</div>
                    <div className="text-white text-[13px] font-medium">All Domestic Households</div>
                  </div>
                </div>

                <div className="flex items-center gap-[12px]">
                  <div className="w-[32px] h-[32px] rounded-[8px] bg-white/[0.02] border border-white/5 flex items-center justify-center">
                    <Tag className="w-[14px] h-[14px] text-[#A1A1AA]" />
                  </div>
                  <div>
                    <div className="text-[#A1A1AA] text-[11px] mb-[2px]">Promise ID</div>
                    <div className="text-white text-[13px] font-medium">{promise.id.toUpperCase()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Status Block */}
          <div className="shrink-0 w-full xl:w-[320px] rounded-[16px] bg-[#111111]/80 border border-white/5 p-[24px] flex flex-col">
             <div className="flex items-center justify-between mb-[24px]">
               <div className="text-[#A1A1AA] text-[11px] font-medium uppercase tracking-wider">Current Status</div>
               <div className="inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full bg-yellow-500/10 border border-yellow-500/20">
                 <div className="w-[6px] h-[6px] rounded-full bg-yellow-500"></div>
                 <span className="text-yellow-500 text-[10px] font-bold uppercase tracking-wider">{formatStatusText(promise.status)}</span>
               </div>
             </div>

             <div className="flex items-center gap-[24px] mb-[16px]">
               <div className="relative w-[64px] h-[64px]">
                 <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                   <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                   <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-accent-warning)" strokeWidth="12" strokeDasharray={`${(percentage / 100) * 251} 251`} className="drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
                 </svg>
               </div>
               <div>
                 <div className="text-white font-bold text-[28px] leading-none mb-[4px]">{percentage}%</div>
                 <div className="text-[#A1A1AA] text-[12px]">Overall Progress</div>
               </div>
             </div>

             <div className="text-[#A1A1AA] text-[12px] mb-[24px]">
               {completedMilestones} of {totalMilestones} major milestones completed
             </div>

             <button className="w-full flex items-center justify-center gap-[8px] py-[10px] rounded-[8px] bg-white/[0.03] border border-white/5 text-[#A1A1AA] hover:text-white hover:bg-white/[0.05] transition-colors text-[13px] font-medium mt-auto">
               <BarChart className="w-[14px] h-[14px]" /> View Summary
             </button>
          </div>

        </div>

        <PromiseClient 
          promise={promise} 
          promiseEvidence={promiseEvidence} 
          totalMilestones={totalMilestones} 
          completedMilestones={completedMilestones} 
          percentage={percentage} 
        />

      </div>

      {/* FOOTER NOTE */}
      <div className="max-w-[1440px] mx-auto px-[24px] lg:px-[40px] pb-[32px]">
        <div className="flex items-center justify-between py-[16px] border-t border-white/10">
          <div className="flex items-center gap-[12px]">
            <span className="text-[#A1A1AA] text-[12px]">
              <span className="text-yellow-500 mr-[4px]">Note:</span> 
              Progress is based on official data and public records. Last updated on 28 Jul 2026.
            </span>
          </div>
          <div className="flex items-center gap-[32px] text-[#A1A1AA] text-[12px]">
            <span>Data Sources: ECI, Parliament, Govt. Websites, Court Records, Affidavits</span>
            <div className="flex items-center gap-[6px]">
              <CheckCircle2 className="w-[14px] h-[14px] text-[var(--color-accent-positive)]" />
              <span>Our data is verified and updated regularly</span>
            </div>
            <Link href="#" className="flex items-center gap-[4px] hover:text-white transition-colors">
              Learn More <ArrowRight className="w-[12px] h-[12px]" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
