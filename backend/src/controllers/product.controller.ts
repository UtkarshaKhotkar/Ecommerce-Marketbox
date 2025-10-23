import { Response } from 'express';
import { ProductService } from '@/services/product.service';
import { AuthRequest } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/error-handler';
import { HTTP_STATUS } from '@ecommerce/shared';

export class ProductController {
  private productService = new ProductService();

  getProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.productService.getProducts(req.query, req.user);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result.products,
      pagination: result.pagination
    });
  });

  getProductById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const product = await this.productService.getProductById(req.params.id, req.user);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: product
    });
  });

  createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.productService.createProduct(req.body, req.user!.id);
    
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: result.product,
      message: result.message
    });
  });

  updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.productService.updateProduct(req.params.id, req.body, req.user!);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result.product,
      message: result.message
    });
  });

  deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.productService.deleteProduct(req.params.id, req.user!);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: result.message
    });
  });
}