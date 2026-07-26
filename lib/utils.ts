import { PromiseStatus, ConfidenceTier, PolicyCategory, EvidenceType } from './types';

// ===== STATUS CONFIGURATION =====
export const STATUS_CONFIG: Record<PromiseStatus, {
  label: string;
  colorClass: string;
  icon: string;
  description: string;
}> = {
  planning: {
    label: 'Planning Stage',
    colorClass: 'text-[var(--accent-info)] border-[var(--accent-info)]',
    icon: '📋',
    description: 'Promise recognized, formally incorporated into bureaucratic workflow',
  },
  tender_issued: {
    label: 'Tender Issued',
    colorClass: 'text-[var(--accent-info)] border-[var(--accent-info)]',
    icon: '📄',
    description: 'Formal procurement process initiated on CPPP or equivalent portal',
  },
  construction_started: {
    label: 'Construction Started',
    colorClass: 'text-[var(--accent-info)] border-[var(--accent-info)]',
    icon: '🏗️',
    description: 'Physical or logistical execution has commenced on the ground',
  },
  implementation_started: {
    label: 'Implementation Started',
    colorClass: 'text-[var(--accent-info)] border-[var(--accent-info)]',
    icon: '🚀',
    description: 'Non-infrastructure policy execution has begun',
  },
  partially_completed: {
    label: 'Partially Completed',
    colorClass: 'text-[var(--accent-warning)] border-[var(--accent-warning)]',
    icon: '⏳',
    description: 'Surpassed 25% completion threshold, delivering initial utility',
  },
  mostly_completed: {
    label: 'Mostly Completed',
    colorClass: 'text-[var(--accent-positive)] border-[var(--accent-positive)]',
    icon: '🔄',
    description: 'Core objectives achieved, surpassing 75% completion',
  },
  completed: {
    label: 'Completed',
    colorClass: 'text-[var(--accent-positive)] border-[var(--accent-positive)]',
    icon: '✅',
    description: 'Physical infrastructure or policy objective finished per specifications',
  },
  operational: {
    label: 'Operational',
    colorClass: 'text-[var(--accent-positive)] border-[var(--accent-positive)]',
    icon: '🟢',
    description: 'Structurally complete AND actively functioning, staffed, delivering utility',
  },
  delayed: {
    label: 'Delayed',
    colorClass: 'text-[var(--accent-warning)] border-[var(--accent-warning)]',
    icon: '⚠️',
    description: 'Project has missed official deadline from tender or manifesto',
  },
  cancelled: {
    label: 'Cancelled',
    colorClass: 'text-[var(--accent-negative)] border-[var(--accent-negative)]',
    icon: '❌',
    description: 'Government formally abandoned the promise or rescinded the project',
  },
  no_verified_progress: {
    label: 'No Verified Progress',
    colorClass: 'text-[var(--accent-negative)] border-[var(--accent-negative)]',
    icon: '🔇',
    description: 'One fiscal year passed with no executive, legislative, or financial action',
  },
  insufficient_evidence: {
    label: 'Insufficient Evidence',
    colorClass: 'text-[var(--text-tertiary)] border-[var(--border-subtle)]',
    icon: '🔍',
    description: 'Claims exist but fail to meet confidence scoring thresholds',
  },
  unable_to_verify: {
    label: 'Unable to Verify',
    colorClass: 'text-[var(--text-tertiary)] border-[var(--border-subtle)]',
    icon: '❓',
    description: 'Promise is too vague, subjective, or classified for empirical verification',
  },
};

// ===== CONFIDENCE TIER CONFIGURATION =====
export const CONFIDENCE_CONFIG: Record<ConfidenceTier, {
  label: string;
  range: string;
  colorClass: string;
  description: string;
}> = {
  absolute: {
    label: 'Absolute Confidence',
    range: '90–100',
    colorClass: 'text-[var(--accent-positive)]',
    description: 'Cryptographic primary evidence — digitally signed court orders or real-time API data',
  },
  high: {
    label: 'High Confidence',
    range: '70–89',
    colorClass: 'text-[var(--accent-info)]',
    description: 'Peer-reviewed academic consensus, CAG audits, or multiple Tier 2 wire agencies',
  },
  moderate: {
    label: 'Moderate Confidence',
    range: '50–69',
    colorClass: 'text-[var(--accent-warning)]',
    description: 'Tier 3 journalistic investigations or older RTI disclosures',
  },
  unverified: {
    label: 'Unverified',
    range: '<50',
    colorClass: 'text-[var(--accent-negative)]',
    description: 'Fails to meet epistemological confidence scoring thresholds',
  },
};

export const EVIDENCE_TYPE_CONFIG: Record<EvidenceType, { label: string; icon: string; tier: number }> = {
  gazette: { label: 'Government Gazette', icon: '📰', tier: 1 },
  court_order: { label: 'Court Order', icon: '⚖️', tier: 1 },
  budget_document: { label: 'Budget Document', icon: '💰', tier: 1 },
  tender: { label: 'Procurement Tender', icon: '🏛️', tier: 1 },
  cag_report: { label: 'CAG Audit Report', icon: '🔍', tier: 1 },
  parliament_debate: { label: 'Parliament Debate', icon: '🗣️', tier: 1 },
  rti_document: { label: 'RTI Response', icon: '📋', tier: 2 },
  completion_certificate: { label: 'Completion Certificate', icon: '✅', tier: 1 },
  academic: { label: 'Academic Research', icon: '🎓', tier: 1 },
  news_wire: { label: 'Wire Service Report', icon: '📡', tier: 2 },
  investigative_journalism: { label: 'Investigative Journalism', icon: '🗞️', tier: 3 },
};

export const POLICY_CATEGORIES: Record<PolicyCategory, { label: string; icon: string }> = {
  infrastructure: { label: 'Infrastructure', icon: '🏗️' },
  healthcare: { label: 'Healthcare', icon: '🏥' },
  education: { label: 'Education', icon: '📚' },
  economy: { label: 'Economy', icon: '📈' },
  environment: { label: 'Environment', icon: '🌿' },
  agriculture: { label: 'Agriculture', icon: '🌾' },
  defence: { label: 'Defence', icon: '🛡️' },
  social_welfare: { label: 'Social Welfare', icon: '🤝' },
  governance: { label: 'Governance', icon: '⚖️' },
  foreign_policy: { label: 'Foreign Policy', icon: '🌐' },
  technology: { label: 'Technology', icon: '💻' },
  housing: { label: 'Housing', icon: '🏠' },
  employment: { label: 'Employment', icon: '💼' },
};

export function getConfidenceTier(score: number): ConfidenceTier {
  if (score >= 90) return 'absolute';
  if (score >= 70) return 'high';
  if (score >= 50) return 'moderate';
  return 'unverified';
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function getPromiseFulfillmentRate(fulfilled: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((fulfilled / total) * 100);
}
