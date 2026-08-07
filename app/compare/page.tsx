import { ComparePageClient } from './ComparePageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Politicians & Parties — Neta Samachar',
  description:
    'Side-by-side comparison of parties, states, constituencies, and politicians — identical methodology applied to both sides.',
};

// Next.js App Router: searchParams is a Promise in server components
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; a?: string; b?: string; c?: string }>;
}) {
  const resolvedParams = await searchParams;
  return <ComparePageClient initialSearchParams={resolvedParams} />;
}
