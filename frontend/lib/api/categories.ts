import apiClient from './client';
import { Category } from '../types';

export async function getCategories(): Promise<Category[]> {
  return apiClient<Category[]>('/categories/');
}

export async function getCategoryById(categoryId: string): Promise<Category> {
  return apiClient<Category>(`/categories/${categoryId}`);
}
