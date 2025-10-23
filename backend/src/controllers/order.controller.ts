import { Response } from 'express';
import { OrderService } from '@/services/order.service';
import { AuthRequest } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/error-handler';
import { HTTP_STATUS } from '@ecommerce/shared';

export class OrderController {
  private orderService = new OrderService();

  getUserOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const orders = await this.orderService.getUserOrders(req.user!.id);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: orders
    });
  });

  getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await this.orderService.getOrderById(req.params.id, req.user!);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: order
    });
  });

  createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.orderService.createOrder(req.body, req.user!.id);
    
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: result.order,
      message: result.message
    });
  });

  updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.orderService.updateOrderStatus(req.params.id, req.body, req.user!);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result.order,
      message: result.message
    });
  });
}