import { Router } from 'express';
import { CategoryController } from '@/controllers/category.controller';
import { authenticate, authorize } from '@/middleware/auth';
import { validate, validateUUID } from '@/middleware/validation';
import { 
  CreateCategorySchema, 
  UpdateCategorySchema,
  UserRole 
} from '@ecommerce/shared';

const router = Router();
const categoryController = new CategoryController();

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', validateUUID(), categoryController.getCategoryById);

// Protected routes (admin only)
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

router.post('/', validate({ body: CreateCategorySchema }), categoryController.createCategory);
router.put('/:id', validateUUID(), validate({ body: UpdateCategorySchema }), categoryController.updateCategory);
router.delete('/:id', validateUUID(), categoryController.deleteCategory);

export default router;