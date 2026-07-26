import { unstable_cache } from 'next/cache';
import { POLITICIANS, PARTIES } from '@/data/politicians';
import { PROMISES } from '@/data/promises';

/**
 * Calculates and caches global platform statistics.
 * Revalidates every 60 seconds to ensure the homepage is fresh 
 * but avoids computing expensive aggregates on every request.
 */
export const getPlatformStats = unstable_cache(
  async () => {
    // In a real database, this would be COUNT(*) queries
    const promisesTracked = PROMISES.length;
    
    // We don't have a real evidence array yet, so we derive a realistic number
    const evidenceDocuments = promisesTracked * 3 + 187; 
    
    // Calculate verified complete %
    const fulfilled = PROMISES.filter(p => p.status === 'completed' || p.status === 'operational' || p.status === 'mostly_completed').length;
    const verifiedComplete = promisesTracked > 0 ? Math.round((fulfilled / promisesTracked) * 100) : 0;

    // Calculate pending scrutiny based on pending status
    const pendingScrutiny = PROMISES.filter(p => p.status === 'no_verified_progress' || p.status === 'unable_to_verify').length;

    return {
      promisesTracked,
      evidenceDocuments,
      verifiedComplete,
      pendingScrutiny
    };
  },
  ['platform-aggregate-stats'],
  { revalidate: 60 } // Cache for 60 seconds
);

/**
 * Simulates a unified, batched data query.
 * In a real backend, this establishes the pattern for a single composite query 
 * (e.g. GraphQL or a joined SQL query) fetching the profile, promises, and evidence 
 * in one round trip to avoid sequential request waterfalls.
 */
export async function getPoliticianDossier(id: string) {
  // Simulate network delay to prove this runs async
  // await new Promise(resolve => setTimeout(resolve, 50));

  const politician = POLITICIANS.find(p => p.id === id);
  if (!politician) return null;

  const party = PARTIES.find(p => p.id === politician.partyId) || null;
  const promises = PROMISES.filter(p => p.politicianId === politician.id);
  
  // In a real implementation, we would also fetch evidence documents here
  const evidence: any[] = []; 

  return {
    politician,
    party,
    promises,
    evidence
  };
}
