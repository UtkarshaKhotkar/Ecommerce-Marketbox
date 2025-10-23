import { Repository, SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '@/database/data-source';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { AppError } from '@/middleware/error-handler';
import { 
  HTTP_STATUS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  CreateProduct, 
  UpdateProduct,
  ProductQuery,
  ProductStatus,
  UserRole,
  PAGINATION_DEFAULTS
} from '@ecommerce/shared';
import { logger } from '@/utils/logger';

export class ProductService {
  private productRepository: Repository<Product>;

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
  }

  async getProducts(query: ProductQuery, user?: User) {
    const {
      page = PAGINATION_DEFAULTS.PAGE,
      limit = PAGINATION_DEFAULTS.LIMIT,
      search,
      categoryId,
      minPrice,
      maxPrice,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.seller', 'seller');

    // Apply filters based on user role
    if (!user || user.role === UserRole.USER) {
      queryBuilder.andWhere('product.status = :status', { status: ProductStatus.ACTIVE });
    } else if (user.role === UserRole.SELLER) {
      queryBuilder.andWhere(
        '(product.status = :activeStatus OR product.sellerId = :sellerId)',
        { activeStatus: ProductStatus.ACTIVE, sellerId: user.id }
      );
    }
    // Admin can see all products

    // Apply search
    if (search) {
      queryBuilder.andWhere(
        '(product.name LIKE :search OR product.description LIKE :search OR product.tags LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply filters
    if (categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (status && user && user.role !== UserRole.USER) {
      queryBuilder.andWhere('product.status = :filterStatus', { filterStatus: status });
    }

    // Apply sorting
    queryBuilder.orderBy(`product.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getProductById(id: string, user?: User) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.seller', 'seller')
      .where('product.id = :id', { id });

    // Apply visibility rules
    if (!user || user.role === UserRole.USER) {
      queryBuilder.andWhere('product.status = :status', { status: ProductStatus.ACTIVE });
    } else if (user.role === UserRole.SELLER) {
      queryBuilder.andWhere(
        '(product.status = :activeStatus OR product.sellerId = :sellerId)',
        { activeStatus: ProductStatus.ACTIVE, sellerId: user.id }
      );
    }

    const product = await queryBuilder.getOne();

    if (!product) {
      throw new AppError(ERROR_MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Increment view count for active products
    if (product.status === ProductStatus.ACTIVE) {
      await this.productRepository.increment({ id }, 'viewCount', 1);
    }

    return product;
  }

  async createProduct(productData: CreateProduct, sellerId: string) {
    const product = this.productRepository.create({
      ...productData,
      sellerId
    });

    await this.productRepository.save(product);

    logger.info(`Product created: ${product.name} by seller ${sellerId}`);

    return {
      product,
      message: SUCCESS_MESSAGES.PRODUCT_CREATED
    };
  }

  async updateProduct(id: string, updateData: UpdateProduct, user: User) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['seller']
    });

    if (!product) {
      throw new AppError(ERROR_MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check permissions
    if (user.role === UserRole.SELLER && product.sellerId !== user.id) {
      throw new AppError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    Object.assign(product, updateData);
    await this.productRepository.save(product);

    logger.info(`Product updated: ${product.name} by user ${user.id}`);

    return {
      product,
      message: SUCCESS_MESSAGES.PRODUCT_UPDATED
    };
  }

  async deleteProduct(id: string, user: User) {
    const product = await this.productRepository.findOne({
      where: { id }
    });

    if (!product) {
      throw new AppError(ERROR_MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check permissions
    if (user.role === UserRole.SELLER && product.sellerId !== user.id) {
      throw new AppError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    await this.productRepository.remove(product);

    logger.info(`Product deleted: ${product.name} by user ${user.id}`);

    return {
      message: SUCCESS_MESSAGES.PRODUCT_DELETED
    };
  }
}