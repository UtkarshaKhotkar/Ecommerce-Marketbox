import { api } from './api'
import { Product, ProductQuery, PaginatedResponse, ApiResponse } from '@ecommerce/shared'

export const productService = {
  async getProducts(query: Partial<ProductQuery> = {}): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams()
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })

    const response = await api.get<PaginatedResponse<Product>>(`/products?${params}`)
    return response.data
  },

  async getProductById(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`)
    return response.data.data
  },

  async searchProducts(searchTerm: string, filters: Partial<ProductQuery> = {}): Promise<PaginatedResponse<Product>> {
    return this.getProducts({
      ...filters,
      search: searchTerm,
    })
  },

  async getProductsByCategory(categoryId: string, query: Partial<ProductQuery> = {}): Promise<PaginatedResponse<Product>> {
    return this.getProducts({
      ...query,
      categoryId,
    })
  },
}