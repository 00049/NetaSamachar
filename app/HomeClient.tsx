'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { User, Flag, Scale, Archive, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { SearchBar } from '@/components/shared/SearchBar';
import { PlatformStats, Politician } from '@/lib/types';
import { PoliticianCard } from '@/components/politicians/PoliticianCard';

const heroItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

const heroContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const cards = [
  {
    title: 'Politicians',
    desc: 'Explore verified profiles, performance, promises, financials and more.',
    href: '/politicians',
    icon: <User className="w-12 h-12 text-[#e6b16a]" strokeWidth={1.2} />,
  },
  {
    title: 'Parties',
    desc: 'Track parties, ideologies, manifestos, affiliations and election history.',
    href: '/parties',
    icon: <Flag className="w-12 h-12 text-[#e6b16a]" strokeWidth={1.2} />,
  },
  {
    title: 'Compare',
    desc: 'Compare politicians and parties on data that actually matters.',
    href: '/compare',
    icon: <Scale className="w-12 h-12 text-[#e6b16a]" strokeWidth={1.2} />,
  },
  {
    title: 'Archive',
    desc: 'Access historical records, election data, bills, reports and more.',
    href: '/archive',
    icon: <Archive className="w-12 h-12 text-[#e6b16a]" strokeWidth={1.2} />,
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export function HomeClient({ stats, trendingPoliticians = [] }: { stats?: PlatformStats, trendingPoliticians?: Politician[] }) {
  const router = useRouter();

  return (
    <div className="bg-[var(--bg-base)]">
      {/* ═══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col justify-center overflow-hidden pt-32 pb-12 isolate">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/reference.png"
            alt="Parliament Background"
            fill
            className="object-contain object-[right_center]"
            priority
          />
          {/* Custom horizontal gradient to fade out left side for text readability */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(90deg, rgba(5,6,10,0.98) 0%, rgba(5,6,10,0.92) 35%, rgba(5,6,10,0.72) 55%, rgba(5,6,10,0.15) 75%, transparent 100%)'
          }} />
          {/* Bottom fade into the background color */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090b10]/40 to-[#090b10]" />
        </div>

        <motion.div 
          className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 xl:px-16 transform-gpu"
          variants={heroContainer}
          initial="hidden"
          animate="show"
        >
          <div className="max-w-[720px]">
            {/* Eyebrow */}
            <motion.div variants={heroItem} className="flex items-center gap-4 text-white/50 text-[11px] uppercase font-bold tracking-[0.15em] mb-6">
              <div className="w-12 h-[1px] bg-[#e6b16a]" />
              NETA SAMACHAR
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={heroItem} className="font-serif text-white tracking-tight mb-6 text-[48px] md:text-[64px] xl:text-[84px] leading-[1.05]">
              KNOW THE <br />
              <span className="italic text-[#e6b16a]">TRUTH.</span>
            </motion.h1>

            {/* Body */}
            <motion.p variants={heroItem} className="text-white/70 text-[16px] md:text-[18px] leading-[1.6] max-w-[560px] mb-10">
              <strong className="text-white/90 font-semibold block mb-1">About Every Public Leader in India.</strong>
              Search verified records, election history, assets, criminal cases, attendance, promises, and official documents—all in one place.
            </motion.p>

            {/* Search Input Container */}
            <motion.div variants={heroItem} className="flex flex-col gap-[20px] w-full max-w-[840px] mb-8">
              <SearchBar variant="hero" placeholder="Search politicians, constituencies, parties, elections, bills, or issues..." />
            </motion.div>
            
            {/* Live Stats */}
            {stats && (
              <motion.div variants={heroItem} className="flex items-center gap-6 text-sm text-[#A1A1AA] font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{stats.promisesTracked}</span> Promises Tracked
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{stats.evidenceDocuments}</span> Verified Sources
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{stats.verifiedComplete}%</span> Complete
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{stats.pendingScrutiny}</span> Under Scrutiny
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURE CARDS
      ══════════════════════════════════════════════════════ */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 xl:px-16 pb-8">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-white text-3xl font-serif mb-3 tracking-tight">Navigate Neta Samachar</h2>
          <p className="text-white/50 text-sm md:text-base max-w-2xl">
            A comprehensive overview of what we are doing to bring accountability and transparency to Indian politics. Dive into verified data, track political promises, and compare leaders objectively.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 xl:gap-8">
          {cards.map((card, i) => (
            <Link key={card.title} href={card.href} className="group h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="h-full flex flex-col bg-[var(--color-panel)] border border-white/[0.04] rounded-2xl p-7 hover:border-[#e6b16a]/30 hover:bg-[var(--color-raised)] hover:shadow-[0_8px_30px_rgba(230,177,106,0.04)] transition-all duration-300"
              >
                <div className="mb-6">
                  {card.icon}
                </div>
                <h3 className="text-white font-semibold text-[17px] mb-3">
                  {card.title}
                </h3>
                <p className="text-white/50 text-[13px] leading-relaxed mb-6 flex-grow">
                  {card.desc}
                </p>
                <div className="mt-auto">
                  <ArrowRight className="w-5 h-5 text-[#e6b16a] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRUST STRIP
      ══════════════════════════════════════════════════════ */}
      <div className="border-t border-white/5 bg-[#05060a]/80 backdrop-blur-md relative z-10">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 xl:px-16 py-8 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex flex-col text-center lg:text-left">
            <span className="text-white/40 text-[11px] uppercase tracking-[0.1em] font-medium mb-1">TRUSTED SOURCES.</span>
            <span className="text-white/80 text-[12px] uppercase tracking-[0.1em] font-bold">ZERO COMPROMISES.</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-nowrap items-center justify-center lg:justify-end gap-6 lg:gap-12 text-white/50 text-[13px] font-medium grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-200">
            {/* Government of India */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xs bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-black tracking-tight text-white uppercase">GOI</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] leading-tight">भारत सरकार</span>
                <span className="text-[10px] leading-tight font-semibold tracking-wide">GOVERNMENT OF INDIA</span>
              </div>
            </div>

            {/* Election Commission of India */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xs bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-black tracking-tight text-white uppercase">ECI</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] leading-tight font-semibold tracking-wide">ELECTION COMMISSION</span>
                <span className="text-[9px] leading-tight">OF INDIA</span>
              </div>
            </div>

            {/* PRS Legislative Research */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xs bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-black tracking-tight text-white uppercase">PRS</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] leading-tight font-semibold tracking-wide">PRS LEGISLATIVE</span>
                <span className="text-[9px] leading-tight">RESEARCH</span>
              </div>
            </div>

            {/* eCourts */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xs bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-black tracking-tight text-white uppercase">eCT</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] leading-tight font-semibold tracking-wide">eCOURTS</span>
                <span className="text-[9px] leading-tight">SERVICES</span>
              </div>
            </div>

            {/* Lok Sabha */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xs bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-black tracking-tight text-white uppercase">LS</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] leading-tight">लोक सभा</span>
                <span className="text-[10px] leading-tight font-semibold tracking-wide">LOK SABHA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          TRENDING SECTION
      ══════════════════════════════════════════════════════ */}
      {trendingPoliticians.length > 0 && (
        <section className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 xl:px-16 py-20 border-t border-white/5">
          <div className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <h2 className="text-white text-3xl font-serif mb-3 tracking-tight">Trending Leaders</h2>
              <p className="text-white/50 text-sm md:text-base max-w-xl">
                Most recently updated and frequently viewed political figures.
              </p>
            </div>
            <Link href="/politicians" className="flex items-center gap-2 text-[#e6b16a] hover:text-white transition-colors text-sm font-semibold tracking-wider uppercase">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {trendingPoliticians.map((politician) => (
              <PoliticianCard key={politician.id} politician={politician} viewMode="grid" />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
