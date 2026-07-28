/* eslint-disable react/no-unescaped-entities */
'use client';
import { useState } from 'react';
import { Check, Copy, FileText, ChevronRight, User } from 'lucide-react';
import Link from 'next/link';

export function ArchiveCard({ doc }: { doc: any }) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-[4px] relative overflow-hidden group">
      <div className="p-[32px] md:p-[48px] relative z-10">
        {/* Tag Row */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">
            Tier {doc.tier} &middot; {doc.type.replace('_', ' ')}
          </span>
          
          {/* SHA-256 Hash Display */}
          <div className="flex items-center gap-2">
            <div className="font-mono text-[11px] text-[#52525B] tracking-wider hidden sm:block">
              {doc.sha256Hash}
            </div>
            <div className="font-mono text-[11px] text-[#52525B] tracking-wider sm:hidden">
              {doc.sha256Hash.substring(0, 16)}...
            </div>
            <button 
              onClick={() => handleCopy(doc.sha256Hash)}
              className="p-1.5 hover:bg-white/10 rounded-[4px] transition-colors group/copy relative"
              aria-label="Copy SHA-256 Hash"
            >
              {copiedHash === doc.sha256Hash ? (
                <Check className="w-3.5 h-3.5 text-[var(--accent-positive)]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#52525B] group-hover/copy:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif text-[26px] md:text-[32px] font-black text-[#F5F5F7] mb-8 leading-[1.1] hover:underline cursor-pointer">
          {doc.title}
        </h3>

        {/* Excerpt */}
        <div className="pl-6 border-l-[3px] border-[#FBBF24] mb-8">
          <p className="text-[18px] md:text-[20px] text-[#E4E4E7] font-serif italic leading-[1.6]">
            "{doc.excerpt}"
          </p>
        </div>
        
        {/* Supports Row */}
        <div className="pt-4 border-t border-[rgba(255,255,255,0.05)] flex items-center flex-wrap gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] mr-1">
            Supports:
          </span>
          {doc.supports.map((item: { href: string; type: string; label: string }, idx: number) => (
            <Link 
              key={idx} 
              href={item.href}
              className="inline-flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors rounded-[12px] px-3 py-1.5 text-[11px] font-medium text-white"
            >
              {item.type === 'promise' ? <FileText className="w-3 h-3 text-[#A1A1AA]" /> : <User className="w-3 h-3 text-[#A1A1AA]" />}
              {item.label}
              <ChevronRight className="w-3 h-3 ml-0.5 text-[#52525B]" />
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Row */}
      <div className="bg-[rgba(255,255,255,0.02)] border-t border-[rgba(255,255,255,0.05)] px-[32px] md:px-[48px] py-[24px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] mb-1">Source</div>
          <div className="text-[13px] font-bold text-[#F5F5F7] uppercase tracking-wider">{doc.source}</div>
        </div>
        <div className="flex flex-col sm:items-end">
          <div className="flex items-center gap-2 px-[12px] py-[6px] rounded-[4px]" style={{ backgroundColor: 'rgba(52,211,153,0.12)' }}>
            <Check className="w-4 h-4 text-[#34D399]" />
            <span className="text-[14px] font-bold text-[#34D399] tracking-wide mt-px">
              <span className="text-[10px] font-sans mr-2 uppercase tracking-[0.08em]">CONFIDENCE</span>
              {doc.confidenceScore}/100
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
