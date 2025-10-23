import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index
} from 'typeorm';
import { ProductStatus } from '@ecommerce/shared';
import { User } from './User';
import { Category } from './Category';
import { OrderItem } from './OrderItem';

@Entity('products')
@Index(['status', 'createdAt'])
@Index(['categoryId', 'status'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index('idx_product_name')
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'compare_at_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  compareAtPrice?: number;

  @Column({ nullable: true })
  sku?: string;

  @Column({ default: 0 })
  inventory: number;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT
  })
  status: ProductStatus;

  @Column({ type: 'json' })
  images: string[];

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column({ name: 'seller_id' })
  sellerId: string;

  @Column({ type: 'json', default: '[]' })
  tags: string[];

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  weight?: number;

  @Column({ type: 'json', nullable: true })
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'sales_count', default: 0 })
  salesCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => User, user => user.products)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  // Computed properties
  get isOnSale(): boolean {
    return this.compareAtPrice ? this.compareAtPrice > this.price : false;
  }

  get discountPercentage(): number {
    if (!this.compareAtPrice || this.compareAtPrice <= this.price) {
      return 0;
    }
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }

  get isInStock(): boolean {
    return this.inventory > 0;
  }
}