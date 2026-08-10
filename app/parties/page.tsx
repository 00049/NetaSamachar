import { getParties } from '@/lib/api';
import { PartiesClient } from './PartiesClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Political Parties | Neta Samachar',
  description: 'Explore the political parties represented in the Neta Samachar database.',
};

export default async function PartiesPage() {
  const parties = await getParties();

  return <PartiesClient initialParties={parties} />;
}
