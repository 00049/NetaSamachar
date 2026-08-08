with open("app/search/page.tsx", "r") as f:
    text = f.read()

# 1. Write SearchClient.tsx
# Remove MOCK_EVIDENCE
mock_start = text.find('// Mock Evidence since')
mock_end = text.find('];\n', mock_start) + 3
client_text = text[:mock_start] + text[mock_end:]

# Replace MOCK_EVIDENCE.filter with searchEvidence
old_filter = """    const ev = MOCK_EVIDENCE.filter(
      (x) =>
        x.title.toLowerCase().includes(debouncedQuery) ||
        x.excerpt.toLowerCase().includes(debouncedQuery) ||
        x.sha256Hash.toLowerCase().includes(debouncedQuery)
    );"""
new_filter = """    const ev = searchEvidence(debouncedQuery);"""
client_text = client_text.replace(old_filter, new_filter)

# Change function SearchContent to export function SearchClient
client_text = client_text.replace('function SearchContent() {', 'export function SearchClient() {')

# Add searchEvidence import
client_text = client_text.replace(
    "import { PROMISES } from '@/data/promises';",
    "import { PROMISES } from '@/data/promises';\nimport { searchEvidence } from '@/lib/api';"
)

# Remove export default SearchPage at the bottom
page_start = client_text.find('export default function SearchPage() {')
client_text = client_text[:page_start]

# Change type of cache 
client_text = client_text.replace(
    "const cache = useSearchCache<{ politicians: typeof POLITICIANS; promises: typeof PROMISES; evidence: typeof MOCK_EVIDENCE }>('search');",
    "const cache = useSearchCache<{ politicians: typeof POLITICIANS; promises: typeof PROMISES; evidence: any[] }>('search');"
)

with open("app/search/SearchClient.tsx", "w") as f:
    f.write(client_text)

# 2. Write page.tsx
page_text = """import { Suspense } from 'react';
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
"""
with open("app/search/page.tsx", "w") as f:
    f.write(page_text)

