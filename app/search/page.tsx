'use client';
/* eslint-disable react/no-unescaped-entities */

import { useState, useMemo, useCallback, Suspense } from 'react';
import { SearchX } from 'lucide-react';
import { PoliticianCard } from '@/components/politicians/PoliticianCard';
import { PromiseCard } from '@/components/promises/PromiseCard';
import { ArchiveCard } from '@/components/archive/ArchiveCard';
import { POLITICIANS } from '@/data/politicians';
import { PROMISES } from '@/data/promises';
import { DebouncedSearchInput } from '@/components/ui/DebouncedSearchInput';
import { useSearchCache } from '@/lib/useSearchCache';
import { useUrlState } from '@/lib/useUrlState';

// Mock Evidence since it doesn't live in data yet
const MOCK_EVIDENCE = [
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
  }
];

type SearchTab = 'All' | 'Politicians' | 'Promises' | 'Evidence';

const POPULAR_SEARCHES = ['Infrastructure', 'Healthcare', 'Broken Promises', 'Pending Scrutiny', 'BJP', 'INC'];

function SearchContent() {
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTab, setActiveTab] = useUrlState('tab', 'All');

  const cache = useSearchCache<{ politicians: typeof POLITICIANS; promises: typeof PROMISES; evidence: typeof MOCK_EVIDENCE }>('search');

  const handleDebouncedSearch = useCallback((q: string) => setDebouncedQuery(q.trim().toLowerCase()), []);

  // Compute Results — cached by query so clearing and re-typing is instant
  const { politicians, promises, evidence } = useMemo(() => {
    if (!debouncedQuery) return { politicians: [], promises: [], evidence: [] };
    const cached = cache.get(debouncedQuery);
    if (cached) return cached;
    const p = POLITICIANS.filter(
      (x) =>
        x.name.toLowerCase().includes(debouncedQuery) ||
        x.constituency.toLowerCase().includes(debouncedQuery)
    );
    const pr = PROMISES.filter(
      (x) =>
        x.title.toLowerCase().includes(debouncedQuery) ||
        x.fullStatement.toLowerCase().includes(debouncedQuery)
    );
    const ev = MOCK_EVIDENCE.filter(
      (x) =>
        x.title.toLowerCase().includes(debouncedQuery) ||
        x.excerpt.toLowerCase().includes(debouncedQuery) ||
        x.sha256Hash.toLowerCase().includes(debouncedQuery)
    );
    const result = { politicians: p, promises: pr, evidence: ev };
    cache.set(debouncedQuery, result);
    return result;
  }, [debouncedQuery, cache]);

  const totalResults = politicians.length + promises.length + evidence.length;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
      {/* ── Search Header ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-[var(--bg-base)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-8">
          
          <DebouncedSearchInput
            value={inputValue}
            onChange={setInputValue}
            onDebounced={handleDebouncedSearch}
            placeholder="Search politicians, promises, or evidence..."
            className="mb-6 [&_input]:h-[64px] [&_input]:text-[18px] [&_input]:pl-14 [&_input]:border-[rgba(255,255,255,0.08)] [&_input]:focus:border-white/20"
            id="global-search"
          />

          <div className="flex items-center gap-8 border-b border-[var(--border-subtle)] overflow-x-auto no-scrollbar">
            {['All', 'Politicians', 'Promises', 'Evidence'].map((tab) => {
              const count = tab === 'All' ? totalResults :
                            tab === 'Politicians' ? politicians.length :
                            tab === 'Promises' ? promises.length :
                            evidence.length;
              
              const isActive = activeTab === tab;
              
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as SearchTab)}
                  className={`pb-4 text-[13px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors relative ${isActive ? 'text-white' : 'text-[#71717A] hover:text-[#A1A1AA]'}`}
                >
                  {tab} {debouncedQuery && `(${count})`}
                  {isActive && (
                    <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Results Area ──────────────────────────────────────────── */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-12 pb-[96px]">
        
        {/* Default / No Query State */}
        {!debouncedQuery && (
          <div className="pt-8">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#71717A] mb-4 text-center">
              Popular Searches
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              {POPULAR_SEARCHES.map(q => (
                <button
                  key={q}
                  onClick={() => setInputValue(q)}
                  className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] text-[#A1A1AA] text-[13px] hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {debouncedQuery && totalResults === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-24">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <SearchX className="w-8 h-8 text-[#A1A1AA]" />
            </div>
            <h3 className="text-[20px] font-serif font-bold text-white mb-2">
              No results for "{debouncedQuery}"
            </h3>
            <p className="text-[#A1A1AA] text-[15px] mb-8">
              Try a different name, constituency, or keyword.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {POPULAR_SEARCHES.slice(0, 3).map(q => (
                <button
                  key={q}
                  onClick={() => setInputValue(q)}
                  className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] text-[#A1A1AA] text-[13px] hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Render Results */}
        {debouncedQuery && totalResults > 0 && (
          <div className="flex flex-col gap-12">
            
            {/* Politicians */}
            {(activeTab === 'All' || activeTab === 'Politicians') && politicians.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#71717A] mb-6">Politicians ({politicians.length})</h4>
                <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
                  {politicians.map(p => (
                    <PoliticianCard key={p.id} politician={p} viewMode="grid" />
                  ))}
                </div>
              </div>
            )}

            {/* Promises */}
            {(activeTab === 'All' || activeTab === 'Promises') && promises.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#71717A] mb-6">Promises ({promises.length})</h4>
                <div className="flex flex-col gap-6">
                  {promises.map(pr => (
                    <PromiseCard key={pr.id} promise={pr} viewMode="compact" />
                  ))}
                </div>
              </div>
            )}

            {/* Evidence */}
            {(activeTab === 'All' || activeTab === 'Evidence') && evidence.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#71717A] mb-6">Evidence ({evidence.length})</h4>
                <div className="flex flex-col gap-6">
                  {evidence.map(ev => (
                    <ArchiveCard key={ev.id} doc={ev} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-base)]" />}>
      <SearchContent />
    </Suspense>
  );
}
