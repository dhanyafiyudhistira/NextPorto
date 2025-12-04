import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@nilm.com' },
    update: {},
    create: {
      email: 'demo@nilm.com',
      name: 'Demo User',
    },
  });

  console.log('✅ Created user:', user.email);

  // Create initial model version
  const initialModel = await prisma.modelVersion.upsert({
    where: { version: 1 },
    update: {},
    create: {
      version: 1,
      type: 'CNN-LSTM',
      weightsPath: '/models/global_model_v1.pth',
      accuracy: 0.85,
      loss: 0.15,
      roundId: 0,
      isGlobal: true,
    },
  });

  console.log('✅ Created initial model version:', initialModel.version);

  // Generate sample time series data
  const now = new Date();
  const samples = [];

  for (let i = 0; i < 100; i++) {
    const timestamp = new Date(now.getTime() - (100 - i) * 60000); // 1 minute intervals

    // Simulate realistic power consumption patterns
    const fridge = 50 + Math.random() * 100; // 50-150W baseline
    const dishWasher = Math.random() > 0.9 ? 1200 + Math.random() * 400 : 0;
    const electricSpaceHeater = Math.random() > 0.7 ? 1500 + Math.random() * 500 : 0;
    const electricStove = Math.random() > 0.95 ? 2000 + Math.random() * 1000 : 0;
    const microwave = Math.random() > 0.97 ? 900 + Math.random() * 300 : 0;
    const washerDryer = Math.random() > 0.85 ? 1800 + Math.random() * 700 : 0;

    const main = fridge + dishWasher + electricSpaceHeater + electricStove + microwave + washerDryer;

    samples.push({
      timestamp,
      main,
      dishWasher,
      electricSpaceHeater,
      electricStove,
      fridge,
      microwave,
      washerDryer,
      userId: user.id,
    });
  }

  await prisma.timeSeriesSample.createMany({
    data: samples,
  });

  console.log(`✅ Created ${samples.length} time series samples`);

  // Create sample appliance estimates
  const recentSamples = await prisma.timeSeriesSample.findMany({
    take: 10,
    orderBy: { timestamp: 'desc' },
  });

  const estimates = recentSamples.map((sample) => ({
    timestamp: sample.timestamp,
    dishWasherPower: sample.dishWasher * (0.9 + Math.random() * 0.2), // Add some estimation error
    spaceHeaterPower: sample.electricSpaceHeater * (0.9 + Math.random() * 0.2),
    stovePower: sample.electricStove * (0.9 + Math.random() * 0.2),
    fridgePower: sample.fridge * (0.9 + Math.random() * 0.2),
    microwavePower: sample.microwave * (0.9 + Math.random() * 0.2),
    washerDryerPower: sample.washerDryer * (0.9 + Math.random() * 0.2),
    totalEstimated: sample.main * (0.95 + Math.random() * 0.1),
    actualMain: sample.main,
    modelVersionId: initialModel.id,
    userId: user.id,
  }));

  await prisma.applianceEstimate.createMany({
    data: estimates,
  });

  console.log(`✅ Created ${estimates.length} appliance estimates`);

  // Create a sample model update
  await prisma.modelUpdate.create({
    data: {
      clientId: user.id,
      roundId: 1,
      numSamples: 1000,
      deltaWeightsPath: '/models/updates/client_1_round_1.pth',
      loss: 0.12,
      accuracy: 0.88,
      status: 'aggregated',
      modelVersionId: initialModel.id,
      userId: user.id,
    },
  });

  console.log('✅ Created sample model update');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
