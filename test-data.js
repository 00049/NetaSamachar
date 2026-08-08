const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const politicians = await prisma.politician.findMany();
  let validPhotos = 0;
  let silhouette = 0;
  let missing = 0;
  const silhouetteUrl = 'Generic_man_silhouette.svg.png';
  
  politicians.forEach(p => {
    if (!p.photoUrl || p.photoUrl.includes('placeholder.jpg')) {
      missing++;
    } else if (p.photoUrl.includes(silhouetteUrl)) {
      silhouette++;
      console.log(`Silhouette: ${p.name} (${p.id})`);
    } else {
      validPhotos++;
    }
  });
  
  console.log(`Total: ${politicians.length}`);
  console.log(`Valid Photos: ${validPhotos}`);
  console.log(`Silhouette URLs: ${silhouette}`);
  console.log(`Missing/Placeholder: ${missing}`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
