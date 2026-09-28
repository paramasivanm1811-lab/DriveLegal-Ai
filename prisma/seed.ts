import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const lawsPath = path.join(__dirname, '../data/laws.json');
  const lawsData = JSON.parse(fs.readFileSync(lawsPath, 'utf8'));

  for (const law of lawsData) {
    await prisma.law.upsert({
      where: { id: law.id },
      update: {},
      create: {
        id: law.id,
        tier: law.tier,
        district: law.district,
        title: law.title,
        desc: law.desc,
        authority: law.authority,
        penalty: law.penalty,
        vehicleType: law.vehicleType,
        category: law.category,
      },
    });
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
