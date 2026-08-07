import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const updates = [
  { id: 'shambhuraj-desai', photoUrl: 'https://ui-avatars.com/api/?name=Shambhuraj+Desai&background=3F3F46&color=fff&size=200&bold=true' },
  { id: 'rajesh-kumar',     photoUrl: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=3F3F46&color=fff&size=200&bold=true' },
  { id: 'jp-nadda',         photoUrl: 'https://ui-avatars.com/api/?name=J.P.+Nadda&background=3F3F46&color=fff&size=200&bold=true' },
  { id: 'prem-kumar',       photoUrl: 'https://ui-avatars.com/api/?name=Prem+Kumar&background=3F3F46&color=fff&size=200&bold=true' },
];

async function run() {
  for (const u of updates) {
    await prisma.politician.update({ where: { id: u.id }, data: { photoUrl: u.photoUrl } });
    console.log('Updated:', u.id);
  }
}

run().finally(() => prisma.$disconnect());
