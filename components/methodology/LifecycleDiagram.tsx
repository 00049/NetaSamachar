'use client';

import { motion } from 'framer-motion';
import { ArrowDown, CheckCircle2, GitMerge } from 'lucide-react';
import clsx from 'clsx';
import { STATUS_CONFIG } from '@/lib/utils';
import { PromiseStatus } from '@/lib/types';

const phases = [
  {
    name: 'Announcement Phase',
    states: ['planning'] as PromiseStatus[]
  },
  {
    name: 'Execution Phase',
    states: ['tender_issued', 'construction_started', 'implementation_started'] as PromiseStatus[]
  },
  {
    name: 'Progress Phase',
    states: ['partially_completed', 'mostly_completed'] as PromiseStatus[]
  },
  {
    name: 'Resolution Phase',
    states: ['completed', 'operational', 'delayed', 'cancelled', 'no_verified_progress'] as PromiseStatus[]
  }
];

export function LifecycleDiagram() {
  return (
    <div className="py-12 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        {phases.map((phase, phaseIdx) => (
          <div key={phase.name} className="relative mb-12 last:mb-0">
            {/* Phase Header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-6 flex items-center gap-3 border-b border-[var(--border-subtle)] pb-2"
            >
              <GitMerge className="w-4 h-4 text-[var(--text-tertiary)]" />
              {phase.name}
            </motion.div>

            {/* States Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {phase.states.map((status, i) => {
                const config = STATUS_CONFIG[status];
                return (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={clsx(
                      "p-4 border border-[var(--border-subtle)] bg-[var(--bg-base)] flex items-start gap-3 shadow-sm",
                      config.colorClass.split(' ')[1]
                    )}
                  >
                    <span className="text-lg mt-0.5">{config.icon}</span>
                    <div>
                      <div className={clsx("font-bold text-[10px] uppercase tracking-widest leading-tight", config.colorClass.split(' ')[0])}>
                        {config.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Connecting Line to Next Phase */}
            {phaseIdx < phases.length - 1 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                whileInView={{ height: 48, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute -bottom-10 left-8 w-px bg-[var(--border-subtle)] flex flex-col items-center justify-end"
              >
                <ArrowDown className="w-3 h-3 text-[var(--border-subtle)] translate-y-3" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
