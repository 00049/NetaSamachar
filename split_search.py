import re

with open("app/search/page.tsx", "r") as f:
    text = f.read()

# Remove MOCK_EVIDENCE completely
mock_ev_start = text.find('// Mock Evidence since')
mock_ev_end = text.find('];', mock_ev_start) + 2
text = text[:mock_ev_start] + text[mock_ev_end:]

# SearchContent becomes SearchClient
search_client_jsx = text.replace('function SearchContent() {', 'export function SearchClient() {')
search_client_jsx = search_client_jsx.replace('export default function SearchPage() {', 'function __SearchPage() {')
search_client_jsx = search_client_jsx[:search_client_jsx.find('function __SearchPage() {')]

# Add searchEvidence import
search_client_jsx = search_client_jsx.replace("import { PROMISES } from '@/data/promises';", "import { PROMISES } from '@/data/promises';\nimport { searchEvidence } from '@/lib/api';")

# We need to make searchEvidence async? Wait, useMemo is sync. 
# But searchEvidence is async in lib/api.ts! 
# Let me just check if I can keep MOCK_EVIDENCE synchronously imported from lib/api?
# No, searchEvidence is async, but wait, if it's client-side, we should useEffect to fetch it.
# Actually, the user asked to extract MOCK_EVIDENCE to lib/api.ts as a "proper data source once Phase B lands".
# For now, it's easier to just fetch it or we can import MOCK_EVIDENCE from lib/api? No, it's not exported.
# Let's change searchEvidence to be sync in lib/api.ts for now since it's just filtering, 
# or I can just await it inside useEffect in SearchClient.
