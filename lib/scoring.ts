import { Politician } from './types';

// ===== SCORE TIERS =====
type ScoreTier = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface OverallScore {
  value: number;         // 0-100
  tier: ScoreTier;       // good / mixed / poor
  label: string;         // GOOD / MIXED / POOR
  color: string;         // CSS variable reference
  hexColor: string;      // Hex for SVG stroke
}

export interface QuickLookData {
  score: OverallScore;
  verdictEn: string;
  verdictHi: string;
  promisesKept: number;
  promisesTotal: number;
  legalCases: number;
  netWorthCr: string;
  billsIntroduced: number;
  billsPassed: number;
  attendancePercent: number;
}

// ===== SCORING ALGORITHM =====
export function computeOverallScore(
  politician: Politician
): OverallScore {
  const total = politician.promisesTotal;
  const fulfilled = politician.promisesFulfilled;
  const fulfillmentScore = total > 0 ? (fulfilled / total) * 100 : 50;

  const attendanceScore = politician.attendancePercent;

  const cases = politician.criminalCases.length;
  const legalScore = Math.max(0, 100 - cases * 25);

  // Weighted composite: 40% promises, 30% attendance, 30% legal
  const composite = Math.round(
    fulfillmentScore * 0.4 +
    attendanceScore * 0.3 +
    legalScore * 0.3
  );

  let tier: ScoreTier;
  let label: string;
  let color: string;
  let hexColor: string;

  if (composite > 66) {
    tier = 'A';
    label = 'GOOD';
    color = 'var(--accent-positive)';
    hexColor = '#34D399';
  } else if (composite >= 34) {
    tier = 'C';
    label = 'MIXED';
    color = 'var(--accent-warning)';
    hexColor = '#FBBF24';
  } else {
    tier = 'F';
    label = 'POOR';
    color = 'var(--accent-negative)';
    hexColor = '#F87171';
  }

  return { value: composite, tier, label, color, hexColor };
}

// ===== VERDICT SENTENCE GENERATION =====
// Template-based, grade-school reading level. No AI inference.
export function generateVerdictEn(
  politician: Politician
): string {
  const kept = politician.promisesFulfilled;
  const total = politician.promisesTotal;
  const cases = politician.criminalCases.length;
  const attendance = politician.attendancePercent;

  const promisePart =
    total === 0
      ? 'No promises tracked yet.'
      : kept === total
      ? `Kept all ${total} promises.`
      : kept === 0
      ? `Kept none of the ${total} tracked promises.`
      : `Kept ${kept} out of ${total} promises.`;

  const legalPart =
    cases === 0
      ? 'No criminal cases pending.'
      : cases === 1
      ? '1 criminal case is pending.'
      : `${cases} criminal cases are pending.`;

  const attendancePart =
    attendance >= 90
      ? `Shows up ${attendance}% of the time.`
      : attendance >= 70
      ? ''
      : `Attendance is only ${attendance}%.`;

  const parts = [promisePart, legalPart, attendancePart].filter(Boolean);
  return parts.slice(0, 2).join(' '); // Keep it to ~20 words max
}

export function generateVerdictHi(politician: Politician): string {
  const kept = politician.promisesFulfilled;
  const total = politician.promisesTotal;
  const cases = politician.criminalCases.length;

  const promisePart =
    total === 0
      ? 'अभी तक कोई वादा ट्रैक नहीं किया गया।'
      : kept === total
      ? `${total} में से सभी वादे पूरे किए।`
      : kept === 0
      ? `${total} में से एक भी वादा पूरा नहीं हुआ।`
      : `${total} में से ${kept} वादे पूरे किए।`;

  const legalPart =
    cases === 0
      ? 'कोई आपराधिक मामला लंबित नहीं।'
      : cases === 1
      ? '1 आपराधिक मामला लंबित है।'
      : `${cases} आपराधिक मामले लंबित हैं।`;

  return `${promisePart} ${legalPart}`;
}
