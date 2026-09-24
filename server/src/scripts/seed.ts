import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { seedProblems } from '../modules/problems/problem.seed.js';

async function runSeed() {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDatabase();

    console.log('[Seed] Seeding problems...');
    const result = await seedProblems();
    console.log(
      `[Seed] Success! Seeded/Updated ${result.seededCount} problems. Total in DB: ${result.totalCount}.`
    );

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Failed to seed database:', error);
    process.exit(1);
  }
}

runSeed();
