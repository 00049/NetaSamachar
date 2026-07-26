import { EntityIndex, EntityCardData } from '@/components/shared/EntityIndex';
import { PARTIES, POLITICIANS } from '@/data/politicians';
import { PROMISES } from '@/data/promises';
import { aggregateStats } from '@/lib/aggregation';

export default function PartiesIndexPage() {
  const partyEntities: EntityCardData[] = PARTIES.map(party => {
    // Filter politicians by this party
    const partyPoliticians = POLITICIANS.filter(p => p.partyId === party.id);
    const partyPromises = PROMISES.filter(p => p.partyId === party.id);
    const stats = aggregateStats(partyPoliticians, partyPromises);

    return {
      id: party.id,
      name: party.name,
      abbreviation: party.abbreviation,
      color: party.color,
      stats,
      type: 'party' as const,
    };
  }).filter(entity => entity.stats.totalPoliticians > 0); // Only show active parties

  return (
    <EntityIndex 
      title="Political Parties" 
      entities={partyEntities} 
    />
  );
}
