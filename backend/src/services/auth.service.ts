import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '@/database/data-source';
import { User } from '@/models/User';
import { config } from '@/config/environment';
import { AppError } from '@/middleware/error-handler';
import { 
  HTTP_STATUS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  CreateUser, 
  LoginRequest,
  UserRole 
} from '@ecommerce/shared';
import { logger } from '@/utils/logger';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(userData: CreateUser) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new AppError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }

    // Create new user
    const user = this.userRepository.create({
      ...userData,
      id: uuidv4(),
      emailVerificationToken: uuidv4()
    });

    await this.userRepository.save(user);

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user.id);

    logger.info(`User registered: ${user.email}`);

    return {
      user,
      accessToken,
      refreshToken,
      message: SUCCESS_MESSAGES.USER_CREATED
    };
  }

  async login(loginData: LoginRequest) {
    // Find user with password
    const user = await this.userRepository.findOne({
      where: { email: loginData.email },
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'role', 'isEmailVerified']
    });

    if (!user) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(loginData.password);
    if (!isPasswordValid) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    // Update last login
    user.lastLogin = new Date();
    await this.userRepository.save(user);

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user.id);

    logger.info(`User logged in: ${user.email}`);

    return {
      user,
      accessToken,
      refreshToken,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESSFUL
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret) as { userId: string };
      
      const user = await this.userRepository.findOne({
        where: { id: decoded.userId }
      });

      if (!user) {
        throw new AppError(ERROR_MESSAGES.TOKEN_INVALID, HTTP_STATUS.UNAUTHORIZED);
      }

      const { accessToken, refreshToken } = this.generateTokens(user.id);

      return {
        user,
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw new AppError(ERROR_MESSAGES.TOKEN_INVALID, HTTP_STATUS.UNAUTHORIZED);
    }
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return user;
  }

  async updateProfile(userId: string, updateData: Partial<User>) {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    Object.assign(user, updateData);
    await this.userRepository.save(user);

    logger.info(`User profile updated: ${user.email}`);

    return {
      user,
      message: SUCCESS_MESSAGES.USER_UPDATED
    };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'password']
    });

    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    user.password = newPassword;
    await user.hashPassword();
    await this.userRepository.save(user);

    logger.info(`Password changed for user: ${user.email}`);

    return {
      message: 'Password changed successfully'
    };
  }

  private generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { userId },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const refreshToken = jwt.sign(
      { userId },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    return { accessToken, refreshToken };
  }
}