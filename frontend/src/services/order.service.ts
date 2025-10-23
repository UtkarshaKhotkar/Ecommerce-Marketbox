import { api } from './api'
import { Order, CreateOrder, ApiResponse } from '@ecommerce/shared'

export const orderService = {
  async getUserOrders(): Promise<Order[]> {
    const response = await api.get<ApiResponse<Order[]>>('/orders')
    return response.data.data
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`)
    return response.data.data
  },

  async createOrder(orderData: CreateOrder): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>('/orders', orderData)
    return response.data.data
  },
}