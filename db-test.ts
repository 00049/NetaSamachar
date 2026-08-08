import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  console.log('--- DATABASE COUNTS ---');
  console.log('Politicians:', await prisma.politician.count());
  console.log('Parties:', await prisma.party.count());
  console.log('Promises:', await prisma.promise.count());
  console.log('Bills:', await prisma.bill.count());
  console.log('CriminalCases:', await prisma.criminalCase.count());
  console.log('Evidence:', await prisma.evidence.count());
  console.log('VoteRecords:', await prisma.voteRecord.count());
  
  // Check URLs
  const firstPol = await prisma.politician.findFirst();
  console.log('\n--- SAMPLE POLITICIAN ID ---');
  console.log('ID:', firstPol?.id); // Expect slug-like, not UUID if we migrated slugs
}
run().finally(() => prisma.$disconnect());
