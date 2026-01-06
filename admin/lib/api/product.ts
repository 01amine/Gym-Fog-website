import client from './clients';
import { API_ENDPOINTS } from '../const/endpoint';
import { Product, ProductCreate, ProductUpdate } from '../types/product';

interface GetProductsParams {
  title?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  brand?: string;
  skip?: number;
  limit?: number;
}

export const getProducts = async (params?: GetProductsParams): Promise<Product[]> => {
  const response = await client.get<Product[]>(API_ENDPOINTS.PRODUCTS.ROOT, {
    params,
  });
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await client.get<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  return response.data;
};

export const createProduct = async (
  data: ProductCreate,
  images?: File[]
): Promise<Product> => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('category', data.category);
  formData.append('price_dzd', data.price_dzd.toString());

  if (data.description) {
    formData.append('description', data.description);
  }
  if (data.stock_quantity !== undefined) {
    formData.append('stock_quantity', data.stock_quantity.toString());
  }
  if (data.brand) {
    formData.append('brand', data.brand);
  }
  if (data.sizes && data.sizes.length > 0) {
    formData.append('sizes', data.sizes.join(','));
  }
  if (data.colors && data.colors.length > 0) {
    formData.append('colors', data.colors.join(','));
  }
  if (data.weight !== undefined) {
    formData.append('weight', data.weight.toString());
  }

  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await client.post<Product>(API_ENDPOINTS.PRODUCTS.ROOT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateProduct = async (
  id: string,
  data: ProductUpdate,
  images?: File[]
): Promise<Product> => {
  const formData = new FormData();

  if (data.title) {
    formData.append('title', data.title);
  }
  if (data.description !== undefined) {
    formData.append('description', data.description);
  }
  if (data.category) {
    formData.append('category', data.category);
  }
  if (data.price_dzd !== undefined) {
    formData.append('price_dzd', data.price_dzd.toString());
  }
  if (data.stock_quantity !== undefined) {
    formData.append('stock_quantity', data.stock_quantity.toString());
  }
  if (data.brand !== undefined) {
    formData.append('brand', data.brand);
  }
  if (data.sizes) {
    formData.append('sizes', data.sizes.join(','));
  }
  if (data.colors) {
    formData.append('colors', data.colors.join(','));
  }
  if (data.weight !== undefined) {
    formData.append('weight', data.weight.toString());
  }

  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await client.patch<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProduct = async (id: string): Promise<{ message: string; id: string }> => {
  const response = await client.delete<{ message: string; id: string }>(
    API_ENDPOINTS.PRODUCTS.BY_ID(id)
  );
  return response.data;
};
