'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Party } from '@/lib/types';
import { motion, useReducedMotion } from 'framer-motion';

const IDEOLOGY_TAGS: Record<string, string[]> = {
  bjp:     ['Conservative', 'Hindu nationalism'],
  inc:     ['Social democracy', 'Secularism'],
  'cpi-m': ['Communism', 'Marxist'],
  aap:     ['Anti-corruption', 'Populism'],
  jdu:     ['Socialism', 'Secularism'],
  rjd:     ['Social justice', 'Regional'],
  ss:      ['Hindutva', 'Regionalism'],
  agp:     ['Regionalism', 'Assamese'],
  jsp:     ['Anti-corruption', 'Governance'],
};

interface PartyCardProps {
  party: Party & { _count: { politicians: number } };
}

export function PartyCard({ party }: PartyCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const count    = party._count.politicians;
  const isNatl   = party.isNational;
  const tags     = IDEOLOGY_TAGS[party.id] || [];
  const abbr     = party.abbreviation.slice(0, 4);
  const glowHex  = party.color;

  return (
    <Link href={`/parties/${party.id}`} className="outline-none block h-full">
      <motion.div
        whileHover={shouldReduceMotion ? {} : {
          y: -4,
          boxShadow: [
            'inset 0 0 0 1px rgba(255,255,255,0.12)',
            `0 8px 32px ${glowHex}22`,
            '0 20px 48px rgba(0,0,0,0.28)',
            '0 1px 0 rgba(255,255,255,0.04)',
          ].join(', '),
        }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 25 }}
        className="card-elevated p-6 flex flex-col gap-5 h-full group transition-all duration-300"
      >
        {/* Top: monogram + name */}
        <div className="flex items-start gap-4">
          {/* Typographic monogram — party color coded, no placeholder "Logo" */}
          <div
            className="w-[56px] h-[56px] rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{
              backgroundColor: glowHex + '1A',
              border: `1.5px solid ${glowHex}44`,
            }}
            aria-hidden="true"
          >
            <span
              className="font-black text-[11px] text-center leading-tight px-0.5"
              style={{ color: glowHex }}
            >
              {abbr}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ color: glowHex, backgroundColor: glowHex + '18' }}
              >
                {isNatl ? 'National' : 'Regional'}
              </span>
              <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                Est.&nbsp;{party.founded}
              </span>
            </div>
            <h2 className="text-white font-bold text-[15px] leading-snug group-hover:text-[var(--color-accent-positive)] transition-colors duration-200 line-clamp-2">
              {party.name}
            </h2>
          </div>
        </div>

        {/* Ideology tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 bg-white/5 text-[var(--text-tertiary)] rounded-full border border-white/[0.08]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          {count === 0 ? (
            <div>
              <div className="text-[14px] font-bold text-[var(--text-tertiary)] leading-none pt-2">
                Not yet tracked
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mt-1.5 opacity-70">
                Coverage expanding
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[28px] font-black text-[var(--color-accent-positive)] leading-none">
                {count}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mt-0.5">
                {count === 1 ? 'Politician' : 'Politicians'} Tracked
              </div>
            </div>
          )}
          <ArrowRight
            className="w-[18px] h-[18px] text-[var(--text-tertiary)] group-hover:text-white group-hover:translate-x-1 transition-all duration-200"
            aria-hidden="true"
          />
        </div>
      </motion.div>
    </Link>
  );
}
