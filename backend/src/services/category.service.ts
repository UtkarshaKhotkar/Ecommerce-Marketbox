import { Repository } from 'typeorm';
import { AppDataSource } from '@/database/data-source';
import { Category } from '@/models/Category';
import { AppError } from '@/middleware/error-handler';
import { 
  HTTP_STATUS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  CreateCategory, 
  UpdateCategory
} from '@ecommerce/shared';

export class CategoryService {
  private categoryRepository: Repository<Category>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  async getCategories() {
    return await this.categoryRepository.find({
      where: { isActive: true },
      relations: ['parent', 'children'],
      order: { sortOrder: 'ASC', name: 'ASC' }
    });
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id, isActive: true },
      relations: ['parent', 'children', 'products']
    });

    if (!category) {
      throw new AppError(ERROR_MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return category;
  }

  async createCategory(categoryData: CreateCategory) {
    const category = this.categoryRepository.create(categoryData);
    await this.categoryRepository.save(category);

    return {
      category,
      message: 'Category created successfully'
    };
  }

  async updateCategory(id: string, updateData: UpdateCategory) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new AppError(ERROR_MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    Object.assign(category, updateData);
    await this.categoryRepository.save(category);

    return {
      category,
      message: 'Category updated successfully'
    };
  }

  async deleteCategory(id: string) {
    const category = await this.categoryRepository.findOne({ 
      where: { id },
      relations: ['products', 'children']
    });

    if (!category) {
      throw new AppError(ERROR_MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (category.products.length > 0) {
      throw new AppError('Cannot delete category with products', HTTP_STATUS.BAD_REQUEST);
    }

    if (category.children.length > 0) {
      throw new AppError('Cannot delete category with subcategories', HTTP_STATUS.BAD_REQUEST);
    }

    await this.categoryRepository.remove(category);

    return {
      message: 'Category deleted successfully'
    };
  }
}