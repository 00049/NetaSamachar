'use client';

import { useState } from 'react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Search, ArrowUpDown } from 'lucide-react';
import { ArchiveCard } from '@/components/archive/ArchiveCard';

// --- MOCK DATA ---
const STATS = [
  { label: 'Total Documents', value: 12847, color: 'var(--text-primary)' },
  { label: 'Tier 1 Sources', value: 8294, color: 'var(--accent-info)' },
  { label: 'SHA-256 Verified', value: 100, suffix: '%', color: 'var(--accent-positive)' },
  { label: 'Last Ingested', value: 2, suffix: 'h ago', color: 'var(--text-tertiary)' },
];

const MOCK_DOCUMENTS = [
  {
    id: 'doc-1',
    title: 'UP Budget Allocation 2023-24: Public Works Department',
    type: 'budget_document',
    tier: 1,
    excerpt: 'An outlay of ₹25,350 crore has been proposed for roads and bridges, including the initial allocation for the Ganga Expressway Phase II land acquisition.',
    source: 'Ministry of Finance, Govt of UP',
    confidenceScore: 98,
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    supports: [
      { type: 'promise', label: 'Ganga Expressway Phase II', href: '/promises/p-1' },
      { type: 'politician', label: 'Yogi Adityanath', href: '/politicians/yogi-adityanath' }
    ]
  },
  {
    id: 'doc-2',
    title: 'CAG Audit Report: Healthcare Infrastructure 2022',
    type: 'cag_report',
    tier: 1,
    excerpt: 'Audit observed that out of the 15 targeted primary health centers in the district, only 4 were functional by the deadline. Funds for the remaining 11 were unutilized.',
    source: 'Comptroller and Auditor General of India',
    confidenceScore: 95,
    sha256Hash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    supports: [
      { type: 'promise', label: '100 New PHCs by 2022', href: '/promises/p-2' }
    ]
  },
  {
    id: 'doc-3',
    title: 'RTI Response: Status of Metro Rail Project',
    type: 'rti_response',
    tier: 2,
    excerpt: 'As per the records available with the Urban Development department, the Detailed Project Report (DPR) is currently under revision and civil works have not commenced.',
    source: 'Urban Development Department, State Govt',
    confidenceScore: 78,
    sha256Hash: 'f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2',
    supports: [
      { type: 'promise', label: 'City Metro Rail Network', href: '/promises/p-3' },
      { type: 'politician', label: 'Siddaramaiah', href: '/politicians/siddaramaiah' }
    ]
  }
];

type DocumentTypeFilter = 'All' | 'Budget Document' | 'Court Order' | 'Gazette' | 'Parliamentary Record' | 'RTI Response';
type TierFilter = 'All' | 'Tier 1' | 'Tier 2';

export default function ArchivePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState<DocumentTypeFilter>('All');
  const [activeTier, setActiveTier] = useState<TierFilter>('All');
  const [sortBy, setSortBy] = useState('recent');

  const documentTypes: DocumentTypeFilter[] = ['All', 'Budget Document', 'Court Order', 'Gazette', 'Parliamentary Record', 'RTI Response'];
  const tiers: TierFilter[] = ['All', 'Tier 1', 'Tier 2'];

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* ── Stats Strip ────────────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--border-subtle)] overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[var(--border-subtle)] border-l border-[var(--border-subtle)]">
          {STATS.map((stat, i) => (
            <div key={i} className="px-[32px] py-[40px] bg-[var(--bg-base)]">
              <div className="text-[12px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-3">
                {stat.label}
              </div>
              <div 
                className="text-[56px] font-semibold leading-none"
                style={{ color: stat.color, fontVariantNumeric: 'tabular-nums' }}
              >
                {typeof stat.value === 'number' && stat.label !== 'Last Ingested' ? (
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                ) : (
                  <span>{stat.value}{stat.suffix}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Filter / Search Bar ────────────────────────────────────────────────── */}
      <div className="border-b border-[var(--border-subtle)] sticky top-0 z-30 bg-[var(--bg-base)]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            
            {/* Search */}
            <div className="relative w-full xl:max-w-md flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents, sources, or SHA hashes..."
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-[var(--border-subtle)] text-sm font-medium focus:outline-none focus:border-[var(--text-primary)] transition-colors rounded-none"
              />
            </div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 xl:ml-auto w-full xl:w-auto overflow-x-auto no-scrollbar">
              
              {/* Type Filter Chips */}
              <div className="flex flex-wrap items-center gap-[8px] flex-shrink-0">
                {documentTypes.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveType(filter)}
                    className={`h-[32px] px-[14px] rounded-[16px] text-[13px] whitespace-nowrap transition-all duration-150 ${
                      activeType === filter
                        ? 'bg-white/10 border border-white/30 text-white font-semibold'
                        : 'bg-transparent border border-white/12 text-[#A1A1AA] hover:border-white/25 hover:text-[#D4D4D8]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="h-6 w-px bg-[var(--border-subtle)] hidden lg:block flex-shrink-0" />

              {/* Tier Filter Chips */}
              <div className="flex flex-wrap items-center gap-[8px] flex-shrink-0">
                {tiers.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveTier(filter)}
                    className={`h-[32px] px-[14px] rounded-[16px] text-[13px] whitespace-nowrap transition-all duration-150 ${
                      activeTier === filter
                        ? 'bg-white/10 border border-white/30 text-white font-semibold'
                        : 'bg-transparent border border-white/12 text-[#A1A1AA] hover:border-white/25 hover:text-[#D4D4D8]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="h-6 w-px bg-[var(--border-subtle)] hidden xl:block flex-shrink-0" />

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 pl-3 border border-[var(--border-subtle)] pr-4 min-h-[36px] rounded-[8px] bg-white/5 flex-shrink-0">
                <ArrowUpDown className="w-4 h-4 text-[var(--text-tertiary)]" />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[13px] font-medium text-[var(--text-primary)] focus:outline-none cursor-pointer"
                >
                  <option value="recent">Most Recent</option>
                  <option value="confidence">Confidence Score</option>
                  <option value="tier">Tier</option>
                </select>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Document List ──────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-16 pb-[96px]">
        <div className="flex flex-col gap-12">
          {MOCK_DOCUMENTS.map(doc => (
            <ArchiveCard key={doc.id} doc={doc} />
          ))}

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <button className="px-8 py-3 border border-white/20 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-white/10 hover:border-white/30 transition-all rounded-[4px]">
              Load 20 more documents
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
