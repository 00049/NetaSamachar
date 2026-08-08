import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const politicians = await prisma.politician.findMany({
    where: {
      name: {
        in: ['Sanjay Chauhan', 'Suresh Bhardwaj']
      }
    },
    select: {
      id: true,
      name: true,
      photoUrl: true
    }
  });
  
  console.log(JSON.stringify(politicians, null, 2));

  // Also count total and how many don't have cloudinary/correct URL
  const allPoliticians = await prisma.politician.findMany({
    select: { id: true, name: true, photoUrl: true }
  });

  let total = allPoliticians.length;
  let cloudinaryCount = 0;
  let otherCount = 0;
  let missingCount = 0;
  
  for (const p of allPoliticians) {
    if (!p.photoUrl) {
      missingCount++;
    } else if (p.photoUrl.includes('res.cloudinary.com')) {
      cloudinaryCount++;
    } else {
      otherCount++;
      // console.log(`Non-cloudinary: ${p.name} - ${p.photoUrl}`);
    }
  }

  console.log(`\nTotal Politicians: ${total}`);
  console.log(`Cloudinary URLs: ${cloudinaryCount}`);
  console.log(`Other URLs: ${otherCount}`);
  console.log(`Missing URLs: ${missingCount}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
