import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

const badUrls = [
  'https://res.cloudinary.com/g37jftpu/image/upload/v1786081919/neta_samachar_politicians/rurxvazjewk7axkuacjh.jpg', // suresh
  'https://res.cloudinary.com/g37jftpu/image/upload/v1786081920/neta_samachar_politicians/mtjxahifg3nk30rg96tv.jpg', // harish
  'https://res.cloudinary.com/g37jftpu/image/upload/v1786081922/neta_samachar_politicians/uez9xedsn5uo6myayxzv.jpg', // mohan
  'https://res.cloudinary.com/g37jftpu/image/upload/v1786081925/neta_samachar_politicians/yrjyiadnccqnkw2ghzxe.jpg', // sanjay chauhan
  'https://res.cloudinary.com/g37jftpu/image/upload/v1786081926/neta_samachar_politicians/adykgnnabhpvjwbbirbd.jpg', // surinder
  'https://res.cloudinary.com/g37jftpu/image/upload/v1786081928/neta_samachar_politicians/wbjugala9kfhx6gsegsx.jpg'  // sanjay sood
];

const fallback = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Generic_man_silhouette.svg/500px-Generic_man_silhouette.svg.png';

async function main() {
  // 1. Update Database
  for (const url of badUrls) {
    await prisma.politician.updateMany({
      where: { photoUrl: url },
      data: { photoUrl: fallback }
    });
  }
  console.log('Database updated.');

  // 2. Update data/politicians.ts
  const filePath = './data/politicians.ts';
  let content = fs.readFileSync(filePath, 'utf8');
  for (const url of badUrls) {
    content = content.replace(url, fallback);
  }
  fs.writeFileSync(filePath, content);
  console.log('data/politicians.ts updated.');

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
