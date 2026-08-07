import { MetadataRoute } from 'next';
import { POLITICIANS } from '@/data/politicians';
import { PARTIES } from '@/data/politicians';
import { BILLS } from '@/data/bills';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://netasamachar.in';

export default function sitemap(): MetadataRoute.Sitemap {
  // Static Routes
  const staticRoutes = [
    '',
    '/about',
    '/methodology',
    '/sources',
    '/investigations',
    '/archive',
    '/compare',
    '/politicians',
    '/parties',
    '/search',
    '/evidence',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic Routes - Politicians
  const politicianRoutes = POLITICIANS.map((politician) => ({
    url: `${BASE_URL}/politicians/${politician.id}`,
    lastModified: new Date(politician.lastUpdated || new Date()),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Dynamic Routes - Parties
  const partyRoutes = PARTIES.map((party) => ({
    url: `${BASE_URL}/parties/${party.abbreviation.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Dynamic Routes - Bills
  const billRoutes = BILLS.map((bill) => ({
    url: `${BASE_URL}/bills/${bill.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...politicianRoutes, ...partyRoutes, ...billRoutes];
}
