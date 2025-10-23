import { Request, Response } from 'express';
import { PaymentService } from '@/services/payment.service';
import { AuthRequest } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/error-handler';
import { HTTP_STATUS } from '@ecommerce/shared';

export class PaymentController {
  private paymentService = new PaymentService();

  createPaymentIntent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.paymentService.createPaymentIntent(req.body, req.user!.id);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result
    });
  });

  confirmPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.paymentService.confirmPayment(req.body, req.user!.id);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: result.message
    });
  });

  handleWebhook = asyncHandler(async (req: Request, res: Response) => {
    await this.paymentService.handleStripeWebhook(req.body, req.headers['stripe-signature'] as string);
    
    res.status(HTTP_STATUS.OK).json({ received: true });
  });
}