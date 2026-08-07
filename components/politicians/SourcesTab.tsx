'use client';

import { Politician, Evidence } from '@/lib/types';
import {
  FileText,
  Folder,
  Globe,
  Link as LinkIcon,
  Search,
  ChevronDown,
  Filter,
  ExternalLink,
  Info,
  Flag,
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export function SourcesTab({ politician, evidence = [] }: { politician: Politician, evidence?: Evidence[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!evidence || evidence.length === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border border-white/10 p-12 text-center rounded-md bg-white/[0.02]">
        <h3 className="text-white font-bold mb-2">No Sources Found</h3>
        <p className="text-[#A1A1AA] text-[13px]">There is no verifiable evidence or sources documented for {politician.name} at this time.</p>
      </div>
    );
  }

  // SVG Donut chart calculation
  let cumulativePercent = 0;
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const sourcesCount = new Set(evidence.map(e => e.source)).size;
  const docsCount = evidence.length;

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="grid grid-cols-1 gap-[24px]">
        
        {/* LEFT COLUMN: MAIN CONTENT */}
        <div className="flex flex-col gap-[24px]">
          
          {/* Top Summary Cards */}
          <div className="grid grid-cols-4 gap-[16px]">
            <div className="premium-card p-[20px] flex gap-[16px] items-center">
              <div className="w-[48px] h-[48px] shrink-0 rounded-xl bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20">
                <FileText className="w-[24px] h-[24px] text-[#10B981]" />
              </div>
              <div>
                <div className="text-[#A1A1AA] text-[12px] font-semibold mb-[2px]">Total Sources</div>
                <div className="text-white text-[24px] font-bold leading-none mb-[4px]">{sourcesCount}</div>
                <div className="text-[#A1A1AA] text-[11px]">Across all categories</div>
              </div>
            </div>
            
            <div className="premium-card p-[20px] flex gap-[16px] items-center">
              <div className="w-[48px] h-[48px] shrink-0 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/20">
                <Folder className="w-[24px] h-[24px] text-[#8B5CF6]" />
              </div>
              <div>
                <div className="text-[#A1A1AA] text-[12px] font-semibold mb-[2px]">Total Documents</div>
                <div className="text-white text-[24px] font-bold leading-none mb-[4px]">{docsCount}</div>
                <div className="text-[#A1A1AA] text-[11px]">All collected documents</div>
              </div>
            </div>

            <div className="premium-card p-[20px] flex gap-[16px] items-center">
              <div className="w-[48px] h-[48px] shrink-0 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center border border-[#F59E0B]/20">
                <Globe className="w-[24px] h-[24px] text-[#F59E0B]" />
              </div>
              <div>
                <div className="text-[#A1A1AA] text-[12px] font-semibold mb-[2px]">Official Portals</div>
                <div className="text-white text-[24px] font-bold leading-none mb-[4px]">72</div>
                <div className="text-[#A1A1AA] text-[11px]">Government & official websites</div>
              </div>
            </div>

            <div className="premium-card p-[20px] flex gap-[16px] items-center">
              <div className="w-[48px] h-[48px] shrink-0 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center border border-[#3B82F6]/20">
                <LinkIcon className="w-[24px] h-[24px] text-[#3B82F6]" />
              </div>
              <div>
                <div className="text-[#A1A1AA] text-[12px] font-semibold mb-[2px]">Last Updated</div>
                <div className="text-white text-[20px] font-bold leading-none mb-[4px]">28 Jul 2026</div>
                <div className="text-[#A1A1AA] text-[11px]">All sources up to date</div>
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="premium-card flex flex-col overflow-hidden">
            
            {/* Filters */}
            <div className="p-[20px] border-b border-white/5 flex items-center gap-[12px]">
              <div className="flex-1 relative">
                <Search className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#A1A1AA]" />
                <input 
                  type="text"
                  placeholder="Search sources..."
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg pl-[40px] pr-[16px] py-[10px] text-[14px] text-white placeholder:text-[#A1A1AA] focus:outline-none focus:border-white/20"
                />
              </div>
              
              <button className="flex items-center justify-between gap-[8px] bg-white/[0.02] border border-white/10 rounded-lg px-[16px] py-[10px] text-[13px] text-white hover:bg-white/[0.05] min-w-[140px]">
                All Categories <ChevronDown className="w-[14px] h-[14px] text-[#A1A1AA]" />
              </button>
              
              <button className="flex items-center justify-between gap-[8px] bg-white/[0.02] border border-white/10 rounded-lg px-[16px] py-[10px] text-[13px] text-white hover:bg-white/[0.05] min-w-[140px]">
                All Data Types <ChevronDown className="w-[14px] h-[14px] text-[#A1A1AA]" />
              </button>

              <button className="flex items-center justify-between gap-[8px] bg-white/[0.02] border border-white/10 rounded-lg px-[16px] py-[10px] text-[13px] text-white hover:bg-white/[0.05] min-w-[110px]">
                All Years <ChevronDown className="w-[14px] h-[14px] text-[#A1A1AA]" />
              </button>

              <button className="flex items-center gap-[6px] border border-transparent hover:bg-white/[0.05] rounded-lg px-[16px] py-[10px] text-[13px] text-white transition-colors">
                More Filters <Filter className="w-[14px] h-[14px] text-[#A1A1AA]" />
              </button>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="py-[16px] px-[20px] text-[#A1A1AA] text-[12px] font-semibold">Document Title</th>
                    <th className="py-[16px] px-[20px] text-[#A1A1AA] text-[12px] font-semibold">Source</th>
                    <th className="py-[16px] px-[20px] text-[#A1A1AA] text-[12px] font-semibold">Type</th>
                    <th className="py-[16px] px-[20px] text-[#A1A1AA] text-[12px] font-semibold">Excerpt</th>
                    <th className="py-[16px] px-[20px] text-[#A1A1AA] text-[12px] font-semibold">Date</th>
                    <th className="py-[16px] px-[20px] text-[#A1A1AA] text-[12px] font-semibold text-center">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {evidence.map((src, i) => (
                    <tr 
                      key={i} 
                      className="border-b border-white/5 hover:bg-white/[0.04] transition-colors group"
                    >
                      <td className="py-[16px] px-[20px]">
                        <div className="text-white text-[13px] font-semibold mb-[2px]">{src.title}</div>
                        <div className="flex items-center gap-[4px] text-[#10B981] text-[11px] truncate max-w-[200px]">
                          <ShieldCheck className="w-[12px] h-[12px]" /> {src.sha256Hash}
                        </div>
                      </td>
                      <td className="py-[16px] px-[20px]">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/10 text-[#A1A1AA] text-[12px]">
                          {src.source}
                        </span>
                      </td>
                      <td className="py-[16px] px-[20px] text-[#A1A1AA] text-[13px] capitalize">{src.type.replace('_', ' ')}</td>
                      <td className="py-[16px] px-[20px] text-[#A1A1AA] text-[13px] max-w-[200px] truncate" title={src.excerpt}>{src.excerpt}</td>
                      <td className="py-[16px] px-[20px] text-[#A1A1AA] text-[13px]">{new Date(src.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-[16px] px-[20px] text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                          {src.confidenceScore}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination / Footer */}
            <div className="p-[20px] flex items-center justify-between border-t border-white/5">
              <div className="text-[#A1A1AA] text-[13px]">Showing 1 to {evidence.length} of {evidence.length} sources</div>
              <div className="flex items-center gap-[4px]">
                <button className="w-[32px] h-[32px] flex items-center justify-center rounded-lg border border-white/10 text-[#A1A1AA] hover:bg-white/[0.05]">&lt;</button>
                <button className="w-[32px] h-[32px] flex items-center justify-center rounded-lg border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] font-semibold">1</button>
                <button className="w-[32px] h-[32px] flex items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/[0.05]">2</button>
                <button className="w-[32px] h-[32px] flex items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/[0.05]">3</button>
                <span className="text-[#A1A1AA] px-1">...</span>
                <button className="w-[32px] h-[32px] flex items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/[0.05]">15</button>
                <button className="w-[32px] h-[32px] flex items-center justify-center rounded-lg border border-white/10 text-[#A1A1AA] hover:bg-white/[0.05]">&gt;</button>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between px-[16px]">
            <div className="flex items-center gap-[8px] text-[#A1A1AA] text-[13px]">
              <Info className="w-[16px] h-[16px] text-[#3B82F6]" />
              We collect data only from official and public sources. If you find any incorrect information or broken link, please help us improve.
            </div>
            <button className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-lg border border-white/10 text-[#10B981] text-[13px] font-semibold hover:bg-[#10B981]/10 transition-colors">
              <Flag className="w-[14px] h-[14px]" /> Report an Issue
            </button>
          </div>
          
        </div>



      </div>
    </div>
  );
}
