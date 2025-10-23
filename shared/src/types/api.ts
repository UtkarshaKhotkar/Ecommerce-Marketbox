import { z } from 'zod';

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  errors: z.array(z.object({
    field: z.string().optional(),
    message: z.string()
  })).optional()
});

export const PaginatedResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0)
  }),
  message: z.string().optional()
});

export const AuthResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    user: z.any(),
    accessToken: z.string(),
    refreshToken: z.string()
  }),
  message: z.string().optional()
});

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
};

export type PaginatedResponse<T = any> = {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
};

export type AuthResponse = z.infer<typeof AuthResponseSchema>;