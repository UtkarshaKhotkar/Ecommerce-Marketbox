import { AppDataSource } from '../data-source';
import { User } from '@/models/User';
import { UserRole } from '@ecommerce/shared';
import { logger } from '@/utils/logger';

export async function seedUsers() {
  const userRepository = AppDataSource.getRepository(User);
  
  // Check if users already exist
  const existingCount = await userRepository.count();
  if (existingCount > 0) {
    logger.info('Users already exist, skipping seed');
    return;
  }

  const users = [
    {
      email: 'admin@ecommerce.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isEmailVerified: true
    },
    {
      email: 'seller@ecommerce.com',
      password: 'Seller123!',
      firstName: 'Seller',
      lastName: 'User',
      role: UserRole.SELLER,
      isEmailVerified: true
    },
    {
      email: 'customer@ecommerce.com',
      password: 'Customer123!',
      firstName: 'Customer',
      lastName: 'User',
      role: UserRole.USER,
      isEmailVerified: true
    }
  ];

  for (const userData of users) {
    const user = userRepository.create(userData);
    await userRepository.save(user);
  }

  logger.info(`Seeded ${users.length} users`);
}