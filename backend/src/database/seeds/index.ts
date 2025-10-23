import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { seedCategories } from './categories.seed';
import { seedUsers } from './users.seed';
import { seedProducts } from './products.seed';
import { logger } from '@/utils/logger';

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    logger.info('Database connection established for seeding');

    // Run seeds in order
    await seedCategories();
    await seedUsers();
    await seedProducts();

    logger.info('All seeds completed successfully');
  } catch (error) {
    logger.error('Error running seeds:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeeds();