import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/api/category';
import { Category, CreateCategoryVars, EditCategoryVars } from '@/lib/types/category';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../use-toast';

export function useGetCategories() {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useGetCategoryById(id: string) {
  return useQuery<Category, Error>({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(id),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Category, Error, CreateCategoryVars>({
    mutationFn: (vars) => createCategory(vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success!',
        description: 'Category has been created successfully.',
      });
    },
    onError: (error) => {
      console.error('Failed to create category:', error);
      toast({
        title: 'Error!',
        description: 'Failed to create category. Please try again.',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Category, Error, EditCategoryVars>({
    mutationFn: (vars) => updateCategory(vars.id, vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success!',
        description: 'Category has been updated successfully.',
      });
    },
    onError: (error) => {
      console.error('Failed to update category:', error);
      toast({
        title: 'Error!',
        description: 'Failed to update category. Please try again.',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success!',
        description: 'Category has been deleted successfully.',
      });
    },
    onError: (error) => {
      console.error('Failed to delete category:', error);
      toast({
        title: 'Error!',
        description: 'Failed to delete category. Please try again.',
        variant: 'destructive',
      });
    },
  });
}
