export interface Product {
  id: string;
  title: string;
  description: string | null;
  image_urls: string[];
  category: string;
  price_dzd: number;
  stock_quantity: number;
  brand: string | null;
  sizes: string[];
  colors: string[];
  weight: number | null;
  created_at: string;
}

export interface ProductCreate {
  title: string;
  description?: string;
  category: string;
  price_dzd: number;
  stock_quantity?: number;
  brand?: string;
  sizes?: string[];
  colors?: string[];
  weight?: number;
}

export interface ProductUpdate {
  title?: string;
  description?: string;
  category?: string;
  price_dzd?: number;
  stock_quantity?: number;
  brand?: string;
  sizes?: string[];
  colors?: string[];
  weight?: number;
}

export interface CreateProductVars {
  data: ProductCreate;
  images?: File[];
}

export interface EditProductVars {
  id: string;
  data: ProductUpdate;
  images?: File[];
}
