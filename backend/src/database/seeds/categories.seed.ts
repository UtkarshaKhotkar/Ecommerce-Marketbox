import { AppDataSource } from '../data-source';
import { Category } from '@/models/Category';
import { logger } from '@/utils/logger';

export async function seedCategories() {
  const categoryRepository = AppDataSource.getRepository(Category);
  
  // Check if categories already exist
  const existingCount = await categoryRepository.count();
  if (existingCount > 0) {
    logger.info('Categories already exist, skipping seed');
    return;
  }

  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      sortOrder: 1
    },
    {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel',
      sortOrder: 2
    },
    {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Home improvement and garden supplies',
      sortOrder: 3
    },
    {
      name: 'Books',
      slug: 'books',
      description: 'Books and educational materials',
      sortOrder: 4
    },
    {
      name: 'Sports & Outdoors',
      slug: 'sports-outdoors',
      description: 'Sports equipment and outdoor gear',
      sortOrder: 5
    }
  ];

  for (const categoryData of categories) {
    const category = categoryRepository.create(categoryData);
    await categoryRepository.save(category);
  }

  logger.info(`Seeded ${categories.length} categories`);
}