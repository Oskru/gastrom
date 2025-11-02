// src/hooks/use-statistics.ts
import { useQuery } from '@tanstack/react-query';
import { apiInstance } from '../utils/api-instance';
import {
  StatisticsDto,
  ExpandedStatisticsDto,
  StatisticsRange,
} from '../schemas/statistics';
import { IngredientDto } from '../schemas/inventory';

// Query keys for cache management
export const statisticsKeys = {
  all: ['statistics'] as const,
  basic: (range?: StatisticsRange) =>
    [...statisticsKeys.all, 'basic', range] as const,
  expanded: (range?: StatisticsRange) =>
    [...statisticsKeys.all, 'expanded', range] as const,
  lowStock: () => [...statisticsKeys.all, 'lowStock'] as const,
};

// Fetch basic statistics
export const useStatistics = (
  range: StatisticsRange = 'OVERALL',
  options = {}
) => {
  return useQuery({
    queryKey: statisticsKeys.basic(range),
    queryFn: async () => {
      const response = await apiInstance.get<StatisticsDto>('/statistics', {
        params: { statisticsRange: range },
      });
      return response.data;
    },
    ...options,
  });
};

// Fetch expanded statistics with additional metrics
export const useExpandedStatistics = (
  range: StatisticsRange = 'OVERALL',
  options = {}
) => {
  return useQuery({
    queryKey: statisticsKeys.expanded(range),
    queryFn: async () => {
      const response = await apiInstance.get<ExpandedStatisticsDto>(
        '/statistics/expanded',
        {
          params: { statisticsRange: range },
        }
      );
      return response.data;
    },
    ...options,
  });
};

// Fetch low stock ingredients from statistics endpoint
export const useLowStockStatistics = (options = {}) => {
  return useQuery({
    queryKey: statisticsKeys.lowStock(),
    queryFn: async () => {
      const response = await apiInstance.get<IngredientDto[]>(
        '/statistics/low-stock'
      );
      return response.data;
    },
    ...options,
  });
};
