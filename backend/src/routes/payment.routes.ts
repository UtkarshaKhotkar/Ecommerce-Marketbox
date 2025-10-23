import { Router } from 'express';
import { PaymentController } from '@/controllers/payment.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validation';
import { z } from 'zod';

const router = Router();
const paymentController = new PaymentController();

// Validation schemas
const createPaymentIntentSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.number().positive()
});

const confirmPaymentSchema = z.object({
  paymentIntentId: z.string(),
  orderId: z.string().uuid()
});

// Protected routes
router.post('/create-intent', 
  authenticate, 
  validate({ body: createPaymentIntentSchema }), 
  paymentController.createPaymentIntent
);

router.post('/confirm', 
  authenticate, 
  validate({ body: confirmPaymentSchema }), 
  paymentController.confirmPayment
);

// Webhook (no auth required)
router.post('/webhook', paymentController.handleWebhook);

export default router;