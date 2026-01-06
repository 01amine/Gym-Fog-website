export interface Category {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
}

export interface CategoryCreate {
  title: string;
  description: string;
}

export interface CategoryUpdate {
  title?: string;
  description?: string;
}

export interface CreateCategoryVars {
  data: CategoryCreate;
  image?: File;
}

export interface EditCategoryVars {
  id: string;
  data: CategoryUpdate;
  image?: File;
}
