import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function auditPhotos() {
  console.log('Starting photo audit...');
  const politicians = await prisma.politician.findMany({
    select: { id: true, name: true, photoUrl: true },
  });

  console.log(`Found ${politicians.length} politicians.`);
  
  const suspectPhotos = [];

  for (const p of politicians) {
    if (!p.photoUrl) {
      suspectPhotos.push({ id: p.id, name: p.name, issue: 'No photoUrl' });
      continue;
    }
    
    // Check for obvious placeholders or bad domains
    if (p.photoUrl.includes('ui-avatars.com') || p.photoUrl.includes('placeholder')) {
      suspectPhotos.push({ id: p.id, name: p.name, issue: 'Placeholder URL', url: p.photoUrl });
      continue;
    }
    
    // Check for local paths
    if (p.photoUrl.startsWith('/') || p.photoUrl.startsWith('.')) {
      suspectPhotos.push({ id: p.id, name: p.name, issue: 'Local path instead of remote URL', url: p.photoUrl });
      continue;
    }
    
    // Check for wikimedia links (from Phase H migration leftovers)
    if (p.photoUrl.includes('wikimedia.org') || p.photoUrl.includes('wikipedia')) {
      suspectPhotos.push({ id: p.id, name: p.name, issue: 'Unmigrated Wikimedia hotlink', url: p.photoUrl });
      continue;
    }
    
    // Simple fetch check for broken links
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const res = await fetch(p.photoUrl, { 
        method: 'HEAD',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        suspectPhotos.push({ id: p.id, name: p.name, issue: `HTTP ${res.status}`, url: p.photoUrl });
      } else {
         // Check content type to see if it's an image
         const contentType = res.headers.get('content-type');
         if (!contentType || !contentType.startsWith('image/')) {
            suspectPhotos.push({ id: p.id, name: p.name, issue: `Not an image: ${contentType}`, url: p.photoUrl });
         }
      }
    } catch (err: any) {
      suspectPhotos.push({ id: p.id, name: p.name, issue: `Fetch failed: ${err.message}`, url: p.photoUrl });
    }
  }

  console.log('\n--- SUSPECT PHOTOS REPORT ---');
  if (suspectPhotos.length === 0) {
    console.log('No suspect photos found!');
  } else {
    console.table(suspectPhotos);
  }
  
  await prisma.$disconnect();
}

auditPhotos().catch(console.error);
