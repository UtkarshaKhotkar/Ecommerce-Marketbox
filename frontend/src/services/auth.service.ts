import { api } from './api'
import { User, LoginRequest, CreateUser, ApiResponse, AuthResponse } from '@ecommerce/shared'

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse['data']> {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    return response.data.data
  },

  async register(userData: CreateUser): Promise<AuthResponse['data']> {
    const response = await api.post<AuthResponse>('/auth/register', userData)
    return response.data.data
  },

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/profile')
    return response.data.data
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.put<ApiResponse<User>>('/auth/profile', userData)
    return response.data.data
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    })
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse['data']> {
    const response = await api.post<AuthResponse>('/auth/refresh', { refreshToken })
    return response.data.data
  },
}