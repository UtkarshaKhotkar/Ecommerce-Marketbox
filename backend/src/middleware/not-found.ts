import { Request, Response } from 'express';
import { HTTP_STATUS, ERROR_MESSAGES } from '@ecommerce/shared';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: ERROR_MESSAGES.NOT_FOUND
  });
};