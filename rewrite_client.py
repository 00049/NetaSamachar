with open("app/search/SearchClient.tsx", "r") as f:
    text = f.read()

# 1. Imports
text = text.replace("import { POLITICIANS } from '@/data/politicians';\nimport { PROMISES } from '@/data/promises';\nimport { searchEvidence } from '@/lib/api';", "import { performSearch } from '@/app/actions/search';")

# 2. Inside SearchClient()
start_state = text.find("  const [inputValue, setInputValue] = useState")
end_memo = text.find("  const totalResults =", start_state)

new_state_logic = """  const [debouncedQuery, setDebouncedQueryURL] = useUrlState('q', '');
  const [inputValue, setInputValue] = useState(() => debouncedQuery);
  const [activeTab, setActiveTab] = useUrlState('tab', 'All');
  
  const [results, setResults] = useState<{ politicians: any[], promises: any[], evidence: any[] }>({ politicians: [], promises: [], evidence: [] });
  const [isSearching, setIsSearching] = useState(false);

  const cache = useSearchCache<any>('search');

  useEffect(() => {
    let active = true;
    if (!debouncedQuery) {
      setResults({ politicians: [], promises: [], evidence: [] });
      setIsSearching(false);
      return;
    }

    const cached = cache.get(debouncedQuery);
    if (cached) {
      setResults(cached);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    performSearch(debouncedQuery).then(res => {
      if (active) {
        setResults(res);
        cache.set(debouncedQuery, res);
        setIsSearching(false);
      }
    });

    return () => { active = false; };
  }, [debouncedQuery, cache]);

  const handleDebouncedSearch = useCallback((q: string) => {
    setDebouncedQueryURL(q.trim().toLowerCase());
  }, [setDebouncedQueryURL]);

  const { politicians, promises, evidence } = results;
"""

text = text[:start_state] + new_state_logic + text[end_memo:]

# Fix POPULAR_SEARCHES onClick
old_onclick = """                  onClick={() => {
                    setInputValue(q);
                    setDebouncedQuery(q.trim().toLowerCase());
                  }}"""
new_onclick = """                  onClick={() => {
                    setInputValue(q);
                    setDebouncedQueryURL(q.trim().toLowerCase());
                  }}"""
text = text.replace(old_onclick, new_onclick)

# Also fix the one in Empty State
text = text.replace(old_onclick, new_onclick)

with open("app/search/SearchClient.tsx", "w") as f:
    f.write(text)

