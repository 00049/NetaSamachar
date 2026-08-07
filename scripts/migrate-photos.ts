/**
 * Photo migration script: uploads remaining non-Cloudinary politician images
 * to Cloudinary and updates the DB records.
 * Run: npx tsx scripts/migrate-photos.ts
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

// Parse CLOUDINARY_URL manually since some SDK versions don't auto-parse it
const cloudinaryUrl = process.env.CLOUDINARY_URL || '';
const match = cloudinaryUrl.match(/cloudinary:\/\/(\d+):([^@]+)@(.+)/);
if (!match) throw new Error('Invalid CLOUDINARY_URL format');
const [, apiKey, apiSecret, cloudName] = match;

cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

const prisma = new PrismaClient();

// Politicians with local /images/ paths or Wikimedia hotlinks
const nonCloudinaryPoliticians = [
  { id: 'nishant-kumar', photoUrl: '/images/nishant_real.jpg', local: true },
  { id: 'shambhuraj-desai', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Generic_man_silhouette.svg/500px-Generic_man_silhouette.svg.png' },
  { id: 'rajesh-kumar', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Generic_man_silhouette.svg/500px-Generic_man_silhouette.svg.png' },
  { id: 'jp-nadda', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/J.P._Nadda_2024.jpg/500px-J.P._Nadda_2024.jpg' },
  { id: 'prem-kumar', photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Prem_Kumar_Dhumal_2011.jpg/500px-Prem_Kumar_Dhumal_2011.jpg' },
];

async function uploadToCloudinary(id: string, source: string, isLocal: boolean): Promise<string | null> {
  try {
    const uploadSource = isLocal ? `${process.cwd()}/public${source}` : source;
    const result = await cloudinary.uploader.upload(uploadSource, {
      folder: 'neta_samachar_politicians',
      public_id: id,
      overwrite: true,
    });
    return result.secure_url;
  } catch (err: any) {
    console.error(`  Failed to upload ${id}:`, err.message);
    return null;
  }
}

async function run() {
  console.log('Starting photo migration...\n');
  for (const p of nonCloudinaryPoliticians) {
    console.log(`Processing ${p.id}...`);
    const newUrl = await uploadToCloudinary(p.id, p.photoUrl, !!(p as any).local);
    if (newUrl) {
      await prisma.politician.update({ where: { id: p.id }, data: { photoUrl: newUrl } });
      console.log(`  ✅ Updated: ${newUrl}`);
    } else {
      console.log(`  ⚠️  Skipped (upload failed)`);
    }
  }
  console.log('\nDone.');
}

run().finally(() => prisma.$disconnect());
