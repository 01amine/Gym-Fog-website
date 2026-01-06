import apiClient from './client';
import { Product } from '../types';

export interface GetProductsParams {
  title?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  brand?: string;
  skip?: number;
  limit?: number;
}

export async function getProducts(params?: GetProductsParams): Promise<Product[]> {
  const searchParams = new URLSearchParams();

  if (params) {
    if (params.title) searchParams.append('title', params.title);
    if (params.category) searchParams.append('category', params.category);
    if (params.min_price !== undefined) searchParams.append('min_price', params.min_price.toString());
    if (params.max_price !== undefined) searchParams.append('max_price', params.max_price.toString());
    if (params.brand) searchParams.append('brand', params.brand);
    if (params.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
  }

  const queryString = searchParams.toString();
  const endpoint = `/products/${queryString ? `?${queryString}` : ''}`;

  return apiClient<Product[]>(endpoint);
}

export async function getProductById(productId: string): Promise<Product> {
  return apiClient<Product>(`/products/${productId}`);
}
