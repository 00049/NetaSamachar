import { ComparePageClient } from './ComparePageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare',
  description:
    'Side-by-side comparison of parties, states, constituencies, and politicians — identical methodology applied to both sides.',
};

export default function ComparePage({
  searchParams,
}: {
  searchParams: { type?: string; a?: string; b?: string; c?: string };
}) {
  return (
    <main className="min-h-screen bg-[var(--bg-base)]">
      <ComparePageClient initialSearchParams={searchParams} />
    </main>
  );
}
