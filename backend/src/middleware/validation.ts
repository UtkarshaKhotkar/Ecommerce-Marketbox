import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from './error-handler';
import { HTTP_STATUS } from '@ecommerce/shared';

export const validate = (schema: {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateUUID = (paramName: string = 'id') => {
  const uuidSchema = z.object({
    [paramName]: z.string().uuid()
  });
  
  return validate({ params: uuidSchema });
};