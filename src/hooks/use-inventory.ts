import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiInstance } from '../utils/api-instance';
import { InventoryItem } from '../schemas/inventory';

// Query keys for cache management
export const inventoryKeys = {
  all: ['inventoryItems'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  list: (filters: Record<string, string | number | boolean>) =>
    [...inventoryKeys.lists(), filters] as const,
  details: () => [...inventoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...inventoryKeys.details(), id] as const,
};

// Fetch all inventory items
export const useInventory = (options = {}) => {
  return useQuery({
    queryKey: inventoryKeys.lists(),
    queryFn: async () => {
      const response = await apiInstance.get<InventoryItem[]>('/inventory');
      return response.data;
    },
    ...options,
  });
};

// Fetch a single inventory item by id
export const useInventoryItem = (id: number, options = {}) => {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: async () => {
      const response = await apiInstance.get<InventoryItem>(`/inventory/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

// Create a new inventory item
export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItem: Omit<InventoryItem, 'id'>) => {
      const response = await apiInstance.post<InventoryItem>(
        '/inventory',
        newItem
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
};

// Update an existing inventory item
export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedItem: InventoryItem) => {
      const response = await apiInstance.put<InventoryItem>(
        `/inventory/${updatedItem.id}`,
        updatedItem
      );
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.detail(data.id),
      });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
};

// Delete an inventory item
export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiInstance.delete(`/inventory/${id}`);
      return id;
    },
    onSuccess: id => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
};

// Get low stock items
export const useLowStockItems = (options = {}) => {
  const { data: inventory = [], ...rest } = useInventory(options);
  const lowStockItems = inventory.filter(item => {
    // Check based on whether the item is countable
    if (item.countable) {
      return item.quantity < item.minimalValue;
    } else {
      return item.weightInGrams < item.minimalValue;
    }
  });

  return {
    ...rest,
    data: lowStockItems,
  };
};
