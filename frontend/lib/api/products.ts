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

// Helper function to construct product image URL
export const getProductImageUrl = (imageId: string): string => {
  if (!imageId) return '/placeholder.jpg';
  if (imageId.startsWith('http://') || imageId.startsWith('https://') || imageId.startsWith('/')) {
    return imageId;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${baseUrl}/products/images/${imageId}`;
};

// Transform product to have full image URLs
const transformProduct = (product: Product): Product => ({
  ...product,
  image_urls: product.image_urls.map(getProductImageUrl),
});

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

  const products = await apiClient<Product[]>(endpoint);
  return products.map(transformProduct);
}

export async function getProductById(productId: string): Promise<Product> {
  const product = await apiClient<Product>(`/products/${productId}`);
  return transformProduct(product);
}
