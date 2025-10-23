import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import orderRoutes from './order.routes';
import paymentRoutes from './payment.routes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    name: 'E-Commerce API',
    version: '1.0.0',
    description: 'Production-quality e-commerce platform API',
    endpoints: {
      auth: {
        'POST /auth/register': 'Register a new user',
        'POST /auth/login': 'Login user',
        'POST /auth/refresh': 'Refresh access token',
        'GET /auth/profile': 'Get user profile (protected)',
        'PUT /auth/profile': 'Update user profile (protected)',
        'POST /auth/change-password': 'Change password (protected)',
        'POST /auth/logout': 'Logout user (protected)'
      },
      products: {
        'GET /products': 'Get all products',
        'GET /products/:id': 'Get product by ID',
        'POST /products': 'Create product (seller/admin)',
        'PUT /products/:id': 'Update product (seller/admin)',
        'DELETE /products/:id': 'Delete product (seller/admin)'
      },
      categories: {
        'GET /categories': 'Get all categories',
        'GET /categories/:id': 'Get category by ID',
        'POST /categories': 'Create category (admin)',
        'PUT /categories/:id': 'Update category (admin)',
        'DELETE /categories/:id': 'Delete category (admin)'
      },
      orders: {
        'GET /orders': 'Get user orders (protected)',
        'GET /orders/:id': 'Get order by ID (protected)',
        'POST /orders': 'Create order (protected)',
        'PUT /orders/:id/status': 'Update order status (seller/admin)'
      },
      payments: {
        'POST /payments/create-intent': 'Create payment intent',
        'POST /payments/confirm': 'Confirm payment',
        'POST /payments/webhook': 'Stripe webhook'
      }
    }
  });
});

export default router;