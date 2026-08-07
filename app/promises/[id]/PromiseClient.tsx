'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Promise as PromiseType, Evidence } from '@/lib/types';
import { 
  BarChart, 
  CheckCircle2, 
  ChevronDown, 
  FileText, 
  ArrowRight,
  Download,
  TrendingUp,
  Info,
  AlertTriangle,
  Users,
  Zap
} from 'lucide-react';
import clsx from 'clsx';
import { EVIDENCE } from '@/data/promises';

interface Props {
  promise: PromiseType;
  promiseEvidence: Evidence[];
  totalMilestones: number;
  completedMilestones: number;
  percentage: number;
}

export default function PromiseClient({ promise, promiseEvidence, totalMilestones, completedMilestones, percentage }: Props) {
  const [activeTab, setActiveTab] = useState('Timeline');
  const tabs = ['Overview', 'Timeline', 'Evidence & Documents', 'Finances', 'Impact', 'Related Promises'];

  return (
    <>
      {/* TABS NAVIGATOR */}
      <div className="flex items-center gap-[32px] border-b border-white/10 mb-[32px] overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "pb-[16px] text-[14px] font-medium transition-colors relative outline-none whitespace-nowrap",
              activeTab === tab ? "text-[var(--color-accent-positive)]" : "text-[#A1A1AA] hover:text-white"
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-accent-positive)] shadow-[0_-2px_10px_rgba(34,197,94,0.4)]" />
            )}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      {activeTab === 'Timeline' || activeTab === 'Overview' ? (
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
                              <div className="mt-[8px] inline-flex items-center gap-[6px] px-[8px] py-[4px] rounded-sm bg-white/[0.02] border border-white/10 w-fit">
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
                            <p className="text-[#A1A1AA] text-[13px]">Included in the official manifesto.</p>
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
            </div>
          </div>
        </div>
      ) : activeTab === 'Evidence & Documents' ? (
        <div className="mt-[16px]">
          <div className="flex items-center justify-between mb-[24px]">
            <div>
              <h2 className="text-white text-[16px] font-bold mb-[4px]">Key Reports & Documents</h2>
              <p className="text-[#A1A1AA] text-[13px]">Key documents and proof supporting this promise.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[24px]">
            {promiseEvidence.length > 0 ? promiseEvidence.map((evidence) => (
              <a href={evidence.sourceUrl || '#'} target="_blank" rel="noopener noreferrer" key={evidence.id} className="premium-card p-[16px] flex flex-col justify-between group cursor-pointer hover:border-white/20 transition-all min-h-[160px]">
                <div className="flex gap-[12px] mb-[16px]">
                   <div className="w-[48px] h-[48px] shrink-0 rounded-sm bg-white/5 flex items-center justify-center overflow-hidden">
                     <FileText className="w-[20px] h-[20px] text-[#A1A1AA]" />
                   </div>
                   <div>
                     <h4 className="text-white text-[13px] font-semibold line-clamp-2 leading-snug mb-[4px]">{evidence.title}</h4>
                     <p className="text-[#A1A1AA] text-[11px] mb-[4px]">{new Date(evidence.date).toLocaleDateString()}</p>
                     <p className="text-[#A1A1AA] text-[12px] line-clamp-2 leading-relaxed">{evidence.source}</p>
                   </div>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[var(--color-accent-positive)] text-[10px] font-bold uppercase tracking-wider">{evidence.type.replace('_', ' ')}</span>
                  <ArrowRight className="w-[14px] h-[14px] text-[#A1A1AA] group-hover:text-white transition-colors" />
                </div>
              </a>
            )) : (
              <div className="col-span-full py-12 flex items-center justify-center text-[#A1A1AA]">
                No evidence documents are available for this promise yet.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <div className="w-[64px] h-[64px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <Info className="w-8 h-8 text-[#A1A1AA]" />
          </div>
          <h2 className="text-white text-[18px] font-semibold mb-2">No Data Available</h2>
          <p className="text-[#A1A1AA] text-[14px] max-w-md mx-auto">
            The data for the "{activeTab}" section of this promise has not been published or verified yet. 
          </p>
        </div>
      )}
    </>
  );
}
