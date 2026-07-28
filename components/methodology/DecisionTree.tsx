'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronRight, RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { STATUS_CONFIG } from '@/lib/utils';
import { PromiseStatus } from '@/lib/types';

interface Node {
  id: string;
  question: string;
  options: {
    label: string;
    nextNodeId?: string;
    resultState?: PromiseStatus;
  }[];
}

const tree: Record<string, Node> = {
  root: {
    id: 'root',
    question: 'Is there a formal government record of the promise (e.g. Budget Speech, DPR)?',
    options: [
      { label: 'Yes', nextNodeId: 'procurement' },
      { label: 'No', nextNodeId: 'verified_political' }
    ]
  },
  verified_political: {
    id: 'verified_political',
    question: 'Is the promise based on a verified political speech or manifesto without government action yet?',
    options: [
      { label: 'Yes', resultState: 'planning' },
      { label: 'No', nextNodeId: 'subjective' }
    ]
  },
  subjective: {
    id: 'subjective',
    question: 'Is the promise unquantifiable or classified (e.g., "Restore national pride")?',
    options: [
      { label: 'Yes', resultState: 'unable_to_verify' },
      { label: 'No', resultState: 'insufficient_evidence' }
    ]
  },
  procurement: {
    id: 'procurement',
    question: 'Has a legally binding tender (NIT/RFP) been issued on CPPP?',
    options: [
      { label: 'Yes', nextNodeId: 'execution' },
      { label: 'No', resultState: 'planning' }
    ]
  },
  execution: {
    id: 'execution',
    question: 'Has physical execution or financial disbursement commenced?',
    options: [
      { label: 'Yes, Infrastructure', nextNodeId: 'completion_infra' },
      { label: 'Yes, Policy/Scheme', nextNodeId: 'completion_policy' },
      { label: 'No', resultState: 'tender_issued' }
    ]
  },
  completion_infra: {
    id: 'completion_infra',
    question: 'What is the current level of physical progress?',
    options: [
      { label: '< 25%', resultState: 'construction_started' },
      { label: '25% - 75%', resultState: 'partially_completed' },
      { label: '> 75%', resultState: 'mostly_completed' },
      { label: '100% (Certified)', resultState: 'completed' }
    ]
  },
  completion_policy: {
    id: 'completion_policy',
    question: 'Is the policy actively functioning and delivering utility to the public?',
    options: [
      { label: 'Yes, active and staffed', resultState: 'operational' },
      { label: 'No, just launched', resultState: 'implementation_started' }
    ]
  }
};

export function DecisionTree() {
  const [history, setHistory] = useState<string[]>(['root']);
  
  const currentNodeId = history[history.length - 1];
  const currentNode = tree[currentNodeId];
  
  const [result, setResult] = useState<PromiseStatus | null>(null);

  const handleOption = (option: Node['options'][0]) => {
    if (option.resultState) {
      setResult(option.resultState);
    } else if (option.nextNodeId) {
      setHistory([...history, option.nextNodeId]);
    }
  };

  const reset = () => {
    setHistory(['root']);
    setResult(null);
  };

  return (
    <div className="py-8">
      <div className="bg-[var(--bg-raised)] border border-[var(--border-subtle)] p-6 md:p-10 shadow-lg min-h-[320px] flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          
          {!result ? (
            <motion.div
              key={currentNodeId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto w-full text-center"
            >
              <HelpCircle className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-6" />
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-10 leading-snug">
                {currentNode.question}
              </h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {currentNode.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleOption(opt)}
                    className="w-full sm:w-auto px-6 py-3 bg-[var(--bg-base)] border border-[var(--border-subtle)] hover:border-[var(--text-primary)] transition-colors text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] flex items-center justify-center gap-2 group"
                  >
                    {opt.label}
                    <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto w-full text-center"
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-4">
                Computed State
              </div>
              
              {(() => {
                const config = STATUS_CONFIG[result];
                return (
                  <div className={clsx("p-6 border-2 border-[var(--border-subtle)] bg-[var(--bg-base)] flex flex-col items-center gap-4 mb-8", config.colorClass.split(' ')[1])}>
                    <span className="text-4xl">{config.icon}</span>
                    <div className={clsx("font-bold text-lg uppercase tracking-widest", config.colorClass.split(' ')[0])}>
                      {config.label}
                    </div>
                  </div>
                );
              })()}
              
              <button
                onClick={reset}
                className="mx-auto flex items-center gap-2 px-4 py-2 border border-[var(--border-subtle)] hover:bg-[var(--bg-base)] transition-colors text-xs font-bold uppercase tracking-widest text-[var(--text-primary)]"
              >
                <RotateCcw className="w-3 h-3" /> Start Over
              </button>
            </motion.div>
          )}

        </AnimatePresence>
        
        {/* Progress Breadcrumbs */}
        {!result && history.length > 1 && (
          <div className="absolute top-6 left-6 flex items-center gap-2 text-[10px] font-mono text-[var(--text-tertiary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-info)]" /> Step {history.length}
          </div>
        )}
      </div>
    </div>
  );
}
