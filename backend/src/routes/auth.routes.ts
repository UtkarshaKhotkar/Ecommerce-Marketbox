import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validation';
import { 
  CreateUserSchema, 
  LoginSchema, 
  UpdateUserSchema 
} from '@ecommerce/shared';
import { z } from 'zod';

const router = Router();
const authController = new AuthController();

// Validation schemas
const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1)
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8)
});

// Public routes
router.post('/register', validate({ body: CreateUserSchema }), authController.register);
router.post('/login', validate({ body: LoginSchema }), authController.login);
router.post('/refresh', validate({ body: refreshTokenSchema }), authController.refreshToken);

// Protected routes
router.use(authenticate);
router.get('/profile', authController.getProfile);
router.put('/profile', validate({ body: UpdateUserSchema }), authController.updateProfile);
router.post('/change-password', validate({ body: changePasswordSchema }), authController.changePassword);
router.post('/logout', authController.logout);

export default router;