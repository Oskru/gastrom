// src/schemas/product.ts
import { z } from 'zod';

// Product DTO matching the API specification
export const productDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  productComponentIds: z.array(z.number()),
  takeaway: z.boolean(),
});

export type ProductDto = z.infer<typeof productDtoSchema>;

// Component Command for creating product components
export const componentCommandSchema = z.object({
  ingredientId: z.number(),
  amount: z.number(),
});

export type ComponentCommand = z.infer<typeof componentCommandSchema>;

// Create Product Command for POST requests
export const createProductCommandSchema = z.object({
  name: z.string(),
  price: z.number(),
  productComponents: z.array(componentCommandSchema),
  takeaway: z.boolean(),
});

export type CreateProductCommand = z.infer<typeof createProductCommandSchema>;

// Product Component DTO
export const productComponentDtoSchema = z.object({
  id: z.number(),
  ingredientId: z.number(),
  amount: z.number(),
});

export type ProductComponentDto = z.infer<typeof productComponentDtoSchema>;
