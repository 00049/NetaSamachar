'use server';

import { POLITICIANS, PARTIES } from '@/data/politicians';
import { PROMISES } from '@/data/promises';
import { searchEvidence } from '@/lib/api';
import type { Politician, Promise as PromiseType } from '@/lib/types';

export async function performSearch(query: string) {
  const q = query.trim().toLowerCase();
  
  if (!q) {
    return { politicians: [], promises: [], evidence: [] };
  }

  // 1. Search Politicians (name, constituency, state, position, party name)
  const politicians = POLITICIANS.filter((x: Politician) => {
    // Find party name
    const party = PARTIES.find(p => p.id === x.partyId);
    const partyName = party ? party.name.toLowerCase() : '';
    const partyAbbrev = party ? party.abbreviation.toLowerCase() : '';
    
    return (
      x.name.toLowerCase().includes(q) ||
      x.constituency.toLowerCase().includes(q) ||
      x.state.toLowerCase().includes(q) ||
      (x.position && x.position.toLowerCase().includes(q)) ||
      partyName.includes(q) ||
      partyAbbrev.includes(q)
    );
  });

  // 2. Search Promises (title, fullStatement)
  const promises = PROMISES.filter((x: PromiseType) =>
    x.title.toLowerCase().includes(q) ||
    x.fullStatement.toLowerCase().includes(q)
  );

  // 3. Search Evidence
  // searchEvidence handles filtering internally for title, excerpt, sha256Hash
  const evidence = searchEvidence(q);

  return { politicians, promises, evidence };
}
