import { performSearch } from './app/actions/search';
async function test() {
  const r1 = await performSearch('hi');
  console.log("Query 'hi':", { pols: r1.politicians.length, evs: r1.evidence?.length });
  
  const r2 = await performSearch('zxcvbnm');
  console.log("Query 'zxcvbnm':", { pols: r2.politicians.length, evs: r2.evidence?.length });
}
test();
