import { DataSource } from 'typeorm';
import { config } from '@/config/environment';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { Order } from '@/models/Order';
import { OrderItem } from '@/models/OrderItem';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './ecommerce.db',
  synchronize: config.nodeEnv === 'development',
  logging: config.nodeEnv === 'development',
  entities: [User, Product, Category, Order, OrderItem],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: ['src/database/subscribers/*.ts']
});