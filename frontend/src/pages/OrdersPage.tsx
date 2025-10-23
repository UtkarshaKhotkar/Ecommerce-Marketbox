import React from 'react'

export function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">No Orders Yet</h2>
        <p className="text-gray-600">Your order history will appear here once you make a purchase.</p>
      </div>
    </div>
  )
}