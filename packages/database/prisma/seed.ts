import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const challenge = await prisma.challenge.upsert({
    where: { id: 'seed-bike-5-days' },
    update: {},
    create: {
      id: 'seed-bike-5-days',
      title: 'Use bicycle 5 days',
      description: 'Replace short motorized trips with cycling for a workweek.',
      points: 220,
      badge: 'Cycling Champion',
    },
  });

  await prisma.community.upsert({
    where: { id: 'seed-campus-green-team' },
    update: {},
    create: {
      id: 'seed-campus-green-team',
      name: 'Campus Green Team',
      type: 'college',
      totalReduced: 4200,
    },
  });

  console.log(`Seeded challenge ${challenge.title}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
