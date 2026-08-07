import { Suspense } from 'react';
import { SearchClient } from './SearchClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search | Neta Samachar',
  description: 'Search across politicians, promises, and evidence in Neta Samachar.',
};

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-[var(--bg-base)]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
          <div className="text-white/60 text-sm">Initializing search engine...</div>
        </div>
      </div>
    }>
      <SearchClient />
    </Suspense>
  );
}
