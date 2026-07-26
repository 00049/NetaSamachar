import { EntityScorecard } from '@/components/shared/EntityScorecard';
import { POLITICIANS } from '@/data/politicians';
import { PROMISES } from '@/data/promises';
import { aggregateStats } from '@/lib/aggregation';
import { notFound } from 'next/navigation';

export default function CityScorecardPage({ params }: { params: { slug: string, city: string } }) {
  const uniqueStates = Array.from(new Set(POLITICIANS.map(p => p.state)));
  const stateName = uniqueStates.find(s => s.toLowerCase().replace(/\s+/g, '-') === params.slug);
  
  if (!stateName) {
    notFound();
  }

  // We assume constituency === city for the scope of this view
  const statePoliticians = POLITICIANS.filter(p => p.state === stateName);
  const uniqueConstituencies = Array.from(new Set(statePoliticians.map(p => p.constituency)));
  const cityName = uniqueConstituencies.find(c => c.toLowerCase().replace(/\s+/g, '-') === params.city);

  if (!cityName) {
    notFound();
  }

  const cityPoliticians = POLITICIANS.filter(p => p.state === stateName && p.constituency === cityName);
  
  // Promises generally don't have a constituency field in the current type, 
  // but if they are linked to politicians from this city, we can aggregate them.
  const cityPolIds = new Set(cityPoliticians.map(p => p.id));
  const cityPromises = PROMISES.filter(p => cityPolIds.has(p.politicianId));
  
  const stats = aggregateStats(cityPoliticians, cityPromises);

  return (
    <EntityScorecard 
      entityId={`${params.slug}-${params.city}`}
      entityName={cityName}
      entityType="city"
      parentState={stateName}
      stats={stats}
      politicians={cityPoliticians}
      promises={cityPromises}
    />
  );
}
