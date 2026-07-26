import { EntityScorecard } from '@/components/shared/EntityScorecard';
import { POLITICIANS } from '@/data/politicians';
import { PROMISES } from '@/data/promises';
import { aggregateStats } from '@/lib/aggregation';
import { notFound } from 'next/navigation';

export default function StateScorecardPage({ params }: { params: { slug: string } }) {
  const uniqueStates = Array.from(new Set(POLITICIANS.map(p => p.state)));
  const stateName = uniqueStates.find(s => s.toLowerCase().replace(/\s+/g, '-') === params.slug);
  
  if (!stateName) {
    notFound();
  }

  const statePoliticians = POLITICIANS.filter(p => p.state === stateName);
  const statePromises = PROMISES.filter(p => p.state === stateName);
  const stats = aggregateStats(statePoliticians, statePromises);

  return (
    <EntityScorecard 
      entityId={params.slug}
      entityName={stateName}
      entityType="state"
      stats={stats}
      politicians={statePoliticians}
      promises={statePromises}
    />
  );
}
