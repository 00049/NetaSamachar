/* eslint-disable react/no-unescaped-entities */
'use client';


import clsx from 'clsx';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ChevronDown, Scale, FileText, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

// New Interactive Components
import { EvidenceHierarchyDiagram } from '@/components/methodology/EvidenceHierarchyDiagram';
import { LifecycleDiagram } from '@/components/methodology/LifecycleDiagram';
import { ConfidenceScoreVisualisation } from '@/components/methodology/ConfidenceScoreVisualisation';
import { DecisionTree } from '@/components/methodology/DecisionTree';

export default function MethodologyPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [expandedSection, setExpandedSection] = useState<string | null>('philosophy');

  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id);
  };

  const sections = [
    { id: 'philosophy', title: 'Core Epistemology' },
    { id: 'hierarchy', title: 'Evidence Trust Hierarchy' },
    { id: 'confidence', title: 'Confidence Scoring' },
    { id: 'lifecycle', title: 'Promise Lifecycle' },
    { id: 'decision-tree', title: 'Interactive Decision Tree' },
    { id: 'legal', title: 'Legal & Compliance' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-[var(--text-primary)] origin-left z-50"
        style={{ scaleX }}
      />

      {/* Editorial Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 pt-12 pb-24 border-b border-[var(--border-subtle)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-[var(--border-subtle)]" />
            Framework Documentation
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-black text-[var(--text-primary)] mb-8 tracking-tight leading-tight">
            Institutional Fact-Checking <br/> Methodology
          </h1>
          <p className="text-xl md:text-2xl text-[var(--text-tertiary)] leading-relaxed font-serif italic max-w-3xl">
            Neta Samachar treats fact-checking as an auditable science. We synthesize frameworks from the IFCN, Duke Reporters Lab, and Transparency International to ensure absolute neutrality.
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-16 flex flex-col md:flex-row gap-16 relative">
        
        {/* Sticky TOC */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-[100px]">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-6">Contents</div>
            <nav className="space-y-4">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    const el = document.getElementById(s.id);
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 100;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                    setExpandedSection(s.id);
                  }}
                  className={clsx(
                    "block text-xs font-bold uppercase tracking-widest transition-colors text-left",
                    expandedSection === s.id ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 space-y-8 pb-32">
          
          {/* I. Philosophy */}
          <section id="philosophy" className="border border-[var(--border-subtle)] bg-[var(--bg-raised)] overflow-hidden">
            <button 
              onClick={() => toggleSection('philosophy')}
              className="w-full flex items-center justify-between p-6 bg-[var(--bg-base)] hover:bg-[var(--border-subtle)] transition-colors"
            >
              <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">I. Core Epistemology</h2>
              <ChevronDown className={clsx("w-5 h-5 text-[var(--text-tertiary)] transition-transform duration-300", expandedSection === 'philosophy' ? "rotate-180" : "")} />
            </button>
            <AnimatePresence>
              {expandedSection === 'philosophy' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-8 md:p-12 border-t border-[var(--border-subtle)]">
                    <div className="flex items-start gap-6">
                      <Scale className="w-8 h-8 text-[var(--text-tertiary)] flex-shrink-0" />
                      <div>
                        <p className="text-[var(--text-primary)] leading-relaxed text-lg font-serif mb-6">
                          <strong className="font-black">We never tell users what to believe.</strong> We present verified evidence from trusted primary sources so users can reach their own conclusions.
                        </p>
                        <p className="text-[var(--text-tertiary)] leading-relaxed">
                          No promise is ever declared "broken" or "kept" by editorial whim. We present the <em>objective evidence state</em>: "Evidence of Action Exists" or "Evidence Contradicts Promise." That final cognitive assessment belongs exclusively to the human user.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* II. Evidence Hierarchy */}
          <section id="hierarchy" className="border border-[var(--border-subtle)] bg-[var(--bg-raised)] overflow-hidden">
            <button 
              onClick={() => toggleSection('hierarchy')}
              className="w-full flex items-center justify-between p-6 bg-[var(--bg-base)] hover:bg-[var(--border-subtle)] transition-colors"
            >
              <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">II. Evidence Trust Hierarchy</h2>
              <ChevronDown className={clsx("w-5 h-5 text-[var(--text-tertiary)] transition-transform duration-300", expandedSection === 'hierarchy' ? "rotate-180" : "")} />
            </button>
            <AnimatePresence>
              {expandedSection === 'hierarchy' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-8 border-t border-[var(--border-subtle)]">
                    <p className="text-sm text-[var(--text-tertiary)] leading-relaxed mb-4">
                      Our system grades documentary evidence across 4 strict tiers. Tiers are defined strictly by institutional authority, not by editorial sentiment.
                    </p>
                    
                    {/* Animated Pyramid Diagram */}
                    <EvidenceHierarchyDiagram />

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* III. Confidence Scoring */}
          <section id="confidence" className="border border-[var(--border-subtle)] bg-[var(--bg-raised)] overflow-hidden">
            <button 
              onClick={() => toggleSection('confidence')}
              className="w-full flex items-center justify-between p-6 bg-[var(--bg-base)] hover:bg-[var(--border-subtle)] transition-colors"
            >
              <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">III. Confidence Scoring</h2>
              <ChevronDown className={clsx("w-5 h-5 text-[var(--text-tertiary)] transition-transform duration-300", expandedSection === 'confidence' ? "rotate-180" : "")} />
            </button>
            <AnimatePresence>
              {expandedSection === 'confidence' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-8 border-t border-[var(--border-subtle)]">
                    <p className="text-sm text-[var(--text-tertiary)] leading-relaxed mb-2">
                      Mathematical values derived from the trust hierarchy. A promise's overall score is the weighted average of its supporting documents.
                    </p>
                    
                    {/* Animated Score Visualisation */}
                    <ConfidenceScoreVisualisation />

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* IV. Lifecycle */}
          <section id="lifecycle" className="border border-[var(--border-subtle)] bg-[var(--bg-raised)] overflow-hidden">
            <button 
              onClick={() => toggleSection('lifecycle')}
              className="w-full flex items-center justify-between p-6 bg-[var(--bg-base)] hover:bg-[var(--border-subtle)] transition-colors"
            >
              <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">IV. 13-State Lifecycle</h2>
              <ChevronDown className={clsx("w-5 h-5 text-[var(--text-tertiary)] transition-transform duration-300", expandedSection === 'lifecycle' ? "rotate-180" : "")} />
            </button>
            <AnimatePresence>
              {expandedSection === 'lifecycle' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-8 border-t border-[var(--border-subtle)] bg-[var(--bg-base)]">
                    
                    {/* Flow Diagram */}
                    <LifecycleDiagram />

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* V. Interactive Decision Tree */}
          <section id="decision-tree" className="border border-[var(--border-subtle)] bg-[var(--bg-raised)] overflow-hidden">
            <button 
              onClick={() => toggleSection('decision-tree')}
              className="w-full flex items-center justify-between p-6 bg-[var(--bg-base)] hover:bg-[var(--border-subtle)] transition-colors"
            >
              <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">V. State Decision Simulator</h2>
              <ChevronDown className={clsx("w-5 h-5 text-[var(--text-tertiary)] transition-transform duration-300", expandedSection === 'decision-tree' ? "rotate-180" : "")} />
            </button>
            <AnimatePresence>
              {expandedSection === 'decision-tree' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-8 border-t border-[var(--border-subtle)]">
                    <p className="text-sm text-[var(--text-tertiary)] leading-relaxed mb-6">
                      Explore the rigorous, algorithm-like decision tree our analysts use to determine the exact state of a promise. Every classification is entirely deterministic.
                    </p>
                    
                    {/* Interactive Simulator */}
                    <DecisionTree />

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* VI. Legal */}
          <section id="legal" className="border border-[var(--border-subtle)] bg-[var(--bg-raised)] overflow-hidden">
            <button 
              onClick={() => toggleSection('legal')}
              className="w-full flex items-center justify-between p-6 bg-[var(--bg-base)] hover:bg-[var(--border-subtle)] transition-colors"
            >
              <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">VI. Legal & Compliance</h2>
              <ChevronDown className={clsx("w-5 h-5 text-[var(--text-tertiary)] transition-transform duration-300", expandedSection === 'legal' ? "rotate-180" : "")} />
            </button>
            <AnimatePresence>
              {expandedSection === 'legal' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-8 border-t border-[var(--border-subtle)] space-y-6">
                    <div className="flex items-start gap-4">
                      <ShieldAlert className="w-5 h-5 text-[var(--text-tertiary)] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-1">Evidence Integrity (BSA 2023)</h3>
                        <p className="text-[var(--text-tertiary)] text-sm leading-relaxed">
                          All archived documents are assigned SHA-256 hashes upon ingestion, complying with Section 63 of the Bharatiya Sakshya Adhiniyam 2023. This provides mathematical proof against retroactive tampering.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <FileText className="w-5 h-5 text-[var(--text-tertiary)] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-1">Defamation Immunity</h3>
                        <p className="text-[var(--text-tertiary)] text-sm leading-relaxed">
                          By restricting classifications to primary documents with mathematical Confidence Scores, the platform eliminates subjective editorializing, providing strong defamation immunity under the absolute defense of truth.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </div>
      </div>
    </div>
  );
}
