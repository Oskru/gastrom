// src/schemas/inventory.ts
import { z } from 'zod';

// Unit enum for ingredients
export const unitEnum = z.enum(['G', 'ML', 'PCS']);
export type Unit = z.infer<typeof unitEnum>;

// Ingredient DTO matching the API specification
export const ingredientDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  unit: unitEnum,
  stockQuantity: z.number(),
  alertQuantity: z.number(),
  unitCost: z.number(),
});

export type IngredientDto = z.infer<typeof ingredientDtoSchema>;

// Create Ingredient Command for POST requests
export const createIngredientCommandSchema = z.object({
  name: z.string(),
  unit: unitEnum,
  stockQuantity: z.number(),
  alertQuantity: z.number(),
  unitCost: z.number(),
});

export type CreateIngredientCommand = z.infer<
  typeof createIngredientCommandSchema
>;

// Restock Command for PATCH requests
export const restockCommandSchema = z.object({
  quantity: z.number(),
});

export type RestockCommand = z.infer<typeof restockCommandSchema>;
