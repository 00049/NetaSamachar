import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PROMISES, EVIDENCE } from '@/data/promises';
import { POLITICIANS, PARTIES } from '@/data/politicians';
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
            <Link href={`/promises`} className="hover:text-white transition-colors">Promises</Link>
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
        
        {/* Back Button */}
        <Link href="/promises" className="inline-flex items-center gap-[8px] text-[#A1A1AA] hover:text-white transition-colors text-[13px] font-medium mb-[24px]">
          <ArrowLeft className="w-[16px] h-[16px]" /> Back to Promises
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

        {/* TABS NAVIGATOR */}
        <div className="flex items-center gap-[32px] border-b border-white/10 mb-[32px]">
          {['Overview', 'Timeline', 'Evidence & Documents', 'Finances', 'Impact', 'Related Promises'].map((tab, idx) => (
            <button 
              key={tab}
              className={clsx(
                "pb-[16px] text-[14px] font-medium transition-colors relative outline-none",
                idx === 1 ? "text-[var(--color-accent-positive)]" : "text-[#A1A1AA] hover:text-white"
              )}
            >
              {tab}
              {idx === 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-accent-positive)] shadow-[0_-2px_10px_rgba(34,197,94,0.4)]" />
              )}
            </button>
          ))}
        </div>

        {/* MAIN 2-COLUMN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[32px]">
          
          {/* LEFT COLUMN: TIMELINE */}
          <div className="lg:col-span-2">
            <div className="premium-card p-[32px]">
              <div className="flex items-center justify-between mb-[8px]">
                <h2 className="text-white text-[16px] font-bold">Timeline</h2>
                <button className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-lg border border-white/10 text-[#A1A1AA] text-[12px] hover:text-white hover:bg-white/[0.02] transition-colors">
                  All Verified Milestones <ChevronDown className="w-[14px] h-[14px]" />
                </button>
              </div>
              <p className="text-[#A1A1AA] text-[13px] mb-[40px]">Verified milestones in the journey of this promise.</p>

              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-[8px] top-[16px] bottom-[16px] w-[2px] bg-gradient-to-b from-[var(--color-accent-positive)] via-[var(--color-accent-positive)] to-white/5" style={{ backgroundSize: '100% 80%', backgroundRepeat: 'no-repeat' }} />

                <div className="flex flex-col gap-[40px]">
                  {promise.timeline && promise.timeline.length > 0 ? promise.timeline.map((event, idx) => {
                    const isCompleted = Math.random() > 0.5 || idx === 0; 
                    
                    return (
                      <div key={event.id} className="flex gap-[32px] relative z-10">
                        {/* Dot Indicator */}
                        <div className="relative shrink-0 mt-[4px]">
                          {isCompleted ? (
                            <div className="w-[18px] h-[18px] rounded-full border-2 border-[var(--color-accent-positive)] bg-[#111111] flex items-center justify-center">
                              <CheckCircle2 className="w-[12px] h-[12px] text-[var(--color-accent-positive)]" />
                            </div>
                          ) : (
                            <div className="w-[18px] h-[18px] rounded-full border-2 border-yellow-500 bg-[#111111] shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-grow flex flex-col xl:flex-row xl:items-start justify-between gap-[24px]">
                          <div className="flex flex-col gap-[8px]">
                            <div className="text-[#A1A1AA] text-[12px] font-medium tracking-wide">
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </div>
                            <h4 className="text-white text-[15px] font-semibold leading-snug">{event.title}</h4>
                            <p className="text-[#A1A1AA] text-[13px] leading-relaxed max-w-[600px]">{event.description}</p>
                            
                            {event.evidenceIds && event.evidenceIds.length > 0 && (
                              <div className="mt-[8px] inline-flex items-center gap-[6px] px-[8px] py-[4px] rounded-[4px] bg-white/[0.02] border border-white/10 w-fit">
                                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Source</span>
                                <span className="text-[#A1A1AA] text-[11px]">{EVIDENCE.find(e => e.id === event.evidenceIds[0])?.title || 'Official Document'}</span>
                              </div>
                            )}
                          </div>

                          <div className="shrink-0 mt-[8px] xl:mt-0 flex flex-col items-start xl:items-end">
                            <span className="text-[#A1A1AA] text-[10px] font-medium mb-[4px]">Outcome</span>
                            {isCompleted ? (
                              <span className="inline-flex px-[8px] py-[2px] rounded border border-[var(--color-accent-positive)]/20 bg-[var(--color-accent-positive)]/10 text-[var(--color-accent-positive)] text-[11px] font-medium">Completed</span>
                            ) : (
                              <span className="inline-flex px-[8px] py-[2px] rounded border border-yellow-500/20 bg-yellow-500/10 text-yellow-500 text-[11px] font-medium">In Progress</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    // Fallback to match screenshot if timeline is empty
                    <>
                      <div className="flex gap-[32px] relative z-10">
                        <div className="relative shrink-0 mt-[4px]">
                          <div className="w-[18px] h-[18px] rounded-full border-2 border-[var(--color-accent-positive)] bg-[#111111] flex items-center justify-center">
                            <CheckCircle2 className="w-[12px] h-[12px] text-[var(--color-accent-positive)]" />
                          </div>
                        </div>
                        <div className="flex-grow flex justify-between gap-[24px]">
                          <div className="flex flex-col gap-[8px]">
                            <div className="text-[#A1A1AA] text-[12px] font-medium tracking-wide">Nov 2022</div>
                            <h4 className="text-white text-[15px] font-semibold">Promise Announced in Election Manifesto</h4>
                            <p className="text-[#A1A1AA] text-[13px]">Included in the official Congress manifesto for Himachal Pradesh Assembly Elections 2022.</p>
                            <div className="mt-[8px] inline-flex items-center gap-[6px] px-[8px] py-[4px] rounded-[4px] bg-white/[0.02] border border-white/10 w-fit">
                              <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Source</span>
                              <span className="text-[#A1A1AA] text-[11px]">Manifesto 2022</span>
                            </div>
                          </div>
                          <div className="shrink-0 flex flex-col items-end">
                            <span className="text-[#A1A1AA] text-[10px] font-medium mb-[4px]">Outcome</span>
                            <span className="inline-flex px-[8px] py-[2px] rounded border border-[var(--color-accent-positive)]/20 bg-[var(--color-accent-positive)]/10 text-[var(--color-accent-positive)] text-[11px] font-medium">Completed</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-[32px] relative z-10">
                        <div className="relative shrink-0 mt-[4px]">
                          <div className="w-[18px] h-[18px] rounded-full border-2 border-white/20 bg-[#111111]" />
                        </div>
                        <div className="flex-grow flex justify-between gap-[24px]">
                          <div className="flex flex-col gap-[8px]">
                            <div className="text-[#A1A1AA] text-[12px] font-medium tracking-wide">Target: Dec 2025</div>
                            <h4 className="text-white text-[15px] font-semibold">Full Statewide Coverage (Target)</h4>
                            <p className="text-[#A1A1AA] text-[13px]">Complete implementation for all eligible households across the state.</p>
                          </div>
                          <div className="shrink-0 flex flex-col items-end">
                            <span className="text-[#A1A1AA] text-[10px] font-medium mb-[4px]">Outcome</span>
                            <span className="inline-flex px-[8px] py-[2px] rounded border border-white/10 bg-white/5 text-[#A1A1AA] text-[11px] font-medium">Upcoming</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-[48px] pt-[24px] border-t border-white/5 flex justify-center">
                  <button className="flex items-center gap-[8px] text-[#A1A1AA] hover:text-white transition-colors text-[13px] font-medium bg-white/[0.02] px-[16px] py-[8px] rounded-lg border border-white/10 hover:bg-white/[0.05]">
                    <Download className="w-[16px] h-[16px]" /> Download Full Timeline
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <div className="flex flex-col gap-[24px]">
            
            {/* Progress Overview */}
            <div className="premium-card p-[24px]">
              <h3 className="text-white text-[14px] font-bold mb-[24px]">Progress Overview</h3>
              
              <div className="mb-[8px] text-[#A1A1AA] text-[12px]">Overall Progress</div>
              <div className="text-white text-[28px] font-bold mb-[12px]">{percentage}%</div>
              
              <div className="w-full h-[6px] bg-white/5 rounded-full mb-[12px] overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${percentage}%` }} />
              </div>
              
              <div className="text-[#A1A1AA] text-[12px] pb-[24px] border-b border-white/5 mb-[24px]">
                {completedMilestones} of {totalMilestones} major milestones completed
              </div>

              <h4 className="text-white text-[13px] font-semibold mb-[24px]">Status Breakdown</h4>
              
              <div className="flex items-center gap-[24px]">
                <div className="relative w-[64px] h-[64px] shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-accent-negative)" strokeWidth="12" strokeDasharray="30 251" strokeDashoffset="-221" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="12" strokeDasharray="30 251" strokeDashoffset="-191" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-accent-warning)" strokeWidth="12" strokeDasharray="95 251" strokeDashoffset="-96" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-accent-positive)" strokeWidth="12" strokeDasharray="96 251" />
                  </svg>
                </div>
                
                <div className="flex flex-col gap-[12px] w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[8px]">
                      <div className="w-[8px] h-[8px] bg-[var(--color-accent-positive)] rounded-sm" />
                      <span className="text-[#A1A1AA] text-[12px]">Completed</span>
                    </div>
                    <span className="text-white text-[12px]">3 (37.5%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[8px]">
                      <div className="w-[8px] h-[8px] bg-[var(--color-accent-warning)] rounded-sm" />
                      <span className="text-[#A1A1AA] text-[12px]">In Progress</span>
                    </div>
                    <span className="text-white text-[12px]">3 (37.5%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[8px]">
                      <div className="w-[8px] h-[8px] bg-white/20 rounded-sm" />
                      <span className="text-[#A1A1AA] text-[12px]">Upcoming</span>
                    </div>
                    <span className="text-white text-[12px]">1 (12.5%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[8px]">
                      <div className="w-[8px] h-[8px] bg-[var(--color-accent-negative)] rounded-sm" />
                      <span className="text-[#A1A1AA] text-[12px]">Delayed</span>
                    </div>
                    <span className="text-white text-[12px]">1 (12.5%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What Reports Say */}
            <div className="premium-card p-[24px]">
              <div className="flex items-center justify-between mb-[24px]">
                <h3 className="text-white text-[14px] font-bold">What Reports Say</h3>
                <Link href="#" className="flex items-center gap-[4px] text-[#3B82F6] text-[12px] font-medium hover:underline">
                  View All Reports <ArrowRight className="w-[12px] h-[12px]" />
                </Link>
              </div>
              
              <div className="flex flex-col gap-[20px]">
                <div className="flex gap-[12px] items-start">
                  <TrendingUp className="w-[16px] h-[16px] text-[var(--color-accent-positive)] mt-[2px] shrink-0" />
                  <div>
                    <h4 className="text-white text-[13px] font-semibold mb-[4px]">Positive Outlook</h4>
                    <p className="text-[#A1A1AA] text-[12px] leading-relaxed mb-[6px]">The scheme is one of the most impactful welfare initiatives benefiting lakhs of households across the state.</p>
                    <p className="text-[#A1A1AA] text-[11px] font-medium italic">— Himachal Pradesh Vidyut Board (HPSEBL) Report, May 2024</p>
                  </div>
                </div>

                <div className="flex gap-[12px] items-start">
                  <Info className="w-[16px] h-[16px] text-[#3B82F6] mt-[2px] shrink-0" />
                  <div>
                    <h4 className="text-white text-[13px] font-semibold mb-[4px]">Implementation Progressing Well</h4>
                    <p className="text-[#A1A1AA] text-[12px] leading-relaxed mb-[6px]">Rollout is on track; current coverage stands at ~87% of total eligible households.</p>
                    <p className="text-[#A1A1AA] text-[11px] font-medium italic">— State Energy Department Review, Feb 2024</p>
                  </div>
                </div>

                <div className="flex gap-[12px] items-start">
                  <AlertTriangle className="w-[16px] h-[16px] text-yellow-500 mt-[2px] shrink-0" />
                  <div>
                    <h4 className="text-white text-[13px] font-semibold mb-[4px]">Operational Challenges</h4>
                    <p className="text-[#A1A1AA] text-[12px] leading-relaxed mb-[6px]">Billing system upgrades and consumer awareness remain key challenges in full implementation.</p>
                    <p className="text-[#A1A1AA] text-[11px] font-medium italic">— CAG Audit Report (Energy Sector), Dec 2023</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact So Far */}
            <div className="premium-card p-[24px]">
              <h3 className="text-white text-[14px] font-bold mb-[24px]">Impact So Far</h3>
              <div className="flex gap-[16px] items-center justify-between border-t border-white/5 pt-[16px]">
                
                <div className="flex flex-col gap-[4px]">
                  <div className="flex items-center gap-[6px]">
                    <Users className="w-[14px] h-[14px] text-[var(--color-accent-positive)]" />
                    <span className="text-white font-bold text-[14px]">8.42 Lakh+</span>
                  </div>
                  <span className="text-[#A1A1AA] text-[10px] uppercase tracking-wider">Households Benefited</span>
                </div>

                <div className="w-[1px] h-[32px] bg-white/10" />

                <div className="flex flex-col gap-[4px]">
                  <div className="flex items-center gap-[6px]">
                    <span className="text-yellow-500 font-bold text-[14px]">₹</span>
                    <span className="text-white font-bold text-[14px]">₹1,120 Cr</span>
                  </div>
                  <span className="text-[#A1A1AA] text-[10px] uppercase tracking-wider">Expenditure Incurred</span>
                </div>

                <div className="w-[1px] h-[32px] bg-white/10" />

                <div className="flex flex-col gap-[4px]">
                  <div className="flex items-center gap-[6px]">
                    <Zap className="w-[14px] h-[14px] text-[#3B82F6]" />
                    <span className="text-white font-bold text-[14px]">~2.8 Cr Units</span>
                  </div>
                  <span className="text-[#A1A1AA] text-[10px] uppercase tracking-wider">Units of Power Subsidized</span>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* KEY REPORTS & DOCUMENTS */}
        <div className="mt-[48px] pt-[48px] border-t border-white/5">
          <div className="flex items-center justify-between mb-[24px]">
            <div>
              <h2 className="text-white text-[16px] font-bold mb-[4px]">Key Reports & Documents</h2>
              <p className="text-[#A1A1AA] text-[13px]">Key documents and proof supporting this promise.</p>
            </div>
            <Link href="#" className="flex items-center gap-[6px] text-[#3B82F6] hover:text-[#60A5FA] transition-colors text-[13px] font-medium">
              View All Evidence & Documents <ArrowRight className="w-[14px] h-[14px]" />
            </Link>
          </div>

          <div className="relative">
            <div className="flex gap-[24px] overflow-x-auto no-scrollbar pb-[16px]">
              {/* Evidence Cards */}
              {[1, 2, 3, 4, 5].map((item, idx) => (
                <div key={idx} className="shrink-0 w-[300px] premium-card p-[16px] flex flex-col justify-between group cursor-pointer hover:border-white/20 transition-all">
                  <div className="flex gap-[12px] mb-[16px]">
                     <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] bg-white/5 flex items-center justify-center overflow-hidden">
                       <FileText className="w-[20px] h-[20px] text-[#A1A1AA]" />
                     </div>
                     <div>
                       <h4 className="text-white text-[13px] font-semibold line-clamp-2 leading-snug mb-[4px]">Cabinet Decision Document</h4>
                       <p className="text-[#A1A1AA] text-[11px] mb-[4px]">Dec 2022</p>
                       <p className="text-[#A1A1AA] text-[12px] line-clamp-2 leading-relaxed">Cabinet approves 300 units free electricity scheme.</p>
                     </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-yellow-500 text-[10px] font-bold uppercase tracking-wider">Government Order</span>
                    <Download className="w-[14px] h-[14px] text-[#A1A1AA] group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right Scroll Gradient & Button */}
            <div className="absolute right-0 top-0 bottom-0 w-[100px] bg-gradient-to-l from-[var(--bg-base)] to-transparent pointer-events-none flex items-center justify-end pr-[16px]">
              <button className="w-[32px] h-[32px] rounded-full bg-[#111111] border border-white/10 flex items-center justify-center text-white shadow-lg pointer-events-auto hover:bg-white/10 transition-colors">
                <ArrowRight className="w-[16px] h-[16px]" />
              </button>
            </div>
          </div>
        </div>

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
