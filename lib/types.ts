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

export interface PlatformStats {
  promisesTracked: number;
  evidenceDocuments: number;
  verifiedComplete: number;
  pendingScrutiny: number;
}


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
  | 'investigative_journalism'
  | 'official_profile'
  | 'social_media'
  | 'news_report'
  | 'encyclopedia';

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
  type: 'progress' | 'setback' | 'milestone' | 'neutral' | string;
  evidenceIds: string[];
  confidenceScore: number;
  promise?: Promise;
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
  | 'employment'
  | 'social';

export interface Promise {
  id: string;
  politicianId: string;
  partyId: string;
  title: string;
  fullStatement: string;
  manifestoExcerpt: string;
  category: PolicyCategory | string;
  status: PromiseStatus | string;
  madeDate: string; // when promise was made
  manifestoYear: number;
  deadline?: string;
  state?: string; // geographic scope
  confidenceScore: number;
  timeline: TimelineEvent[] | any;
  evidenceIds: string[];
  tags: string[];
  politician?: Politician;
  party?: Party;
}

// ===== CRIMINAL CASE =====
export interface CriminalCase {
  id: string;
  caseNumber: string;
  court: string;
  section: string;
  chargeDescription: string;
  status: 'pending' | 'acquitted' | 'convicted' | 'withdrawn' | 'quashed' | 'active';
  year: number;
  severity: 'cognizable' | 'non_cognizable' | 'heinous' | 'high';
  politician?: Politician;
}

// ===== FINANCIAL DATA STRUCTURES =====
export interface AssetComposition {
  cash?: number;
  bankDeposits?: number;
  investments?: number;
  shares?: number;
  mutualFunds?: number;
  gold?: number;
  jewellery?: number;
  vehicles?: number;
  otherMovable?: number;
  
  agriculturalLand?: number;
  commercialProperty?: number;
  residentialProperty?: number;
  otherImmovable?: number;
}

export interface LiabilityBreakdown {
  housingLoan?: number;
  vehicleLoan?: number;
  businessLoan?: number;
  taxDues?: number;
  governmentDues?: number;
  otherLiabilities?: number;
}

export interface IncomeSource {
  salary?: number;
  agriculture?: number;
  business?: number;
  professionalIncome?: number;
  rentalIncome?: number;
  interest?: number;
  dividends?: number;
  otherSources?: number;
}

export interface PoliticalOffice {
  title: string;
  startYear: number;
  endYear?: number | 'Present';
  party?: string;
  constituency?: string;
  government?: string;
}

// ===== ASSET DECLARATION =====
export interface AssetDeclaration {
  year: number; // election year of affidavit
  electionType?: string;
  party?: string;
  constituency?: string;
  winner?: boolean;
  margin?: number;
  runnerUp?: string;
  
  totalAssets: number; // in rupees
  totalLiabilities: number;
  movableAssets: number;
  immovableAssets: number;
  spouseAssets: number;
  growthPercent?: number; // vs previous declaration
  
  declaredIncome?: number;
  assetComposition?: AssetComposition;
  liabilityBreakdown?: LiabilityBreakdown;
  incomeSources?: IncomeSource;
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
  chamber?: 'lok_sabha' | 'rajya_sabha' | 'state_assembly' | 'legislative_council';
  education: string;
  age: number;
  yearsInPolitics: number;
  careerTimeline?: PoliticalOffice[];

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
  evidenceIds?: string[];
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
  
  // Extended fields for rich UI
  type?: string; // e.g., 'Money Bill'
  isGovernmentBill?: boolean;
  legislativeSession?: string;
  house?: string;
  ministerInCharge?: string;
  language?: string;
  
  passedDate?: string;
  assentDate?: string;
  gazetteDate?: string;
  
  objectives?: { title: string; description: string }[];
  keyProvisions?: { title: string; description: string }[];
  imageUrl?: string;
  
  votesFor?: number;
  votesAgainst?: number;
  votesAbstain?: number;
  officialRecordUrl?: string;
  gazetteUrl?: string;
  relatedPromiseIds?: string[];
  
  votingRecord?: {
    aye: number;
    no: number;
    abstain: number;
    totalVotes: number;
    passed: boolean;
  } | any;
  timeline?: {
    date: string;
    title: string;
    description: string;
    status: 'completed' | 'in_progress' | 'pending' | string;
  }[] | any;
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
  isNational?: boolean;
}
