// src/schemas/statistics.ts
import { z } from 'zod';

// Statistics range enum
export const statisticsRangeEnum = z.enum([
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'YEARLY',
  'OVERALL',
]);
export type StatisticsRange = z.infer<typeof statisticsRangeEnum>;

// Statistics DTO matching the API specification
export const statisticsDtoSchema = z.object({
  highestOrderValue: z.number(),
  averageOrderValue: z.number(),
  cashIncome: z.number(),
  cardIncome: z.number(),
  totalRevenue: z.number(),
  ingredientCosts: z.number(),
  fixedCosts: z.number(),
  totalExpense: z.number(),
  totalProfit: z.number(),
  transactionCount: z.number(),
  lastTransactionTime: z.string().nullable(), // ISO 8601 date-time format or null
});

export type StatisticsDto = z.infer<typeof statisticsDtoSchema>;

// Expanded Statistics DTO with additional metrics
export const expandedStatisticsDtoSchema = statisticsDtoSchema.extend({
  averageMarginPerTransaction: z.number(),
  averageItemsPerTransaction: z.number(),
  revenuePerProduct: z.record(z.string(), z.number()),
  unitsSoldPerProduct: z.record(z.string(), z.number()),
});

export type ExpandedStatisticsDto = z.infer<typeof expandedStatisticsDtoSchema>;
