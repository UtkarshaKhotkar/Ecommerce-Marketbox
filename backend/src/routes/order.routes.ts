import { Router } from 'express';
import { OrderController } from '@/controllers/order.controller';
import { authenticate, authorize } from '@/middleware/auth';
import { validate, validateUUID } from '@/middleware/validation';
import { 
  CreateOrderSchema, 
  UpdateOrderStatusSchema,
  UserRole 
} from '@ecommerce/shared';

const router = Router();
const orderController = new OrderController();

// All routes require authentication
router.use(authenticate);

router.get('/', orderController.getUserOrders);
router.get('/:id', validateUUID(), orderController.getOrderById);
router.post('/', validate({ body: CreateOrderSchema }), orderController.createOrder);

// Admin/Seller routes
router.put('/:id/status', 
  validateUUID(), 
  authorize(UserRole.SELLER, UserRole.ADMIN), 
  validate({ body: UpdateOrderStatusSchema }), 
  orderController.updateOrderStatus
);

export default router;