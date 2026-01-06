export interface Category {
  id: string;
  title: string;
  description: string;
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
}

export interface EditCategoryVars {
  id: string;
  data: CategoryUpdate;
}
