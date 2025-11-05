// src/hooks/use-products.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiInstance } from '../utils/api-instance';
import {
  ProductDto,
  CreateProductCommand,
  ProductComponentDto,
} from '../schemas/product';

// Query keys for cache management
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, string | number | boolean>) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  components: () => ['productComponents'] as const,
};

// Fetch all products
export const useProducts = (options = {}) => {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: async () => {
      const response = await apiInstance.get<ProductDto[]>('/products');
      return response.data;
    },
    ...options,
  });
};

// Fetch a single product by id
export const useProduct = (id: number, options = {}) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const response = await apiInstance.get<ProductDto>(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

// Fetch all product components
export const useProductComponents = (options = {}) => {
  return useQuery({
    queryKey: productKeys.components(),
    queryFn: async () => {
      const response = await apiInstance.get<ProductComponentDto[]>(
        '/product-components'
      );
      return response.data;
    },
    ...options,
  });
};

// Create a new product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: CreateProductCommand) => {
      const response = await apiInstance.post<ProductDto>(
        '/products',
        newProduct
      );
      return response.data;
    },
    onMutate: async (newProduct: CreateProductCommand) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData<ProductDto[]>(
        productKeys.lists()
      );

      // Optimistically update to the new value
      if (previousProducts) {
        const optimisticProduct: ProductDto = {
          id: Date.now(), // Temporary ID
          name: newProduct.name,
          price: newProduct.price,
          productComponentIds: [], // Will be populated by backend
          takeaway: newProduct.takeaway,
        };
        queryClient.setQueryData<ProductDto[]>(productKeys.lists(), [
          ...previousProducts,
          optimisticProduct,
        ]);
      }

      return { previousProducts };
    },
    onError: (_err, _newProduct, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(productKeys.lists(), context.previousProducts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.components() });
    },
  });
};

// Delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiInstance.delete(`/products/${id}`);
      return id;
    },
    onMutate: async (id: number) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData<ProductDto[]>(
        productKeys.lists()
      );

      // Optimistically update to remove the product
      if (previousProducts) {
        queryClient.setQueryData<ProductDto[]>(
          productKeys.lists(),
          previousProducts.filter(product => product.id !== id)
        );
      }

      return { previousProducts };
    },
    onError: (_err, _id, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(productKeys.lists(), context.previousProducts);
      }
    },
    onSettled: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.components() });
    },
  });
};
