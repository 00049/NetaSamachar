import { EntityIndex, EntityCardData } from '@/components/shared/EntityIndex';
import { POLITICIANS } from '@/data/politicians';
import { PROMISES } from '@/data/promises';
import { aggregateStats } from '@/lib/aggregation';

export default function StatesIndexPage() {
  // Extract unique states from politicians
  const uniqueStates = Array.from(new Set(POLITICIANS.map(p => p.state)));

  const stateEntities: EntityCardData[] = uniqueStates.map(stateName => {
    const statePoliticians = POLITICIANS.filter(p => p.state === stateName);
    const statePromises = PROMISES.filter(p => p.state === stateName);
    const stats = aggregateStats(statePoliticians, statePromises);
    
    // Slugify the state name for the ID
    const slug = stateName.toLowerCase().replace(/\s+/g, '-');

    return {
      id: slug,
      name: stateName,
      stats,
      type: 'state',
    };
  });

  return (
    <EntityIndex 
      title="States & Territories" 
      entities={stateEntities} 
    />
  );
}
