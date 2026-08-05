'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, User, Flag, Search, Scale, Archive, LineChart } from 'lucide-react';
import Image from 'next/image';

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
export function HomeClient({ stats }: { stats?: any }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10]">
      {/* ═══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex flex-col justify-center px-6 md:px-10 xl:px-20 overflow-hidden pt-[80px]">
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
          className="relative z-10 w-full mx-auto"
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
            <motion.div variants={heroItem} className="flex flex-col gap-[20px] w-full max-w-[840px]">
              <form 
                onSubmit={handleSearch}
                className="relative flex items-center w-full h-[88px] bg-[#0f131a]/80 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full px-8 focus-within:border-[#e6b16a]/50 focus-within:bg-[#0f131a] transition-all duration-300 shadow-2xl"
              >
                <Search className="w-[28px] h-[28px] text-white/40 flex-shrink-0 ml-2" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search politicians, constituencies, parties, elections, bills, or issues..."
                  className="w-full bg-transparent text-[22px] text-white placeholder-white/40 focus:outline-none ml-6"
                />
                <button type="submit" className="w-[64px] h-[64px] rounded-full bg-[#e6b16a] flex items-center justify-center hover:bg-[#e6b16a]/90 transition-colors flex-shrink-0 text-black ml-4 group shadow-lg">
                  <ArrowRight className="w-[28px] h-[28px] group-hover:translate-x-1.5 transition-transform" />
                </button>
              </form>
              
              <div className="flex items-center flex-wrap gap-x-5 gap-y-2 text-[15px] ml-8">
                <span className="text-white/40">Trending:</span>
                {['Tejashwi Yadav', 'Prashant Kishor', 'Nishant Kumar', 'Shambhuraj Desai', 'Rajesh Kumar', 'Keshab Mahanta'].map((name) => (
                  <Link key={name} href="#" className="text-white/60 hover:text-[#e6b16a] hover:underline transition-colors">
                    {name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURE CARDS
      ══════════════════════════════════════════════════════ */}
      <section className="relative z-10 w-full mx-auto px-6 md:px-10 xl:px-20 pb-20 -mt-12">
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
                className="h-full flex flex-col bg-[#0f1218] border border-white/[0.04] rounded-2xl p-7 hover:border-[#e6b16a]/30 hover:bg-[#12161d] hover:shadow-[0_8px_30px_rgba(230,177,106,0.04)] transition-all duration-300"
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
        <div className="w-full mx-auto px-6 md:px-10 xl:px-20 py-8 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex flex-col text-center lg:text-left">
            <span className="text-white/40 text-[11px] uppercase tracking-[0.1em] font-medium mb-1">TRUSTED SOURCES.</span>
            <span className="text-white/80 text-[12px] uppercase tracking-[0.1em] font-bold">ZERO COMPROMISES.</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-12 gap-y-6 text-white/50 text-[13px] font-medium grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center opacity-80 mix-blend-screen">
                <Image src="/favicon.ico" alt="Gov" width={24} height={24} className="opacity-50" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] leading-tight">भारत सरकार</span>
                <span className="text-[10px] leading-tight font-semibold tracking-wide">GOVERNMENT OF INDIA</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center opacity-80 mix-blend-screen">
                <Image src="/favicon.ico" alt="ECI" width={24} height={24} className="opacity-50" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] leading-tight font-semibold tracking-wide">ELECTION COMMISSION</span>
                <span className="text-[9px] leading-tight">OF INDIA</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center font-serif text-[18px] font-bold opacity-80">prs</div>
              <div className="flex flex-col">
                <span className="text-[10px] leading-tight font-semibold tracking-wide">PRS LEGISLATIVE</span>
                <span className="text-[9px] leading-tight">RESEARCH</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center font-serif text-[18px] font-bold opacity-80">⚖️</div>
              <div className="flex flex-col">
                <span className="text-[10px] leading-tight font-semibold tracking-wide">eCOURTS</span>
                <span className="text-[9px] leading-tight">SERVICES</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center opacity-80 mix-blend-screen">
                <Image src="/favicon.ico" alt="Lok Sabha" width={24} height={24} className="opacity-50" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] leading-tight">लोक सभा</span>
                <span className="text-[10px] leading-tight font-semibold tracking-wide">LOK SABHA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
