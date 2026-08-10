'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import type { AISummary } from '@prisma/client';

interface IntelligenceOverviewProps {
  politicianId: string;
}

export function IntelligenceOverview({ politicianId }: IntelligenceOverviewProps) {
  const [data, setData] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const pollCount = useRef(0);

  const fetchSummary = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/politicians/${politicianId}/summary`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setError(true);
      }
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [politicianId]);

  // Polling logic if GENERATING
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (data?.status === 'GENERATING') {
      interval = setInterval(() => {
        if (pollCount.current >= 10) {
          clearInterval(interval);
          setError(true);
          return;
        }
        pollCount.current += 1;
        fetchSummary();
      }, 3000); // Poll every 3s
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [data?.status, politicianId]);

  if (loading && !data) {
    return (
      <div className="card-elevated p-[24px] flex items-center justify-center animate-pulse min-h-[140px]">
        <div className="flex items-center gap-[12px] text-[#A1A1AA]">
          <RefreshCw className="w-[16px] h-[16px] animate-spin text-[#3B82F6]" />
          <span className="text-[14px]">Updating Intelligence Overview...</span>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="card-elevated p-[24px] flex flex-col items-center justify-center min-h-[140px] text-center gap-3">
        <span className="text-[#F87171] text-[14px] font-medium">Failed to load intelligence overview</span>
        <button 
          onClick={fetchSummary}
          className="px-4 py-1.5 rounded-md bg-[#F87171]/10 text-[#F87171] hover:bg-[#F87171]/20 text-[13px] font-bold transition-colors border border-[#F87171]/20"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Calculate "Updated X hours ago"
  let timeAgo = "Updated recently";
  if (data?.generatedAt) {
    const hours = Math.round((new Date().getTime() - new Date(data.generatedAt).getTime()) / (1000 * 60 * 60));
    if (hours === 0) timeAgo = "Updated just now";
    else if (hours === 1) timeAgo = "Updated 1 hour ago";
    else timeAgo = `Updated ${hours} hours ago`;
  }

  const isGenerating = data?.status === 'GENERATING';

  return (
    <div className="card-elevated p-[24px] flex flex-col gap-[16px] relative overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <Sparkles className="w-[16px] h-[16px] text-[#3B82F6]" />
          <span className="text-[#3B82F6] text-[12px] uppercase tracking-wider font-bold">✨ Intelligence Overview</span>
        </div>
        {isGenerating && (
           <div className="flex items-center gap-[8px] bg-[#3B82F6]/10 border border-[#3B82F6]/20 px-[12px] py-[4px] rounded-full">
             <RefreshCw className="w-[12px] h-[12px] animate-spin text-[#3B82F6]" />
             <span className="text-[#3B82F6] text-[11px] font-medium uppercase tracking-widest">Updating...</span>
           </div>
        )}
      </div>
      
      {/* BODY */}
      <div className="text-[#A1A1AA] text-[15px] leading-relaxed">
        {data?.summary ? data.summary : "Analyzing millions of data points to generate your intelligence overview..."}
      </div>
      
      {/* FOOTER */}
      <div className="pt-[16px] border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-[12px]">
        <div className="flex flex-col gap-[4px]">
          <span className="text-white text-[11px] font-medium">{timeAgo}</span>
          {data?.sourcesUsed && (
            <span className="text-[#52525B] text-[11px]">
              Sources: {(() => {
                try {
                  return JSON.parse(data.sourcesUsed).join(', ');
                } catch {
                  return '';
                }
              })()}
            </span>
          )}
        </div>
        <Link href={`/politicians/${politicianId}/executive-brief`} className="flex items-center justify-center border border-white/10 rounded-xs py-[8px] px-[16px] text-[#A1A1AA] text-[13px] font-medium hover:text-white hover:bg-white/5 transition-all duration-[220ms] whitespace-nowrap">
          Read Full Overview <span className="ml-[8px]">&gt;</span>
        </Link>
      </div>
    </div>
  );
}
