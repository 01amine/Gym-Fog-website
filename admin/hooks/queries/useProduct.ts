import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/api/product';
import { Product, CreateProductVars, EditProductVars } from '@/lib/types/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../use-toast';

interface GetProductsParams {
  title?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  brand?: string;
  skip?: number;
  limit?: number;
}

export function useGetProducts(params?: GetProductsParams) {
  return useQuery<Product[], Error>({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useGetProductById(id: string) {
  return useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Product, Error, CreateProductVars>({
    mutationFn: (vars) => createProduct(vars.data, vars.images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success!',
        description: 'Product has been created successfully.',
      });
    },
    onError: (error) => {
      console.error('Failed to create product:', error);
      toast({
        title: 'Error!',
        description: 'Failed to create product. Please try again.',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Product, Error, EditProductVars>({
    mutationFn: (vars) => updateProduct(vars.id, vars.data, vars.images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success!',
        description: 'Product has been updated successfully.',
      });
    },
    onError: (error) => {
      console.error('Failed to update product:', error);
      toast({
        title: 'Error!',
        description: 'Failed to update product. Please try again.',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success!',
        description: 'Product has been deleted successfully.',
      });
    },
    onError: (error) => {
      console.error('Failed to delete product:', error);
      toast({
        title: 'Error!',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    },
  });
}
