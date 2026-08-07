'use client';
/* eslint-disable react/no-unescaped-entities */

import { useState, useMemo, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchX } from 'lucide-react';
import { PoliticianCard } from '@/components/politicians/PoliticianCard';
import { PromiseCard } from '@/components/promises/PromiseCard';
import { ArchiveCard } from '@/components/archive/ArchiveCard';
import { performSearch } from '@/app/actions/search';
import { DebouncedSearchInput } from '@/components/ui/DebouncedSearchInput';
import { useSearchCache } from '@/lib/useSearchCache';
import { useUrlState } from '@/lib/useUrlState';


type SearchTab = 'All' | 'Politicians' | 'Promises' | 'Evidence';

const POPULAR_SEARCHES = ['Infrastructure', 'Healthcare', 'Broken Promises', 'Pending Scrutiny', 'BJP', 'INC'];

export function SearchClient() {
  const searchParams = useSearchParams();
  const [debouncedQuery, setDebouncedQueryURL] = useUrlState('q', '');
  const [inputValue, setInputValue] = useState(() => debouncedQuery);
  const [activeTab, setActiveTab] = useUrlState('tab', 'All');
  
  const [results, setResults] = useState<{ politicians: any[], promises: any[], evidence: any[] }>({ politicians: [], promises: [], evidence: [] });
  const [isSearching, setIsSearching] = useState(false);

  const cache = useSearchCache<any>('search');

  useEffect(() => {
    let active = true;
    if (!debouncedQuery) {
      setResults({ politicians: [], promises: [], evidence: [] });
      setIsSearching(false);
      return;
    }

    const cached = cache.get(debouncedQuery);
    if (cached) {
      setResults(cached);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    performSearch(debouncedQuery).then(res => {
      if (active) {
        setResults(res);
        cache.set(debouncedQuery, res);
        setIsSearching(false);
      }
    });

    return () => { active = false; };
  }, [debouncedQuery, cache]);

  const handleDebouncedSearch = useCallback((q: string) => {
    setDebouncedQueryURL(q.trim().toLowerCase());
  }, [setDebouncedQueryURL]);

  const { politicians, promises, evidence } = results;
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
            ariaLabel="Search politicians, parties, promises, and evidence"
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
                  onClick={() => {
                    setInputValue(q);
                    setDebouncedQueryURL(q.trim().toLowerCase());
                  }}
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
                  onClick={() => {
                    setInputValue(q);
                    setDebouncedQueryURL(q.trim().toLowerCase());
                  }}
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

