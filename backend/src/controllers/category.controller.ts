import { Response } from 'express';
import { CategoryService } from '@/services/category.service';
import { AuthRequest } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/error-handler';
import { HTTP_STATUS } from '@ecommerce/shared';

export class CategoryController {
  private categoryService = new CategoryService();

  getCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
    const categories = await this.categoryService.getCategories();
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: categories
    });
  });

  getCategoryById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const category = await this.categoryService.getCategoryById(req.params.id);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: category
    });
  });

  createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.categoryService.createCategory(req.body);
    
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: result.category,
      message: result.message
    });
  });

  updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.categoryService.updateCategory(req.params.id, req.body);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result.category,
      message: result.message
    });
  });

  deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.categoryService.deleteCategory(req.params.id);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: result.message
    });
  });
}