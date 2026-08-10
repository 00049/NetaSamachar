import { PrismaClient } from '@prisma/client';
import { PARTIES, POLITICIANS, ARCHIVED_POLITICIANS } from '../data/politicians';
import { PROMISES, EVIDENCE } from '../data/promises';
import { BILLS } from '../data/bills';
import { VOTES } from '../data/votes';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database (except AISummary)...');
  await prisma.voteRecord.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.timelineEvent.deleteMany();
  await prisma.promise.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.criminalCase.deleteMany();
  await prisma.assetDeclaration.deleteMany();
  await prisma.politicalOffice.deleteMany();
  await prisma.politician.deleteMany();
  await prisma.party.deleteMany();
  
  console.log('Seeding Parties...');
  for (const party of PARTIES) {
    await prisma.party.create({
      data: {
        id: party.id,
        name: party.name,
        abbreviation: party.abbreviation,
        color: party.color,
        ideology: party.ideology,
        founded: party.founded,
        logoUrl: party.logoUrl,
        isNational: party.isNational || false,
      }
    });
  }
  
  console.log('Seeding Politicians...');
  const allPoliticians = [...POLITICIANS, ...(ARCHIVED_POLITICIANS || [])];
  for (const pol of allPoliticians) {
    await prisma.politician.create({
      data: {
        id: pol.id,
        name: pol.name,
        nameHindi: pol.nameHindi,
        photoUrl: pol.photoUrl,
        partyId: pol.partyId,
        constituency: pol.constituency,
        state: pol.state,
        position: pol.position,
        chamber: pol.chamber,
        education: pol.education,
        age: pol.age,
        yearsInPolitics: pol.yearsInPolitics,
        attendancePercent: pol.attendancePercent,
        questionsRaised: pol.questionsRaised,
        billsIntroduced: pol.billsIntroduced,
        debatesParticipated: pol.debatesParticipated,
        promisesTotal: pol.promisesTotal,
        promisesFulfilled: pol.promisesFulfilled,
        promisesBroken: pol.promisesBroken,
        promisesInProgress: pol.promisesInProgress,
        latestNetWorth: pol.latestNetWorth,
        bio: pol.bio,
        officialEmail: pol.officialEmail,
        officialWebsite: pol.officialWebsite,
        twitter: pol.socialMedia?.twitter,
        facebook: pol.socialMedia?.facebook,
        termsSince: pol.termsSince,
        verified: pol.verified,
        lastUpdated: new Date(pol.lastUpdated),
        evidenceIds: pol.evidenceIds || [],
        
        criminalCases: {
          create: pol.criminalCases.map(c => ({
            id: c.id,
            caseNumber: c.caseNumber,
            court: c.court,
            section: c.section,
            chargeDescription: c.chargeDescription,
            status: c.status,
            year: c.year,
            severity: c.severity,
          }))
        },
        assetDeclarations: {
          create: pol.assetDeclarations.map(a => ({
            year: a.year,
            electionType: a.electionType,
            party: a.party,
            constituency: a.constituency,
            winner: a.winner,
            margin: a.margin,
            runnerUp: a.runnerUp,
            totalAssets: a.totalAssets,
            totalLiabilities: a.totalLiabilities,
            movableAssets: a.movableAssets,
            immovableAssets: a.immovableAssets,
            spouseAssets: a.spouseAssets,
            growthPercent: a.growthPercent,
            declaredIncome: a.declaredIncome,
            assetComposition: a.assetComposition ? (a.assetComposition as any) : undefined,
            liabilityBreakdown: a.liabilityBreakdown ? (a.liabilityBreakdown as any) : undefined,
            incomeSources: a.incomeSources ? (a.incomeSources as any) : undefined,
          }))
        },
        careerTimeline: {
          create: pol.careerTimeline?.map(ct => ({
            title: ct.title,
            startYear: ct.startYear,
            endYear: String(ct.endYear),
            party: ct.party,
            constituency: ct.constituency,
            government: ct.government,
          })) || []
        }
      }
    });
  }

  console.log('Seeding Evidence...');
  for (const ev of EVIDENCE) {
    await prisma.evidence.create({
      data: {
        id: ev.id,
        title: ev.title,
        type: ev.type,
        source: ev.source,
        sourceUrl: ev.sourceUrl,
        date: new Date(ev.date),
        excerpt: ev.excerpt,
        sha256Hash: ev.sha256Hash,
        confidenceScore: ev.confidenceScore,
        tier: ev.tier,
        tags: ev.tags,
      }
    });
  }

  console.log('Seeding Promises...');
  for (const pr of PROMISES) {
    await prisma.promise.create({
      data: {
        id: pr.id,
        politicianId: pr.politicianId,
        partyId: pr.partyId,
        title: pr.title,
        fullStatement: pr.fullStatement,
        manifestoExcerpt: pr.manifestoExcerpt,
        category: pr.category,
        status: pr.status,
        madeDate: new Date(pr.madeDate),
        manifestoYear: pr.manifestoYear,
        deadline: pr.deadline,
        state: pr.state,
        confidenceScore: pr.confidenceScore,
        tags: pr.tags,
        evidenceIds: pr.evidenceIds,
        
        timeline: {
          create: pr.timeline.map((t: any) => ({
            id: t.id,
            date: new Date(t.date),
            title: t.title,
            description: t.description,
            type: t.type,
            evidenceIds: t.evidenceIds,
            confidenceScore: t.confidenceScore,
          }))
        }
      }
    });
  }
  
  console.log('Seeding Bills...');
  for (const b of BILLS) {
    await prisma.bill.create({
      data: {
        id: b.id,
        politicianId: b.politicianId,
        title: b.title,
        summary: b.summary,
        status: b.status,
        sponsorRole: b.sponsorRole,
        introducedDate: new Date(b.introducedDate),
        type: b.type,
        isGovernmentBill: b.isGovernmentBill,
        legislativeSession: b.legislativeSession,
        house: b.house,
        ministerInCharge: b.ministerInCharge,
        language: b.language,
        passedDate: b.passedDate ? new Date(b.passedDate) : null,
        assentDate: b.assentDate ? new Date(b.assentDate) : null,
        gazetteDate: b.gazetteDate ? new Date(b.gazetteDate) : null,
        objectives: b.objectives ? (b.objectives as any) : undefined,
        keyProvisions: b.keyProvisions ? (b.keyProvisions as any) : undefined,
        imageUrl: b.imageUrl,
        votesFor: b.votesFor,
        votesAgainst: b.votesAgainst,
        votesAbstain: b.votesAbstain,
        officialRecordUrl: b.officialRecordUrl,
        gazetteUrl: b.gazetteUrl,
        relatedPromiseIds: b.relatedPromiseIds || [],
        votingRecord: b.votingRecord ? (b.votingRecord as any) : undefined,
        timeline: b.timeline ? (b.timeline as any) : undefined,
      }
    });
  }

  console.log('Seeding Votes...');
  const validBillIds = new Set(BILLS.map(b => b.id));
  const validVotes = VOTES.filter(v => validBillIds.has(v.billId));
  for (const v of validVotes) {
    await prisma.voteRecord.create({
      data: {
        id: v.id,
        politicianId: v.politicianId,
        billId: v.billId,
        billTitle: v.billTitle,
        vote: v.vote,
        date: new Date(v.date),
        partyPosition: v.partyPosition,
      }
    });
  }
  
  const partyCount = await prisma.party.count();
  const polCount = await prisma.politician.count();
  const promCount = await prisma.promise.count();
  const evCount = await prisma.evidence.count();
  const billCount = await prisma.bill.count();
  const voteCount = await prisma.voteRecord.count();
  
  console.log(`\n✅ Migration Complete!`);
  console.log(`Parties: ${partyCount} / ${PARTIES.length}`);
  console.log(`Politicians: ${polCount} / ${allPoliticians.length}`);
  console.log(`Promises: ${promCount} / ${PROMISES.length}`);
  console.log(`Evidence: ${evCount} / ${EVIDENCE.length}`);
  console.log(`Bills: ${billCount} / ${BILLS.length}`);
  console.log(`Votes: ${voteCount} / ${VOTES.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
