import { EntityScorecard } from '@/components/shared/EntityScorecard';
import { PARTIES, POLITICIANS } from '@/data/politicians';
import { PROMISES } from '@/data/promises';
import { aggregateStats } from '@/lib/aggregation';
import { notFound } from 'next/navigation';

export default function PartyScorecardPage({ params }: { params: { slug: string } }) {
  const party = PARTIES.find(p => p.id === params.slug);
  
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
