'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { POLITICIANS } from '@/data/politicians';
import { PROMISES, EVIDENCE } from '@/data/promises';
import { PromiseCard } from '@/components/promises/PromiseCard';
import { PoliticianCard } from '@/components/politicians/PoliticianCard';
import { CommandPaletteUI } from '@/components/home/CommandPaletteUI';
import { EvidenceSpotlight } from '@/components/home/EvidenceSpotlight';
import { BrowseByDimension } from '@/components/home/BrowseByDimension';
import { StaggeredRevealGrid, ScrollReveal } from '@/components/ui/ScrollReveal';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { ArrowRight, ShieldCheck, Search, Scale, FileSignature, Landmark } from 'lucide-react';

const featuredPromises   = PROMISES.slice(0, 3);
const featuredPoliticians = POLITICIANS.slice(0, 4);

const section: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const stagger: Variants = {
  hidden: {},
  // 70ms between children — caps simultaneous animating DOM elements
  // to avoid a wave of 12 cards all firing in the same frame
  show: { transition: { staggerChildren: 0.07 } },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

const heroContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const STATS = [
  { label: 'Promises Tracked',   value: 4219, color: 'var(--text-primary)' },
  { label: 'Evidence Documents', value: 12847, color: 'var(--text-primary)' },
  { label: 'Verified Complete',  value: 28, suffix: '%', color: 'var(--accent-positive)' },
  { label: 'Pending Scrutiny',   value: 184, color: 'var(--accent-warning)' },
];

const CREDIBILITY = [
  {
    icon: <Landmark size={28} strokeWidth={1.5} color="var(--text-secondary)" />,
    title: 'Primary Source Dependency',
    desc:  'Every claim is traced directly to official government gazettes, court orders, or tier-1 wire agencies. No derivative reporting is admitted without corroboration.',
  },
  {
    icon: <ShieldCheck size={28} strokeWidth={1.5} color="var(--text-secondary)" />,
    title: 'Cryptographic Hashing',
    desc:  'SHA-256 fingerprints applied to all ingested documents to detect and prove post-facto tampering. Every document is immutable.',
  },
  {
    icon: <FileSignature size={28} strokeWidth={1.5} color="var(--text-secondary)" />,
    title: 'Immutable Audit Trail',
    desc:  'Errors are logged publicly. Version history is never silently rewritten or deleted. Every correction is timestamped.',
  },
  {
    icon: <Scale size={28} strokeWidth={1.5} color="#A1A1AA" />,
    title: 'Non-Partisan Metrics',
    desc:  'Identical evidentiary standards applied uniformly across all political entities without qualitative bias or editorial interpretation.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">

      {/* ═══════════════════════════════════════════════════
          HERO (80vh)
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[640px] flex flex-col justify-center px-6 md:px-10 xl:px-20 overflow-hidden bg-section-gradient py-24">
        <motion.div 
          className="relative z-10 max-w-[1440px] mx-auto w-full"
          variants={heroContainer}
          initial="hidden"
          animate="show"
        >
          <div className="max-w-[920px]">
            {/* Eyebrow */}
            <motion.div variants={heroItem} className="flex items-center gap-4 text-[var(--text-secondary)] text-[13px] uppercase font-medium tracking-[0.12em] mb-6">
              <div className="w-6 h-[1px] bg-[var(--text-secondary)]" />
              INDIA'S POLITICAL ACCOUNTABILITY ARCHIVE
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={heroItem} className="font-serif text-[var(--text-primary)] tracking-tight mb-5 text-[40px] md:text-[56px] xl:text-[72px] leading-[1]">
              The Truth, <span className="italic text-white">Archived.</span>
            </motion.h1>

            {/* Body */}
            <motion.p variants={heroItem} className="text-[var(--text-secondary)] text-[18px] leading-[1.6] max-w-[640px] mb-2">
              12,847 verified documents tracking 4,219 political promises. <Link href="/promises" className="text-[var(--text-primary)] hover:underline ml-1">Browse full database &rarr;</Link>
            </motion.p>

            {/* Coverage Transparency */}
            <motion.div variants={heroItem} className="text-[#71717A] text-[13px] mb-8">
              {(() => {
                const activeStates = Array.from(new Set(POLITICIANS.map(p => p.state)));
                if (activeStates.length === 1) {
                  return `Currently tracking ${activeStates[0]} in full depth, expanding nationwide.`;
                }
                return `Currently tracking ${activeStates.length} states in full depth, expanding nationwide.`;
              })()}
            </motion.div>

            {/* CTA Row & Search Input Container */}
            <motion.div variants={heroItem} className="flex flex-col gap-[12px] w-full max-w-[920px]">
              {/* Search */}
              <CommandPaletteUI />
              
              {/* Dimensions Filter */}
              <BrowseByDimension />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PLATFORM METRICS
      ══════════════════════════════════════════════════════ */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-20 py-32 lg:py-40"
      >
        <motion.div variants={section} className="mb-14">
          <div className="section-label">Platform Coverage</div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/8 border border-white/8">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              variants={section}
              className="px-[32px] py-[40px] bg-[var(--bg-base)]"
            >
              <div className="text-[12px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-3">
                {stat.label}
              </div>
              <div 
                className="text-[56px] font-semibold leading-none"
                style={{ color: stat.color, fontVariantNumeric: 'tabular-nums' }}
              >
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          TRENDING INVESTIGATIONS (bg-section-subtle)
      ══════════════════════════════════════════════════════ */}
      <section className="bg-section-subtle">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-20 py-32 lg:py-40"
        >
          <motion.div
            variants={section}
            className="flex items-end justify-between mb-16"
          >
            <div>
              <div className="section-label">Active Monitoring</div>
              <h2 className="font-serif font-black text-[var(--text-primary)] text-4xl lg:text-5xl tracking-tight">
                Trending Investigations
              </h2>
            </div>
            <Link href="/promises" className="btn-ghost hidden sm:flex items-center gap-1 text-sm">
              View All Investigations <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>

          {/* Promise cards — IntersectionObserver-based, staggered 70ms apart */}
          <StaggeredRevealGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPromises.map((promise, i) => (
              <ScrollReveal key={promise.id} staggerIndex={i}>
                <PromiseCard promise={promise} viewMode="compact" />
              </ScrollReveal>
            ))}
          </StaggeredRevealGrid>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED POLITICIANS
      ══════════════════════════════════════════════════════ */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-20 py-32 lg:py-40"
      >
        <motion.div variants={section} className="flex items-end justify-between mb-16">
          <div>
            <div className="section-label">Dossier Directory</div>
            <h2 className="font-serif font-black text-[var(--text-primary)] text-4xl lg:text-5xl tracking-tight">
              Under Scrutiny
            </h2>
          </div>
          <Link href="/politicians" className="btn-ghost hidden sm:flex items-center gap-1 text-sm">
            Full Directory <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </motion.div>

        {/* Politician cards — staggered IntersectionObserver reveals */}
        <StaggeredRevealGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredPoliticians.map((pol, i) => (
            <ScrollReveal key={pol.id} staggerIndex={i}>
              <PoliticianCard politician={pol} viewMode="compact" />
            </ScrollReveal>
          ))}
        </StaggeredRevealGrid>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          EVIDENCE SPOTLIGHT (bg-section-subtle)
      ══════════════════════════════════════════════════════ */}
      <section className="bg-section-subtle">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-20 py-32 lg:py-40"
        >
          <motion.div variants={section}>
            <div className="section-label mb-16">Evidence Spotlight</div>
            <EvidenceSpotlight evidence={EVIDENCE[0]} />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          INLINE TRUST STRIP
      ══════════════════════════════════════════════════════ */}
      <Link href="/methodology" className="block w-full bg-[var(--bg-card)] border-y border-[var(--border-subtle)] py-[24px] px-[24px] md:px-[80px] hover:bg-white/[0.04] transition-colors duration-200">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-center gap-4 md:gap-8 text-[13px] uppercase font-medium text-[var(--text-secondary)] tracking-[0.1em]">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[20px]">🏛</span> PRIMARY SOURCE ONLY
          </div>
          <div className="hidden md:block w-[1px] h-[16px] bg-white/10" />
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[20px]">🛡</span> SHA-256 VERIFIED
          </div>
          <div className="hidden lg:block w-[1px] h-[16px] bg-white/10" />
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[20px]">📝</span> IMMUTABLE AUDIT TRAIL
          </div>
          <div className="hidden md:block w-[1px] h-[16px] bg-white/10" />
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[20px]">⚖</span> NON-PARTISAN
          </div>
        </div>
      </Link>



    </div>
  );
}
