'use client';

import { Landmark, ShieldCheck, FileSignature, Scale, Database, FileText, ScrollText, Mail, Send } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[#F5F5F7] pb-32">
      
      {/* ── 1. Mission Statement ────────────────────────────────────────────────── */}
      <section className="pt-24 pb-24 px-4 sm:px-8 max-w-4xl mx-auto border-b border-[var(--border-subtle)]">
        <h1 className="font-serif text-[48px] md:text-[64px] font-black text-[#F5F5F7] mb-12 leading-[1.1] tracking-[-0.02em]">
          The Truth, Archived.
        </h1>
        
        <div className="max-w-[680px] space-y-6 text-[#A1A1AA] text-[18px] md:text-[20px] font-serif leading-[1.6]">
          <p>
            Neta Samachar was built to solve a single, structural failure in democratic accountability: the catastrophic loss of institutional memory. Political promises evaporate into the news cycle, and the evidence required to verify them is often fragmented, overwritten, or quietly memory-holed.
          </p>
          <p>
            We operate as an immutable, cryptographically-secured ledger for the Indian republic. By tracking the exact distance between public commitments and documented reality, we convert political rhetoric into mathematically auditable data. 
          </p>
          <p>
            This platform is designed for investigative journalists, policy researchers, and citizens who demand primary-source proof over partisan narrative. We do not editorialize. We index.
          </p>
        </div>
      </section>

      {/* ── 2. The Verification Manifesto ───────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto border-b border-[var(--border-subtle)]">
        <div className="text-center mb-20">
          <h2 className="font-serif text-[40px] md:text-[56px] font-black text-[#F5F5F7] mb-12 tracking-tight">
            The Verification Manifesto
          </h2>
          
          <div className="relative max-w-[680px] mx-auto">
            <div className="absolute -top-8 -left-8 text-[80px] text-white/5 font-serif leading-none select-none">
              &ldquo;
            </div>
            <p className="text-[26px] font-serif italic text-[#A1A1AA] leading-[1.5] relative z-10">
              Accountability cannot exist without memory. Memory cannot survive without cryptography. 
              We do not ask for trust; we provide the evidence required to make trust unnecessary.
            </p>
          </div>
        </div>

        {/* 4-Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[48px] items-stretch">
          {/* Pillar 1 */}
          <div className="flex flex-col">
            <div className="w-[56px] h-[56px] rounded-[8px] border border-[rgba(255,255,255,0.1)] flex items-center justify-center mb-6 bg-white/[0.02]">
              <Landmark size={28} strokeWidth={1.5} className="text-[#A1A1AA]" />
            </div>
            <h3 className="text-[19px] font-semibold text-white mb-3">Primary Source Only</h3>
            <p className="text-[14.5px] leading-[1.6] text-[#8A8F98] max-w-[260px]">
              Every claim is traced directly to official government gazettes, court orders, RTI responses, or tier-1 wire agencies. We strictly exclude derivative reporting, opinion columns, and political press releases from our evidence baseline to prevent narrative laundering.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="flex flex-col">
            <div className="w-[56px] h-[56px] rounded-[8px] border border-[rgba(255,255,255,0.1)] flex items-center justify-center mb-6 bg-white/[0.02]">
              <ShieldCheck size={28} strokeWidth={1.5} className="text-[#A1A1AA]" />
            </div>
            <h3 className="text-[19px] font-semibold text-white mb-3">SHA-256 Verified</h3>
            <p className="text-[14.5px] leading-[1.6] text-[#8A8F98] max-w-[260px]">
              Upon ingestion, a SHA-256 cryptographic hash is generated for every document. This acts as an immutable digital fingerprint. If a source attempts to alter or silently delete a public record post-facto, our mathematical baseline detects the tampering immediately.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="flex flex-col">
            <div className="w-[56px] h-[56px] rounded-[8px] border border-[rgba(255,255,255,0.1)] flex items-center justify-center mb-6 bg-white/[0.02]">
              <FileSignature size={28} strokeWidth={1.5} className="text-[#A1A1AA]" />
            </div>
            <h3 className="text-[19px] font-semibold text-white mb-3">Immutable Audit Trail</h3>
            <p className="text-[14.5px] leading-[1.6] text-[#8A8F98] max-w-[260px]">
              We maintain a rigorous chronological ledger for every promise. Timelines log exact dates of capital allocation, project delays, and bureaucratic roadblocks. Status downgrades are permanent parts of the record, preventing officials from resetting expectations.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="flex flex-col">
            <div className="w-[56px] h-[56px] rounded-[8px] border border-[rgba(255,255,255,0.1)] flex items-center justify-center mb-6 bg-white/[0.02]">
              <Scale size={28} strokeWidth={1.5} className="text-[#A1A1AA]" />
            </div>
            <h3 className="text-[19px] font-semibold text-white mb-3">Non-Partisan</h3>
            <p className="text-[14.5px] leading-[1.6] text-[#8A8F98] max-w-[260px]">
              Our platform architecture forbids party-specific color coding or emotional design patterns. We rely purely on semantic signals (verified, pending, overdue) computed objectively against target dates and primary evidence, enforcing equal scrutiny across the entire political spectrum.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. Data Sources List ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 max-w-4xl mx-auto border-b border-[var(--border-subtle)]">
        <h2 className="font-serif text-[32px] md:text-[40px] font-bold text-[#F5F5F7] mb-12">
          Ingestion Architecture
        </h2>
        
        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-[4px] p-8 md:p-12">
          <p className="text-[#A1A1AA] text-[16px] leading-[1.6] mb-8">
            Neta Samachar programmatically indexes and permanently archives documents from the following critical infrastructure nodes. These constitute our Tier 1 evidentiary baseline.
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4 pb-6 border-b border-[rgba(255,255,255,0.05)]">
              <div className="w-[40px] h-[40px] bg-white/[0.04] rounded-[4px] flex items-center justify-center flex-shrink-0 mt-1">
                <Database className="w-5 h-5 text-[#A1A1AA]" />
              </div>
              <div>
                <h4 className="text-[16px] font-bold text-white mb-1 tracking-wide">Election Commission of India (ECI)</h4>
                <p className="text-[14px] text-[#8A8F98]">Affidavits, financial disclosures, and official manifestos submitted under legal oath.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-6 border-b border-[rgba(255,255,255,0.05)]">
              <div className="w-[40px] h-[40px] bg-white/[0.04] rounded-[4px] flex items-center justify-center flex-shrink-0 mt-1">
                <ScrollText className="w-5 h-5 text-[#A1A1AA]" />
              </div>
              <div>
                <h4 className="text-[16px] font-bold text-white mb-1 tracking-wide">Parliamentary & Legislative Archives</h4>
                <p className="text-[14px] text-[#8A8F98]">Hansard records, unstarred questions, committee reports, and floor speeches.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-6 border-b border-[rgba(255,255,255,0.05)]">
              <div className="w-[40px] h-[40px] bg-white/[0.04] rounded-[4px] flex items-center justify-center flex-shrink-0 mt-1">
                <Scale className="w-5 h-5 text-[#A1A1AA]" />
              </div>
              <div>
                <h4 className="text-[16px] font-bold text-white mb-1 tracking-wide">Judicial Record Systems</h4>
                <p className="text-[14px] text-[#8A8F98]">Supreme Court, High Court directives, ongoing litigation logs, and final judgements.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-[40px] h-[40px] bg-white/[0.04] rounded-[4px] flex items-center justify-center flex-shrink-0 mt-1">
                <FileText className="w-5 h-5 text-[#A1A1AA]" />
              </div>
              <div>
                <h4 className="text-[16px] font-bold text-white mb-1 tracking-wide">State & Central Gazettes (RTI)</h4>
                <p className="text-[14px] text-[#8A8F98]">Official state bulletins, financial allocations, CAG audits, and direct Right to Information responses.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 & 5. Organization & Compliance ────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 max-w-4xl mx-auto border-b border-[var(--border-subtle)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          <div>
            <h2 className="font-serif text-[28px] font-bold text-[#F5F5F7] mb-6">
              Maintenance & Independence
            </h2>
            <p className="text-[#A1A1AA] text-[15px] leading-[1.6] mb-6">
              Neta Samachar is maintained by an independent, unaffiliated collective of data scientists, civic technologists, and archival researchers. 
            </p>
            <p className="text-[#A1A1AA] text-[15px] leading-[1.6]">
              We operate strictly outside of state funding, political action committees, or corporate media conglomerates. Our infrastructure is open-source and our methodologies are transparent, ensuring that the platform remains immune to external political pressure.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-[28px] font-bold text-[#F5F5F7] mb-6">
              Compliance Frameworks
            </h2>
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center bg-white/[0.06] px-2.5 py-1 rounded-[4px] mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-white">GODL Framework</span>
                </div>
                <p className="text-[#A1A1AA] text-[14px] leading-[1.6]">
                  Adheres to the Government Open Data License (India), strictly utilizing public sector data explicitly mandated for open civic reuse, ensuring all ingested data is legally sourced.
                </p>
              </div>
              <div>
                <div className="inline-flex items-center bg-white/[0.06] px-2.5 py-1 rounded-[4px] mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-white">BSA 2023 Compliant</span>
                </div>
                <p className="text-[#A1A1AA] text-[14px] leading-[1.6]">
                  Data retention and cryptographic hashing protocols comply with evidentiary standards under the Bharatiya Sakshya Adhiniyam 2023 for electronic records.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 6. Contact & Corrections ────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-[4px] p-8 md:p-12 text-center max-w-2xl mx-auto">
          <Mail className="w-8 h-8 text-[#A1A1AA] mx-auto mb-6" />
          <h2 className="font-serif text-[32px] font-bold text-[#F5F5F7] mb-4">
            Disputes & Corrections
          </h2>
          <p className="text-[#A1A1AA] text-[16px] leading-[1.6] mb-8">
            We are committed to absolute accuracy. If you represent a public office and wish to contest a record, or if you are a researcher with primary evidence contradicting our database, submit an evidentiary review request.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="h-[48px] px-8 bg-white text-[#090B12] text-[13px] font-bold uppercase tracking-widest flex items-center justify-center transition-all hover:bg-[#E4E4E7] rounded-[4px] w-full sm:w-auto">
              Submit Evidence
              <Send className="w-4 h-4 ml-2" />
            </button>
            <Link 
              href="mailto:press@netasamachar.in" 
              className="h-[48px] px-8 border border-[rgba(255,255,255,0.2)] text-white text-[13px] font-bold uppercase tracking-widest flex items-center justify-center transition-all hover:bg-white/5 rounded-[4px] w-full sm:w-auto"
            >
              Press Inquiries
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
