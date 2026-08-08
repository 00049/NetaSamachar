async function run() {
  console.log('--- RATE LIMIT TEST ---');
  let rateLimitHit = false;
  for (let i = 0; i < 10; i++) {
    const res = await fetch('http://localhost:3001/api/politicians/nishant-kumar/summary');
    if (res.status === 429) {
      console.log(`Hit 429 after ${i} successful requests`);
      rateLimitHit = true;
      break;
    }
  }
  if (!rateLimitHit) console.log('Did not hit rate limit within 10 requests');

  console.log('\n--- REPORT ISSUE EMAIL TEST ---');
  const issueRes = await fetch('http://localhost:3001/api/report-issue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ issueType: 'Test', details: 'Audit run', politicianId: 'nishant-kumar' })
  });
  console.log('Report issue status:', issueRes.status);
  console.log('Report issue response:', await issueRes.json());
}
run();
