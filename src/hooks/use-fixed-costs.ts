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
    onMutate: async (newFixedCost: CreateFixedCost) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: fixedCostKeys.lists() });

      // Snapshot the previous value
      const previousFixedCosts = queryClient.getQueryData<FixedCost[]>(
        fixedCostKeys.lists()
      );

      // Optimistically update to the new value
      if (previousFixedCosts) {
        const optimisticFixedCost: FixedCost = {
          id: Date.now(), // Temporary ID
          ...newFixedCost,
          costType: 'BILLING', // Default type
          createdAt: new Date().toISOString(),
        };
        queryClient.setQueryData<FixedCost[]>(fixedCostKeys.lists(), [
          ...previousFixedCosts,
          optimisticFixedCost,
        ]);
      }

      return { previousFixedCosts };
    },
    onError: (_err, _newFixedCost, context) => {
      // Rollback on error
      if (context?.previousFixedCosts) {
        queryClient.setQueryData(
          fixedCostKeys.lists(),
          context.previousFixedCosts
        );
      }
    },
    onSettled: () => {
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
      return id;
    },
    onMutate: async (id: number) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: fixedCostKeys.lists() });

      // Snapshot the previous value
      const previousFixedCosts = queryClient.getQueryData<FixedCost[]>(
        fixedCostKeys.lists()
      );

      // Optimistically update to remove the fixed cost
      if (previousFixedCosts) {
        queryClient.setQueryData<FixedCost[]>(
          fixedCostKeys.lists(),
          previousFixedCosts.filter(cost => cost.id !== id)
        );
      }

      return { previousFixedCosts };
    },
    onError: (_err, _id, context) => {
      // Rollback on error
      if (context?.previousFixedCosts) {
        queryClient.setQueryData(
          fixedCostKeys.lists(),
          context.previousFixedCosts
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: fixedCostKeys.lists() });
    },
  });
};
