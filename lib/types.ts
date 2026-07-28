// ===== PROMISE STATUS SYSTEM (13 States from Methodology Doc) =====
export type PromiseStatus =
  | 'planning'
  | 'tender_issued'
  | 'construction_started'
  | 'implementation_started'
  | 'partially_completed'
  | 'mostly_completed'
  | 'completed'
  | 'operational'
  | 'delayed'
  | 'cancelled'
  | 'no_verified_progress'
  | 'insufficient_evidence'
  | 'unable_to_verify';

// ===== EVIDENCE CONFIDENCE SCORING =====
type EvidenceTier = 1 | 2 | 3 | 4 | 5;

export type ConfidenceTier = 'absolute' | 'high' | 'moderate' | 'unverified';


// ===== EVIDENCE SOURCES =====
export type EvidenceType =
  | 'gazette'
  | 'court_order'
  | 'budget_document'
  | 'tender'
  | 'cag_report'
  | 'parliament_debate'
  | 'rti_document'
  | 'completion_certificate'
  | 'academic'
  | 'news_wire'
  | 'investigative_journalism';

export interface Evidence {
  id: string;
  title: string;
  type: EvidenceType;
  source: string;
  sourceUrl?: string;
  date: string;
  excerpt: string;
  sha256Hash: string;
  confidenceScore: number;
  tier: EvidenceTier;
  tags: string[];
}

// ===== PROMISE TIMELINE EVENT =====
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'progress' | 'setback' | 'milestone' | 'neutral';
  evidenceIds: string[];
  confidenceScore: number;
}

// ===== POLITICAL PROMISE =====
export type PolicyCategory =
  | 'infrastructure'
  | 'healthcare'
  | 'education'
  | 'economy'
  | 'environment'
  | 'agriculture'
  | 'defence'
  | 'social_welfare'
  | 'governance'
  | 'foreign_policy'
  | 'technology'
  | 'housing'
  | 'employment';

export interface Promise {
  id: string;
  politicianId: string;
  partyId: string;
  title: string;
  fullStatement: string;
  manifestoExcerpt: string;
  category: PolicyCategory;
  status: PromiseStatus;
  madeDate: string; // when promise was made
  manifestoYear: number;
  deadline?: string;
  state?: string; // geographic scope
  confidenceScore: number;
  timeline: TimelineEvent[];
  evidenceIds: string[];
  tags: string[];
}

// ===== CRIMINAL CASE =====
interface CriminalCase {
  caseNumber: string;
  court: string;
  section: string;
  chargeDescription: string;
  status: 'pending' | 'acquitted' | 'convicted' | 'withdrawn' | 'quashed';
  year: number;
  severity: 'cognizable' | 'non_cognizable' | 'heinous';
}

// ===== ASSET DECLARATION =====
interface AssetDeclaration {
  year: number; // election year of affidavit
  totalAssets: number; // in rupees
  totalLiabilities: number;
  movableAssets: number;
  immovableAssets: number;
  spouseAssets: number;
  growthPercent?: number; // vs previous declaration
}

// ===== POLITICIAN =====
export interface Politician {
  id: string;
  name: string;
  nameHindi?: string;
  photoUrl: string;
  partyId: string;
  constituency: string;
  state: string;
  position: string; // e.g., "Member of Parliament", "Chief Minister"
  chamber?: 'lok_sabha' | 'rajya_sabha' | 'state_assembly';
  education: string;
  age: number;
  yearsInPolitics: number;

  // Performance metrics
  attendancePercent: number;
  questionsRaised: number;
  billsIntroduced: number;
  debatesParticipated: number;
  promisesTotal: number;
  promisesFulfilled: number;
  promisesBroken: number;
  promisesInProgress: number;

  // Disclosures
  criminalCases: CriminalCase[];
  assetDeclarations: AssetDeclaration[];
  latestNetWorth: number;

  // Bio
  bio: string;
  officialEmail?: string;
  officialWebsite?: string;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
  };

  // Meta
  termsSince: number;
  verified: boolean;
  lastUpdated: string;
}

// ===== BILL =====
export type BillStatus = 'introduced' | 'in_committee' | 'passed' | 'rejected' | 'withdrawn';

export interface Bill {
  id: string;
  politicianId: string;
  title: string;
  summary: string;
  status: BillStatus;
  sponsorRole: 'primary_sponsor' | 'co_sponsor';
  introducedDate: string;
  votesFor?: number;
  votesAgainst?: number;
  votesAbstain?: number;
  officialRecordUrl?: string;
  gazetteUrl?: string;
  relatedPromiseIds: string[];
}

// ===== VOTE RECORD =====
export interface VoteRecord {
  id: string;
  politicianId: string;
  billId: string;
  billTitle: string;
  vote: 'yes' | 'no' | 'absent';
  date: string;
  partyPosition: 'yes' | 'no';
}

// ===== POLITICAL PARTY =====
export interface Party {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  ideology: string;
  founded: number;
  logoUrl?: string;
}
