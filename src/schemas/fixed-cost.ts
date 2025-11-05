import { z } from 'zod';

export const costTypeSchema = z.enum(['RESTOCK', 'PAYCHECK', 'BILLING']);

export const fixedCostSchema = z.object({
  id: z.number(),
  description: z.string(),
  cost: z.number(),
  costType: costTypeSchema,
  createdAt: z.string(),
});

export const createFixedCostSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  cost: z.number().positive('Cost must be a positive number'),
});

export type FixedCost = z.infer<typeof fixedCostSchema>;
export type CreateFixedCost = z.infer<typeof createFixedCostSchema>;
export type CostType = z.infer<typeof costTypeSchema>;
