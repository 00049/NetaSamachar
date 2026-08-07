import { Metadata } from 'next';
import { Database, FileText, Scale, ScrollText, Landmark } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Data Sources | Neta Samachar',
  description: 'The primary evidentiary sources that power the Neta Samachar platform.',
};

const SOURCES = [
  {
    id: 'eci',
    name: 'Election Commission of India',
    abbr: 'ECI',
    icon: Database,
    description: 'Official affidavits, financial disclosures, and manifestos submitted under oath by candidates during elections.',
    url: 'https://eci.gov.in',
  },
  {
    id: 'prs',
    name: 'PRS Legislative Research',
    abbr: 'PRS',
    icon: ScrollText,
    description: 'Independent research institute providing data on parliamentary performance, bill status, and MLA/MP attendance.',
    url: 'https://prsindia.org',
  },
  {
    id: 'lok-sabha',
    name: 'Lok Sabha & Rajya Sabha',
    abbr: 'PARL',
    icon: Landmark,
    description: 'Official Hansard records, unstarred questions, debate transcripts, and committee reports from the Parliament of India.',
    url: 'https://sansad.in',
  },
  {
    id: 'ecourts',
    name: 'eCourts Services',
    abbr: 'CRT',
    icon: Scale,
    description: 'Judicial records, ongoing litigation logs, final judgments, and case status from the Supreme Court, High Courts, and district courts.',
    url: 'https://ecourts.gov.in',
  },
  {
    id: 'gazette',
    name: 'The Gazette of India',
    abbr: 'GAZ',
    icon: FileText,
    description: 'Official state bulletins, financial allocations, CAG audits, and direct Right to Information (RTI) responses.',
    url: 'https://egazette.gov.in',
  },
];

export default function SourcesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[#F5F5F7] pb-32 pt-24 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-[48px] md:text-[64px] font-black text-[#F5F5F7] mb-8 leading-[1.1] tracking-tight">
          Primary Sources
        </h1>
        <p className="text-[18px] text-[#A1A1AA] leading-[1.6] max-w-2xl mb-16">
          Neta Samachar strictly relies on institutional, primary-source data to verify political claims, track legislative action, and audit public finances. We do not use derivative reporting as a baseline for truth.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SOURCES.map((source) => (
            <div key={source.id} className="bg-[var(--bg-raised)] border border-[var(--border-subtle)] p-8 rounded-sm hover:border-white/20 transition-colors flex flex-col h-full group relative overflow-hidden">
              {/* Subtle background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 bg-white/[0.04] border border-white/10 rounded-sm flex items-center justify-center text-[#e6b16a]">
                  <source.icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide">{source.name}</h2>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#8A8F98] mt-1">
                    {source.abbr}
                  </div>
                </div>
              </div>
              
              <p className="text-[#8A8F98] text-[15px] leading-[1.6] mb-8 flex-grow relative z-10">
                {source.description}
              </p>
              
              <div className="mt-auto relative z-10">
                <Link 
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[13px] font-bold text-[#e6b16a] hover:text-white transition-colors uppercase tracking-widest"
                >
                  Visit Official Source <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
