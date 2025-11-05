import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiInstance } from '../utils/api-instance';
import {
  IngredientDto,
  CreateIngredientCommand,
  RestockCommand,
} from '../schemas/inventory';

// Query keys for cache management
export const ingredientKeys = {
  all: ['ingredients'] as const,
  lists: () => [...ingredientKeys.all, 'list'] as const,
  list: (filters: Record<string, string | number | boolean>) =>
    [...ingredientKeys.lists(), filters] as const,
  details: () => [...ingredientKeys.all, 'detail'] as const,
  detail: (id: number) => [...ingredientKeys.details(), id] as const,
};

// Fetch all ingredients
export const useIngredients = (options = {}) => {
  return useQuery({
    queryKey: ingredientKeys.lists(),
    queryFn: async () => {
      const response = await apiInstance.get<IngredientDto[]>('/ingredients');
      return response.data;
    },
    ...options,
  });
};

// Fetch low stock ingredients using the API query parameter
export const useLowStockIngredients = (options = {}) => {
  return useQuery({
    queryKey: ingredientKeys.list({ lowStock: true }),
    queryFn: async () => {
      const response = await apiInstance.get<IngredientDto[]>('/ingredients', {
        params: { lowStock: true },
      });
      return response.data;
    },
    ...options,
  });
};

// Fetch a single ingredient by id
export const useIngredient = (id: number, options = {}) => {
  return useQuery({
    queryKey: ingredientKeys.detail(id),
    queryFn: async () => {
      const response = await apiInstance.get<IngredientDto>(
        `/ingredients/${id}`
      );
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

// Create a new ingredient
export const useCreateIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItem: CreateIngredientCommand) => {
      const response = await apiInstance.post<IngredientDto>(
        '/ingredients',
        newItem
      );
      return response.data;
    },
    onMutate: async (newItem: CreateIngredientCommand) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ingredientKeys.lists() });

      // Snapshot the previous value
      const previousIngredients = queryClient.getQueryData<IngredientDto[]>(
        ingredientKeys.lists()
      );

      // Optimistically update to the new value
      if (previousIngredients) {
        const optimisticIngredient: IngredientDto = {
          id: Date.now(), // Temporary ID
          ...newItem,
        };
        queryClient.setQueryData<IngredientDto[]>(ingredientKeys.lists(), [
          ...previousIngredients,
          optimisticIngredient,
        ]);
      }

      return { previousIngredients };
    },
    onError: (_err, _newItem, context) => {
      // Rollback on error
      if (context?.previousIngredients) {
        queryClient.setQueryData(
          ingredientKeys.lists(),
          context.previousIngredients
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() });
    },
  });
};

// Restock an ingredient (PATCH /ingredients/restock/{id})
export const useRestockIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const restockCommand: RestockCommand = { quantity };
      const response = await apiInstance.patch<IngredientDto>(
        `/ingredients/restock/${id}`,
        restockCommand
      );
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: ingredientKeys.detail(data.id),
      });
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() });
    },
  });
};

// Delete an ingredient
export const useDeleteIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiInstance.delete(`/ingredients/${id}`);
      return id;
    },
    onMutate: async (id: number) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ingredientKeys.lists() });

      // Snapshot the previous value
      const previousIngredients = queryClient.getQueryData<IngredientDto[]>(
        ingredientKeys.lists()
      );

      // Optimistically update to remove the ingredient
      if (previousIngredients) {
        queryClient.setQueryData<IngredientDto[]>(
          ingredientKeys.lists(),
          previousIngredients.filter(item => item.id !== id)
        );
      }

      return { previousIngredients };
    },
    onError: (_err, _id, context) => {
      // Rollback on error
      if (context?.previousIngredients) {
        queryClient.setQueryData(
          ingredientKeys.lists(),
          context.previousIngredients
        );
      }
    },
    onSettled: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() });
    },
  });
};

// Backward compatibility exports with old names
export const useInventory = useIngredients;
export const useInventoryItem = useIngredient;
export const useCreateInventoryItem = useCreateIngredient;
export const useDeleteInventoryItem = useDeleteIngredient;
export const useLowStockItems = useLowStockIngredients;
export const inventoryKeys = ingredientKeys;

// Note: The new API does not support updating ingredients (no PUT endpoint)
// Only create, delete, and restock operations are available
// This export is provided for backward compatibility but will throw an error if used
export const useUpdateInventoryItem = () => {
  throw new Error(
    'Update operation not supported by API. Use restock or delete/recreate instead.'
  );
};
