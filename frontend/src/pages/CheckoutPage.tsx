import React from 'react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/utils/format'

export function CheckoutPage() {
  const { items, total } = useCart()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Checkout Coming Soon</h2>
        <p className="text-gray-600 mb-8">
          The checkout functionality with Stripe integration will be implemented here.
        </p>
        <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between">
                <span>{item.product.name} x{item.quantity}</span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-2 font-semibold">
              <div className="flex justify-between">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}