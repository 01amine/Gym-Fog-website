import apiClient from './client';
import { Category } from '../types';

// Helper function to construct category image URL
export const getCategoryImageUrl = (imageId: string | null): string | null => {
  if (!imageId) return null;
  if (imageId.startsWith('http://') || imageId.startsWith('https://') || imageId.startsWith('/')) {
    return imageId;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${baseUrl}/categories/images/${imageId}`;
};

// Transform category to have full image URL
const transformCategory = (category: Category): Category => ({
  ...category,
  image_url: getCategoryImageUrl(category.image_url),
});

export async function getCategories(): Promise<Category[]> {
  const categories = await apiClient<Category[]>('/categories/');
  return categories.map(transformCategory);
}

export async function getCategoryById(categoryId: string): Promise<Category> {
  const category = await apiClient<Category>(`/categories/${categoryId}`);
  return transformCategory(category);
}
