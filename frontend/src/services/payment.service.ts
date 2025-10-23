import { api } from './api'
import { ApiResponse } from '@ecommerce/shared'

interface PaymentIntentResponse {
  clientSecret: string
  paymentIntentId: string
}

interface ConfirmPaymentResponse {
  order: any
  message: string
}

export const paymentService = {
  async createPaymentIntent(orderId: string, amount: number): Promise<PaymentIntentResponse> {
    const response = await api.post<ApiResponse<PaymentIntentResponse>>('/payments/create-intent', {
      orderId,
      amount,
    })
    return response.data.data
  },

  async confirmPayment(paymentIntentId: string, orderId: string): Promise<ConfirmPaymentResponse> {
    const response = await api.post<ApiResponse<ConfirmPaymentResponse>>('/payments/confirm', {
      paymentIntentId,
      orderId,
    })
    return response.data.data
  },
}