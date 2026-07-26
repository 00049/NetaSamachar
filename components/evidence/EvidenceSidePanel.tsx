'use client';

import { Evidence } from '@/lib/types';
import { EVIDENCE_TYPE_CONFIG } from '@/lib/utils';
import { PROMISES } from '@/data/promises';
import { POLITICIANS } from '@/data/politicians';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, CheckCircle2, Copy, Download, ExternalLink, Link2, GitCommit, Network, Users } from 'lucide-react';
import { ConfidenceScore } from '../ui/ConfidenceScore';
import { useState } from 'react';
import Link from 'next/link';

interface Props {
  evidence: Evidence | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EvidenceSidePanel({ evidence, isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'metadata' | 'graph'>('metadata');

  if (!evidence) return null;

  const typeConfig = EVIDENCE_TYPE_CONFIG[evidence.type];

  // Find linked promises
  const linkedPromises = PROMISES.filter(p => p.evidenceIds.includes(evidence.id));
  
  // Find linked politicians from those promises
  const linkedPoliticianIds = Array.from(new Set(linkedPromises.map(p => p.politicianId)));
  const linkedPoliticians = POLITICIANS.filter(p => linkedPoliticianIds.includes(p.id));

  const handleCopyCitation = () => {
    // Basic APA-ish citation for the platform
    const citation = `${evidence.source}. (${new Date(evidence.date).getFullYear()}). ${evidence.title}. Neta Samachar Evidence Archive.`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[600px] lg:w-[900px] bg-[var(--bg-base)] border-l border-[var(--border-subtle)] shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-raised)]">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 border-r border-[var(--border-subtle)] pr-6">
                  <FileText className="w-4 h-4 text-[var(--text-tertiary)]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
                    Document Inspector
                  </span>
                </div>
                {/* Tabs */}
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setActiveTab('metadata')}
                    className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'metadata' ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
                  >
                    Metadata & Links
                  </button>
                  <button 
                    onClick={() => setActiveTab('graph')}
                    className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'graph' ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
                  >
                    Evidence Graph
                  </button>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-[var(--border-subtle)] transition-colors rounded-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* Left Column: Metadata (Scrollable) */}
              <div className="flex-1 p-6 md:p-8 md:border-r border-[var(--border-subtle)] overflow-y-auto">
                
                {activeTab === 'metadata' ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-[var(--bg-base)] text-[var(--text-primary)] px-2 py-1 border border-[var(--border-subtle)]">
                        Tier {typeConfig.tier}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
                        {typeConfig.label}
                      </span>
                      {evidence.confidenceScore > 80 && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-positive)] ml-auto flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> High Credibility Source
                        </span>
                      )}
                    </div>
                    
                    <h2 className="font-serif text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-6 leading-tight">
                      {evidence.title}
                    </h2>

                    <div className="grid grid-cols-2 gap-y-6 mb-8 pb-8 border-b border-[var(--border-subtle)]">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">Source Authority</div>
                        <div className="text-sm font-semibold text-[var(--text-primary)]">{evidence.source}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">Publication Date</div>
                        <div className="text-sm font-mono text-[var(--text-primary)]">{new Date(evidence.date).toISOString().split('T')[0]}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1 flex items-center justify-between">
                          <span>Epistemological Confidence</span>
                          <ConfidenceScore score={evidence.confidenceScore} size="sm" showLabel={false} />
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-[var(--accent-positive)]" />
                        Cryptographic Verification
                      </div>
                      <div className="bg-[var(--bg-raised)] border border-[var(--border-subtle)] p-3 flex items-center justify-between gap-4">
                        <div className="flex-1 truncate">
                          <div className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">SHA-256 Hash</div>
                          <code className="text-[10px] font-mono text-[var(--text-primary)] truncate block">
                            {evidence.sha256Hash}
                          </code>
                        </div>
                        <button 
                          onClick={() => navigator.clipboard.writeText(evidence.sha256Hash)}
                          className="p-2 hover:bg-[var(--bg-base)] border border-transparent hover:border-[var(--border-subtle)] transition-colors text-[var(--text-tertiary)]"
                          title="Copy Hash"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-3">
                        Excerpt Summary
                      </div>
                      <p className="text-[var(--text-primary)] text-sm leading-relaxed font-serif italic border-l-2 border-[var(--border-subtle)] pl-4">
                        "{evidence.excerpt}"
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-[var(--border-subtle)]">
                      {evidence.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] border border-[var(--border-subtle)] px-2 py-1">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Document Relationships: Linked Promises & Politicians */}
                    <div className="mb-8">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-4 flex items-center gap-2">
                        <Link2 className="w-3 h-3" />
                        Document Relationships
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Linked Promises ({linkedPromises.length})</div>
                          <div className="space-y-2">
                            {linkedPromises.map(p => (
                              <Link key={p.id} href={`/promises/${p.id}`} className="block p-3 border border-[var(--border-subtle)] bg-[var(--bg-raised)] hover:border-[var(--text-primary)] glide-transition">
                                <div className="text-xs font-bold text-[var(--text-primary)] leading-snug line-clamp-1">{p.title}</div>
                              </Link>
                            ))}
                            {linkedPromises.length === 0 && <div className="text-xs text-[var(--text-tertiary)] italic">No promises directly linked.</div>}
                          </div>
                        </div>

                        <div>
                          <div className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-2 mt-4">Linked Politicians ({linkedPoliticians.length})</div>
                          <div className="flex flex-wrap gap-2">
                            {linkedPoliticians.map(p => (
                              <Link key={p.id} href={`/politicians/${p.id}`} className="flex items-center gap-2 px-3 py-1.5 border border-[var(--border-subtle)] bg-[var(--bg-raised)] hover:border-[var(--text-primary)] glide-transition">
                                <Users className="w-3 h-3 text-[var(--text-tertiary)]" />
                                <div className="text-xs font-bold text-[var(--text-primary)]">{p.name}</div>
                              </Link>
                            ))}
                            {linkedPoliticians.length === 0 && <div className="text-xs text-[var(--text-tertiary)] italic">No politicians directly linked.</div>}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Version History Mock */}
                    <div className="mb-4">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-4 flex items-center gap-2">
                        <GitCommit className="w-3 h-3" />
                        Version History
                      </div>
                      <div className="border-l border-[var(--border-subtle)] ml-1.5 space-y-4">
                        <div className="relative pl-4">
                          <div className="absolute -left-[5px] top-1 w-2 h-2 bg-[var(--text-primary)] rounded-full" />
                          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-0.5">Current Revision</div>
                          <div className="text-xs text-[var(--text-primary)]">Verified hash: {evidence.sha256Hash.substring(0,8)}</div>
                        </div>
                        <div className="relative pl-4">
                          <div className="absolute -left-[5px] top-1 w-2 h-2 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-full" />
                          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-0.5">Original Ingestion</div>
                          <div className="text-xs text-[var(--text-tertiary)]">{new Date(evidence.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-6 flex items-center gap-2">
                      <Network className="w-4 h-4" />
                      Evidence Graph Visualization
                    </div>
                    {/* Mock Graph Visualization */}
                    <div className="flex-1 bg-[var(--bg-raised)] border border-[var(--border-subtle)] relative overflow-hidden flex items-center justify-center p-8 min-h-[400px]">
                      
                      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                        <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                        <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                        <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                        <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                      </svg>

                      {/* Central Node */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-[var(--bg-base)] border-2 border-[var(--text-primary)] p-4 rounded-lg shadow-xl max-w-[200px] text-center">
                        <FileText className="w-6 h-6 mx-auto mb-2 text-[var(--text-primary)]" />
                        <div className="text-xs font-bold text-[var(--text-primary)] line-clamp-2">{evidence.title}</div>
                      </div>

                      {/* Linked Promise Nodes */}
                      {linkedPromises.map((p, i) => {
                        const angle = (i * 2 * Math.PI) / (linkedPromises.length || 1);
                        const radius = 140;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;

                        return (
                          <div 
                            key={p.id} 
                            className="absolute top-1/2 left-1/2 z-10 bg-[var(--bg-base)] border border-[var(--border-subtle)] p-2 rounded max-w-[120px] text-center text-[10px] text-[var(--text-tertiary)] truncate"
                            style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                          >
                            <Link2 className="w-3 h-3 mx-auto mb-1" />
                            {p.title}
                          </div>
                        );
                      })}

                    </div>
                    <div className="mt-4 text-xs text-[var(--text-tertiary)] italic text-center">
                      Showing immediate entity relationships. This document serves as the absolute source for {linkedPromises.length} promises.
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right Column: PDF Preview Mock */}
              <div className="hidden lg:flex flex-1 bg-[var(--bg-raised)] flex-col p-4 border-l border-[var(--border-subtle)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] flex items-center gap-2">
                    <Download className="w-3 h-3" />
                    Document Viewer
                  </div>
                  {evidence.sourceUrl && (
                    <a
                      href={evidence.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-info)] flex items-center gap-1 hover:underline underline-offset-2"
                    >
                      Primary Source <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                
                {/* PDF MOCK */}
                <div className="flex-1 bg-[#F4F5F7] rounded-sm border border-[var(--border-subtle)] shadow-inner relative overflow-hidden flex flex-col items-center p-8">
                  {/* Decorative PDF elements */}
                  <div className="w-full max-w-[80%] h-4 bg-gray-300 rounded-sm mb-8 opacity-40" />
                  <div className="w-full h-2 bg-gray-300 rounded-sm mb-3 opacity-40" />
                  <div className="w-full h-2 bg-gray-300 rounded-sm mb-3 opacity-40" />
                  <div className="w-[90%] h-2 bg-gray-300 rounded-sm mb-3 opacity-40" />
                  <div className="w-[85%] h-2 bg-gray-300 rounded-sm mb-12 opacity-40" />
                  
                  <div className="w-full h-32 bg-gray-200 border border-gray-300 mb-8 flex items-center justify-center opacity-40">
                    <span className="text-gray-400 font-serif text-sm">[Table Data]</span>
                  </div>

                  <div className="w-full h-2 bg-gray-300 rounded-sm mb-3 opacity-40" />
                  <div className="w-[70%] h-2 bg-gray-300 rounded-sm opacity-40" />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F4F5F7] via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
                    <button className="bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg">
                      <Download className="w-3 h-3" />
                      Download Original
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-base)] flex items-center justify-between">
              <button 
                onClick={handleCopyCitation}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-raised)] border border-[var(--border-subtle)] hover:border-[var(--text-primary)] transition-colors text-xs font-bold uppercase tracking-widest text-[var(--text-primary)]"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-[var(--accent-positive)]" /> : <Link2 className="w-4 h-4" />}
                {copied ? 'Citation Copied' : 'Cite Document'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
