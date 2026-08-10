import { unstable_cache } from 'next/cache';
import { PrismaClient } from '@prisma/client';
import { EXECUTIVE_BRIEFS } from '@/data/executive_briefs';
import { Politician, Promise as PromiseType, Bill, CriminalCase, TimelineEvent, Party, Evidence } from './types';

const prisma = new PrismaClient();

/**
 * Calculates and caches global platform statistics.
 * Revalidates every 60 seconds to ensure the homepage is fresh 
 * but avoids computing expensive aggregates on every request.
 */
export const getPlatformStats = unstable_cache(
  async () => {
    const promisesTracked = await prisma.promise.count();
    
    // Real evidence count from DB
    const evidenceDocuments = await prisma.evidence.count(); 
    
    // Calculate verified complete %
    const fulfilled = await prisma.promise.count({
      where: {
        status: {
          in: ['completed', 'operational', 'mostly_completed']
        }
      }
    });
    const verifiedComplete = promisesTracked > 0 ? Math.round((fulfilled / promisesTracked) * 100) : 0;

    // Calculate pending scrutiny based on pending status
    const pendingScrutiny = await prisma.promise.count({
      where: {
        status: {
          in: ['no_verified_progress', 'unable_to_verify']
        }
      }
    });

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
 * Single composite query fetching the profile, promises, and evidence
 */
export async function getPoliticianDossier(id: string) {
  const politician = await prisma.politician.findUnique({
    where: { id },
    include: {
      party: true,
      criminalCases: true,
      assetDeclarations: true,
      careerTimeline: true,
      promises: {
        include: {
          timeline: true
        }
      },
      bills: true,
      voteRecords: true
    }
  });
  if (!politician) return null;

  const party = politician.party;
  const promises = politician.promises;
  const bills = politician.bills;
  const votes = politician.voteRecords;
  
  // Aggregate evidence IDs
  const evidenceIds = new Set<string>();
  politician.evidenceIds.forEach((eid: string) => evidenceIds.add(eid));
  promises.forEach((p: any) => p.evidenceIds.forEach((eid: string) => evidenceIds.add(eid)));
  promises.forEach((p: any) => p.timeline.forEach((t: any) => t.evidenceIds.forEach((eid: string) => evidenceIds.add(eid))));
  
  const evidence = await prisma.evidence.findMany({
    where: {
      id: { in: Array.from(evidenceIds) }
    }
  });
  
  const executiveBrief = EXECUTIVE_BRIEFS[id] || null;

  return {
    politician: politician as any as Politician,
    party: party as any as Party,
    promises: promises as any as PromiseType[],
    bills: bills as any as Bill[],
    votes: votes as any,
    evidence: evidence as any as Evidence[],
    executiveBrief
  };
}

export async function getBill(id: string): Promise<Bill | null> {
  return await prisma.bill.findUnique({ where: { id } }) as any;
}

export async function getCriminalCase(id: string): Promise<CriminalCase | null> {
  return await prisma.criminalCase.findUnique({
    where: { id },
    include: { politician: true }
  }) as any;
}

export async function getPromise(id: string): Promise<PromiseType | null> {
  return await prisma.promise.findUnique({
    where: { id },
    include: { politician: true, party: true, timeline: true }
  }) as any;
}

export async function getTimelineEvent(id: string): Promise<TimelineEvent | null> {
  return await prisma.timelineEvent.findUnique({
    where: { id },
    include: { promise: true }
  }) as any;
}

export async function getState(slug: string) {
  const stateName = slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const exists = await prisma.politician.findFirst({
    where: { state: stateName }
  });
  if (!exists) return null;
  return { name: stateName, slug };
}

export async function getParty(slug: string): Promise<Party | null> {
  return await prisma.party.findFirst({
    where: {
      abbreviation: {
        mode: 'insensitive',
        equals: slug
      }
    }
  }) as any;
}

export async function getParties(): Promise<(Party & { _count: { politicians: number } })[]> {
  return await prisma.party.findMany({
    include: {
      _count: {
        select: { politicians: true }
      }
    }
  }) as any;
}

export async function getPoliticiansByParty(partyId: string): Promise<Politician[]> {
  return await prisma.politician.findMany({
    where: { partyId },
    include: { party: true, criminalCases: true, assetDeclarations: true, careerTimeline: true }
  }) as any;
}

export async function getPromisesByParty(partyId: string): Promise<PromiseType[]> {
  return await prisma.promise.findMany({
    where: { partyId },
    include: { politician: true, party: true, timeline: true }
  }) as any;
}

export async function getPoliticiansByState(stateName: string): Promise<Politician[]> {
  return await prisma.politician.findMany({
    where: { state: stateName },
    include: { party: true, criminalCases: true, assetDeclarations: true, careerTimeline: true }
  }) as any;
}

export async function searchEvidence(query: string): Promise<Evidence[]> {
  if (!query) return await prisma.evidence.findMany({ take: 10 }) as any;
  return await prisma.evidence.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: 20
  }) as any;
}

export async function getPoliticians(): Promise<Politician[]> {
  return await prisma.politician.findMany({
    include: { party: true, criminalCases: true, assetDeclarations: true, careerTimeline: true }
  }) as any;
}

export async function getTrendingPoliticians(): Promise<Politician[]> {
  return await prisma.politician.findMany({
    take: 4,
    include: { party: true, criminalCases: true, assetDeclarations: true, careerTimeline: true },
    orderBy: { attendancePercent: 'desc' } // or any other arbitrary ranking to represent "trending"
  }) as any;
}
