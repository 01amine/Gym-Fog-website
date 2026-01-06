import client from './clients';
import { API_ENDPOINTS } from '../const/endpoint';
import { Category, CategoryCreate, CategoryUpdate } from '../types/category';

export const getCategories = async (): Promise<Category[]> => {
  const response = await client.get<Category[]>(API_ENDPOINTS.CATEGORIES.ROOT);
  return response.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await client.get<Category>(API_ENDPOINTS.CATEGORIES.BY_ID(id));
  return response.data;
};

export const createCategory = async (
  data: CategoryCreate,
  image?: File
): Promise<Category> => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);

  if (image) {
    formData.append('image', image);
  }

  const response = await client.post<Category>(API_ENDPOINTS.CATEGORIES.ROOT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateCategory = async (
  id: string,
  data: CategoryUpdate,
  image?: File
): Promise<Category> => {
  const formData = new FormData();

  if (data.title) {
    formData.append('title', data.title);
  }
  if (data.description) {
    formData.append('description', data.description);
  }
  if (image) {
    formData.append('image', image);
  }

  const response = await client.patch<Category>(API_ENDPOINTS.CATEGORIES.BY_ID(id), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteCategory = async (id: string): Promise<{ message: string; id: string }> => {
  const response = await client.delete<{ message: string; id: string }>(
    API_ENDPOINTS.CATEGORIES.BY_ID(id)
  );
  return response.data;
};
