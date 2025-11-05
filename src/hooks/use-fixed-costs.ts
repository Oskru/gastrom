import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiInstance } from '../utils/api-instance.ts';
import { FixedCost, CreateFixedCost } from '../schemas/fixed-cost.ts';

// Query keys for cache management
export const fixedCostKeys = {
  all: ['fixed-costs'] as const,
  lists: () => [...fixedCostKeys.all, 'list'] as const,
};

// Fetch all fixed costs
export const useFixedCosts = (options = {}) => {
  return useQuery({
    queryKey: fixedCostKeys.lists(),
    queryFn: async () => {
      const response = await apiInstance.get<FixedCost[]>('/fixed-costs');
      return response.data;
    },
    ...options,
  });
};

// Create a new fixed cost
export const useCreateFixedCost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newFixedCost: CreateFixedCost) => {
      const response = await apiInstance.post<FixedCost>(
        '/fixed-costs',
        newFixedCost
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fixedCostKeys.lists() });
    },
  });
};

// Delete a fixed cost
export const useDeleteFixedCost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiInstance.delete(`/fixed-costs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fixedCostKeys.lists() });
    },
  });
};
