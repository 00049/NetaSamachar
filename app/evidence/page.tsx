'use client';

import { useState, useMemo } from 'react';
import { EVIDENCE } from '@/data/promises';
import { EVIDENCE_TYPE_CONFIG } from '@/lib/utils';
import { Evidence } from '@/lib/types';
import { EvidenceRow } from '@/components/evidence/EvidenceRow';
import { EvidenceSidePanel } from '@/components/evidence/EvidenceSidePanel';
import { Search, Filter, BookOpen } from 'lucide-react';

export default function EvidencePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTier, setActiveTier] = useState<number | 'All'>('All');
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);

  const filteredEvidence = useMemo(() => {
    let result = [...EVIDENCE];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(q) || 
        e.excerpt.toLowerCase().includes(q) ||
        e.source.toLowerCase().includes(q)
      );
    }

    if (activeTier !== 'All') {
      result = result.filter(e => EVIDENCE_TYPE_CONFIG[e.type].tier === activeTier);
    }

    // Sort by confidence (descending) then date
    result.sort((a, b) => {
      if (b.confidenceScore !== a.confidenceScore) {
        return b.confidenceScore - a.confidenceScore;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return result;
  }, [searchQuery, activeTier]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] pb-32">
      {/* Editorial Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 pt-12 pb-12">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-[var(--border-subtle)]" />
          Primary Source Archives
        </div>
        <h1 className="font-serif text-4xl md:text-6xl font-black text-[var(--text-primary)] mb-6 tracking-tight leading-none">
          Document Repository
        </h1>
        <p className="text-base md:text-lg text-[var(--text-tertiary)] max-w-3xl leading-relaxed font-serif italic mb-8">
          The evidentiary foundation of Neta Samachar. Every claim is supported by documents archived here with cryptographic SHA-256 hashes to guarantee immutability against retroactive tampering.
        </p>

        {/* Note on Epistemology */}
        <div className="flex items-start gap-4 p-4 border border-[var(--border-subtle)] bg-[var(--bg-raised)] max-w-2xl">
          <BookOpen className="w-5 h-5 text-[var(--text-tertiary)] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[var(--text-tertiary)] leading-relaxed">
            <strong className="text-[var(--text-primary)]">Epistemological Note:</strong> Documents are ranked by Tier (T1-T4). T1 documents (Gazettes, Court Orders) represent absolute institutional truth. T4 documents (News reports) require corroboration.
          </div>
        </div>
      </div>

      {/* Sticky Database Controls */}
      <div className="sticky top-[80px] z-30 bg-[var(--bg-base)]/90 backdrop-blur-md border-y border-[var(--border-subtle)] mb-8 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query titles, excerpts, or sources..."
              className="w-full pl-10 pr-4 py-2 bg-transparent border border-transparent focus:border-[var(--border-subtle)] text-sm font-medium focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-4 border-l border-[var(--border-subtle)] pl-4">
            <Filter className="w-4 h-4 text-[var(--text-tertiary)]" />
            <select 
              value={activeTier} 
              onChange={(e) => setActiveTier(e.target.value === 'All' ? 'All' : Number(e.target.value))}
              className="bg-transparent text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] focus:outline-none cursor-pointer"
            >
              <option value="All">All Tiers</option>
              <option value="1">Tier 1 (Absolute)</option>
              <option value="2">Tier 2 (High)</option>
              <option value="3">Tier 3 (Moderate)</option>
              <option value="4">Tier 4 (Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Academic Table Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Table Header (Bloomberg Style) */}
        <div className="grid grid-cols-12 gap-4 px-4 pb-3 border-b-2 border-[var(--text-primary)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
          <div className="col-span-12 md:col-span-5">Document Title & Tier</div>
          <div className="hidden md:block col-span-3">Source Authority</div>
          <div className="hidden md:block col-span-2">Date</div>
          <div className="hidden md:block col-span-2">Confidence</div>
        </div>

        {/* Rows */}
        <div className="mb-24">
          {filteredEvidence.length === 0 ? (
            <div className="py-24 text-center text-[var(--text-tertiary)] font-serif italic text-lg border-b border-[var(--border-subtle)]">
              No documents match your query in the archive.
            </div>
          ) : (
            filteredEvidence.map(ev => (
              <EvidenceRow 
                key={ev.id} 
                evidence={ev} 
                onClick={(evidence) => setSelectedEvidence(evidence)}
              />
            ))
          )}
        </div>
      </div>

      {/* Slide-out Inspector Panel */}
      <EvidenceSidePanel 
        evidence={selectedEvidence}
        isOpen={!!selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />

    </div>
  );
}
