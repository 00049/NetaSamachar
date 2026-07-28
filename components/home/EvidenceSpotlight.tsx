/* eslint-disable react/no-unescaped-entities */
'use client';
import Link from 'next/link';
import { Evidence } from '@/lib/types';
import { Check } from 'lucide-react';

interface Props {
  evidence: Evidence;
}

export function EvidenceSpotlight({ evidence }: Props) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-[8px] relative overflow-hidden group">
      
      {/* Decorative Stamp */}
      <div className="absolute top-12 right-12 text-[8px] font-mono text-[#71717A] uppercase tracking-[0.2em] text-right pointer-events-none opacity-50 z-0">
        <div>SHA-256 CHECK</div>
        <div>{evidence.sha256Hash.substring(0, 32)}</div>
        <div>VERIFIED {new Date().getFullYear()}</div>
      </div>

      <div className="p-[48px] relative z-10 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="px-2 py-1 bg-white text-[#090B12] text-[10px] font-bold uppercase tracking-widest">
            Primary Evidence Spotlight
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">
            Tier {evidence.tier} • {evidence.type.replace('_', ' ')}
          </span>
        </div>

        <h3 className="font-serif text-3xl md:text-4xl font-black text-[#F5F5F7] mb-8 leading-tight">
          {evidence.title}
        </h3>

        <div className="pl-6 border-l-[3px] border-[#FBBF24] mb-8">
          <p className="text-[22px] text-[#E4E4E7] font-serif italic" style={{ lineHeight: 1.5 }}>
            "{evidence.excerpt}"
          </p>
        </div>
        
        <div className="mt-8">
          <Link 
            href="/evidence" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-white/80 transition-colors"
          >
            Access Full Archive →
          </Link>
        </div>
      </div>

      <div className="bg-white/[0.02] border-t border-white/8 px-[48px] py-[20px] flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] mb-1">Source</div>
          <div className="text-sm font-bold text-[#F5F5F7] uppercase tracking-wider">{evidence.source}</div>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] mb-2">Confidence Score</div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(52,211,153,0.12)' }}>
            <Check className="w-3.5 h-3.5 text-[#34D399]" />
            <span className="text-[16px] font-bold text-[#34D399] tabular-nums mt-0.5">
              {evidence.confidenceScore}/100
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
