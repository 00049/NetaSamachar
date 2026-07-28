'use client';

import { useState } from 'react';
import { Politician, Bill } from '@/lib/types';
import { ExternalLink, ChevronDown, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusPill } from '@/components/ui/StatusPill';

interface Props {
  politician: Politician;
  bills: Bill[];
}

const STAGES = ['introduced', 'in_committee', 'floor_vote', 'outcome'];

export function BillsTab({ politician, bills }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!bills || bills.length === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border border-[var(--border-subtle)] p-12 text-center">
        <h3 className="text-[var(--text-primary)] font-bold mb-2">No Bills Found</h3>
        <p className="text-[var(--text-tertiary)] text-sm">There are no bills officially introduced by {politician.name} in our database.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
      {bills.map(bill => {
        const isExpanded = expandedId === bill.id;
        
        // Determine stages
        let currentStageIndex = 0;
        if (bill.status === 'in_committee') currentStageIndex = 1;
        if (['passed', 'rejected', 'withdrawn'].includes(bill.status)) currentStageIndex = 3;

        return (
          <div 
            key={bill.id} 
            className={clsx(
              "bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-[4px] overflow-hidden transition-all duration-200",
              isExpanded && "border-white/20 bg-[rgba(255,255,255,0.04)]"
            )}
          >
            {/* Clickable Header (Collapsed State) */}
            <button 
              onClick={() => setExpandedId(isExpanded ? null : bill.id)}
              className="w-full text-left p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <StatusPill status={bill.status} />
                  
                  <span className="text-[var(--border-default)]">&middot;</span>
                  
                  <span className="text-[var(--text-tertiary)] font-bold uppercase tracking-widest text-[10px]">
                    {bill.sponsorRole === 'primary_sponsor' ? 'Primary Sponsor' : 'Co-Sponsor'}
                  </span>
                  
                  <span className="text-[var(--border-default)]">&middot;</span>
                  
                  <span className="text-[var(--text-tertiary)] font-bold uppercase tracking-widest text-[10px]">
                    {new Date(bill.introducedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <h3 className="font-serif font-bold text-xl text-[var(--text-primary)] leading-tight mb-2">
                  {bill.title}
                </h3>
                
                <p className="text-[var(--text-secondary)] text-sm line-clamp-1">
                  {bill.summary}
                </p>
              </div>
              
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 flex-shrink-0 ml-auto md:ml-4">
                <ChevronDown className={clsx(
                  "w-4 h-4 text-[var(--text-secondary)] transition-transform duration-300",
                  isExpanded && "rotate-180"
                )} />
              </div>
            </button>

            {/* Expanded Content (Accordion) */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-6 md:p-8 pt-0 border-t border-[rgba(255,255,255,0.05)] mt-2">
                    
                    {/* Full Summary */}
                    <div className="mb-10 mt-6">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-3">Bill Summary</h4>
                      <p className="text-[var(--text-primary)] leading-relaxed text-sm md:text-base">
                        {bill.summary}
                      </p>
                    </div>

                    {/* Horizontal Stage Tracker */}
                    <div className="mb-10">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-4">Legislative Progress</h4>
                      <div className="flex items-center w-full max-w-2xl">
                        {STAGES.map((stage, idx) => {
                          const isCompleted = idx <= currentStageIndex;
                          const isLast = idx === STAGES.length - 1;
                          const isCurrent = idx === currentStageIndex;
                          
                          let stageLabel = '';
                          if (stage === 'introduced') stageLabel = 'Introduced';
                          if (stage === 'in_committee') stageLabel = 'Committee';
                          if (stage === 'floor_vote') stageLabel = 'Floor Vote';
                          if (stage === 'outcome') {
                            if (bill.status === 'passed') stageLabel = 'Passed';
                            else if (bill.status === 'rejected') stageLabel = 'Rejected';
                            else if (bill.status === 'withdrawn') stageLabel = 'Withdrawn';
                            else stageLabel = 'Outcome';
                          }

                          // Color for the node
                          let nodeColor = 'text-[var(--text-tertiary)]';
                          if (isCompleted) {
                            if (isCurrent && ['passed'].includes(bill.status)) nodeColor = 'text-[var(--accent-positive)]';
                            else if (isCurrent && ['rejected'].includes(bill.status)) nodeColor = 'text-[var(--accent-negative)]';
                            else nodeColor = 'text-white';
                          }

                          return (
                            <div key={stage} className="flex items-center flex-1 last:flex-none">
                              <div className="flex flex-col items-center gap-2 relative z-10 w-8">
                                <div className={clsx("transition-colors duration-300", nodeColor)}>
                                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                </div>
                                <span className={clsx(
                                  "absolute top-8 whitespace-nowrap text-[10px] font-bold uppercase tracking-wider transition-colors duration-300",
                                  isCompleted ? "text-[var(--text-secondary)]" : "text-[var(--text-tertiary)]"
                                )}>
                                  {stageLabel}
                                </span>
                              </div>
                              {!isLast && (
                                <div className={clsx(
                                  "h-[2px] flex-1 mx-2 transition-colors duration-300",
                                  idx < currentStageIndex ? "bg-white" : "bg-white/10"
                                )} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="h-8" /> {/* Spacer for absolute text */}
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 md:gap-16 pt-6 border-t border-[rgba(255,255,255,0.05)]">
                      {/* Voting Outcome */}
                      {(bill.votesFor !== undefined || bill.votesAgainst !== undefined) && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-4">Floor Vote Outcome</h4>
                          <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                              <span className="text-2xl font-black text-[var(--accent-positive)] font-serif leading-none">{bill.votesFor || 0}</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mt-1">For</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-2xl font-black text-[var(--accent-negative)] font-serif leading-none">{bill.votesAgainst || 0}</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mt-1">Against</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-2xl font-black text-[var(--text-secondary)] font-serif leading-none">{bill.votesAbstain || 0}</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mt-1">Abstain</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Links and Related */}
                      <div className="flex-1 flex flex-col md:flex-row gap-8 justify-end">
                        
                        {/* External Links */}
                        {(bill.officialRecordUrl || bill.gazetteUrl) && (
                          <div className="flex flex-col gap-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">Official Sources</h4>
                            {bill.officialRecordUrl && (
                              <a href={bill.officialRecordUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-info)] hover:underline">
                                <ExternalLink className="w-3.5 h-3.5" />
                                Official Parliament Record
                              </a>
                            )}
                            {bill.gazetteUrl && (
                              <a href={bill.gazetteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-info)] hover:underline">
                                <ExternalLink className="w-3.5 h-3.5" />
                                Official Gazette
                              </a>
                            )}
                          </div>
                        )}

                        {/* Related Investigations */}
                        {bill.relatedPromiseIds && bill.relatedPromiseIds.length > 0 && (
                          <div className="flex flex-col gap-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">Related Investigations</h4>
                            <div className="flex flex-wrap gap-2">
                              {bill.relatedPromiseIds.map(id => (
                                <Link 
                                  key={id} 
                                  href={`/promises/${id}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[var(--text-secondary)] hover:bg-white/10 hover:text-white transition-colors"
                                >
                                  <AlertCircle className="w-3 h-3 text-[var(--accent-warning)]" />
                                  Promise {id.split('-').pop()}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                        
                      </div>
                    </div>
                    
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
