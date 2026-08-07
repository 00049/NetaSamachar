import { EntityScorecard } from '@/components/shared/EntityScorecard';
import { PARTIES, POLITICIANS } from '@/data/politicians';
import { PROMISES } from '@/data/promises';
import { aggregateStats } from '@/lib/aggregation';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const party = PARTIES.find(p => p.id === slug);
  if (!party) return { title: 'Party Not Found' };
  
  return {
    title: `${party.name} (${party.abbreviation}) | Neta Samachar`,
    description: `Accountability scorecard for ${party.name}. Track promises, candidates, and legislative performance.`,
    alternates: {
      canonical: `/parties/${slug}`,
    },
  };
}

export default async function PartyScorecardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const party = PARTIES.find(p => p.id === slug);
  
  if (!party) {
    notFound();
  }

  const partyPoliticians = POLITICIANS.filter(p => p.partyId === party.id);
  const partyPromises = PROMISES.filter(p => p.partyId === party.id);
  const stats = aggregateStats(partyPoliticians, partyPromises);

  return (
    <EntityScorecard 
      entityId={party.id}
      entityName={party.name}
      entityType="party"
      stats={stats}
      politicians={partyPoliticians}
      promises={partyPromises}
    />
  );
}
