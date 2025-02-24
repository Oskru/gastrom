// src/schemas/inventory.ts
import { z } from 'zod';

// A summary of a product (inventory item) to be used inside a category
export const productSummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  // you can include other fields if needed
});

export type ProductSummary = z.infer<typeof productSummarySchema>;

// The category now has an array of product summaries
export const productCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  products: z.array(productSummarySchema),
});

export type ProductCategory = z.infer<typeof productCategorySchema>;

// The full inventory item (for the table and form) can include the full category
export const inventoryItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  category: productCategorySchema,
  price: z.number(),
  quantity: z.number(),
  weightInGrams: z.number(),
  countable: z.boolean(),
  minimalValue: z.number(),
  lowStock: z.boolean(),
});

export type InventoryItem = z.infer<typeof inventoryItemSchema>;
