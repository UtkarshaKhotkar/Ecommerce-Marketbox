import { AppDataSource } from '../data-source';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { User } from '@/models/User';
import { ProductStatus, UserRole } from '@ecommerce/shared';
import { logger } from '@/utils/logger';

export async function seedProducts() {
  const productRepository = AppDataSource.getRepository(Product);
  const categoryRepository = AppDataSource.getRepository(Category);
  const userRepository = AppDataSource.getRepository(User);
  
  // Check if products already exist
  const existingCount = await productRepository.count();
  if (existingCount > 0) {
    logger.info('Products already exist, skipping seed');
    return;
  }

  // Get categories and seller
  const categories = await categoryRepository.find();
  const seller = await userRepository.findOne({ where: { role: UserRole.SELLER } });
  
  if (!seller || categories.length === 0) {
    logger.warn('Cannot seed products: missing categories or seller');
    return;
  }

  const products = [
    {
      name: 'iPhone 15 Pro',
      description: 'Latest iPhone with advanced camera system and A17 Pro chip',
      price: 999.99,
      compareAtPrice: 1099.99,
      sku: 'IPHONE15PRO',
      inventory: 50,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/iphone15pro.jpg'],
      categoryId: categories.find(c => c.slug === 'electronics')?.id || categories[0].id,
      sellerId: seller.id,
      tags: ['smartphone', 'apple', 'premium'],
      weight: 0.221
    },
    {
      name: 'MacBook Air M2',
      description: 'Lightweight laptop with M2 chip and all-day battery life',
      price: 1199.99,
      sku: 'MACBOOKAIRM2',
      inventory: 25,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/macbookair.jpg'],
      categoryId: categories.find(c => c.slug === 'electronics')?.id || categories[0].id,
      sellerId: seller.id,
      tags: ['laptop', 'apple', 'portable'],
      weight: 1.24
    },
    {
      name: 'Nike Air Max 270',
      description: 'Comfortable running shoes with Max Air cushioning',
      price: 149.99,
      compareAtPrice: 179.99,
      sku: 'NIKEAIRMAX270',
      inventory: 100,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/nikeairmax.jpg'],
      categoryId: categories.find(c => c.slug === 'clothing')?.id || categories[1].id,
      sellerId: seller.id,
      tags: ['shoes', 'nike', 'running', 'sports'],
      weight: 0.8
    },
    {
      name: 'The Great Gatsby',
      description: 'Classic American novel by F. Scott Fitzgerald',
      price: 12.99,
      sku: 'GREATGATSBY',
      inventory: 200,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/greatgatsby.jpg'],
      categoryId: categories.find(c => c.slug === 'books')?.id || categories[3].id,
      sellerId: seller.id,
      tags: ['book', 'classic', 'literature'],
      weight: 0.3
    },
    {
      name: 'Yoga Mat Premium',
      description: 'High-quality yoga mat with excellent grip and cushioning',
      price: 49.99,
      sku: 'YOGAMATPREM',
      inventory: 75,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/yogamat.jpg'],
      categoryId: categories.find(c => c.slug === 'sports-outdoors')?.id || categories[4].id,
      sellerId: seller.id,
      tags: ['yoga', 'fitness', 'exercise'],
      weight: 1.2
    }
  ];

  for (const productData of products) {
    const product = productRepository.create(productData);
    await productRepository.save(product);
  }

  logger.info(`Seeded ${products.length} products`);
}