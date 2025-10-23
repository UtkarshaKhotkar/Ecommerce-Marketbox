import { Router } from 'express';
import { ProductController } from '@/controllers/product.controller';
import { authenticate, authorize, optionalAuth } from '@/middleware/auth';
import { validate, validateUUID } from '@/middleware/validation';
import { 
  CreateProductSchema, 
  UpdateProductSchema, 
  ProductQuerySchema,
  UserRole 
} from '@ecommerce/shared';

const router = Router();
const productController = new ProductController();

// Public routes
router.get('/', validate({ query: ProductQuerySchema }), optionalAuth, productController.getProducts);
router.get('/:id', validateUUID(), optionalAuth, productController.getProductById);

// Protected routes
router.use(authenticate);
router.post('/', 
  authorize(UserRole.SELLER, UserRole.ADMIN), 
  validate({ body: CreateProductSchema }), 
  productController.createProduct
);
router.put('/:id', 
  validateUUID(), 
  authorize(UserRole.SELLER, UserRole.ADMIN), 
  validate({ body: UpdateProductSchema }), 
  productController.updateProduct
);
router.delete('/:id', 
  validateUUID(), 
  authorize(UserRole.SELLER, UserRole.ADMIN), 
  productController.deleteProduct
);

export default router;