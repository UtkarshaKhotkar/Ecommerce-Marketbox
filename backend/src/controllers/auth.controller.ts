import { Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { AuthRequest } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/error-handler';
import { HTTP_STATUS } from '@ecommerce/shared';

export class AuthController {
  private authService = new AuthService();

  register = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.authService.register(req.body);
    
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: result,
      message: result.message
    });
  });

  login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.authService.login(req.body);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: result.message
    });
  });

  refreshToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { refreshToken } = req.body;
    const result = await this.authService.refreshToken(refreshToken);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result
    });
  });

  getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await this.authService.getProfile(req.user!.id);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: user
    });
  });

  updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.authService.updateProfile(req.user!.id, req.body);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result.user,
      message: result.message
    });
  });

  changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const result = await this.authService.changePassword(
      req.user!.id,
      currentPassword,
      newPassword
    );
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: result.message
    });
  });

  logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    // In a real app, you might want to blacklist the token
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Logged out successfully'
    });
  });
}