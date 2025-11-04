// src/schemas/transaction.ts
import { z } from 'zod';

// Payment method enum
export const paymentMethodEnum = z.enum(['CARD', 'CASH']);
export type PaymentMethod = z.infer<typeof paymentMethodEnum>;

// Transaction DTO matching the API specification
export const transactionDtoSchema = z.object({
  id: z.number(),
  employeeId: z.number(),
  totalAmount: z.number(),
  productIdQuantities: z.record(z.string(), z.number()),
  paymentMethod: paymentMethodEnum,
  dateTime: z.string(), // ISO 8601 date-time format
});
export type TransactionDto = z.infer<typeof transactionDtoSchema>;

// Create Transaction Command for POST requests
export const createTransactionCommandSchema = z.object({
  employeeId: z.number(),
  paymentMethod: paymentMethodEnum,
  productIds: z.array(z.number()),
});
export type CreateTransactionCommand = z.infer<
  typeof createTransactionCommandSchema
>;

// Paging related schemas (subset of fields we actually use in the UI)
export const sortObjectSchema = z.object({
  empty: z.boolean().optional(),
  unsorted: z.boolean().optional(),
  sorted: z.boolean().optional(),
});
export type SortObject = z.infer<typeof sortObjectSchema>;

export const pageableObjectSchema = z.object({
  offset: z.number().optional(),
  pageNumber: z.number().optional(),
  pageSize: z.number().optional(),
  paged: z.boolean().optional(),
  unpaged: z.boolean().optional(),
  sort: sortObjectSchema.optional(),
});
export type PageableObject = z.infer<typeof pageableObjectSchema>;

export const pageTransactionDtoSchema = z.object({
  totalElements: z.number(),
  totalPages: z.number(),
  size: z.number(),
  number: z.number(), // current page index
  first: z.boolean().optional(),
  last: z.boolean().optional(),
  empty: z.boolean().optional(),
  numberOfElements: z.number().optional(),
  sort: sortObjectSchema.optional(),
  pageable: pageableObjectSchema.optional(),
  content: z.array(transactionDtoSchema),
});
export type PageTransactionDto = z.infer<typeof pageTransactionDtoSchema>;

// A simplified helper type for UI consumption (normalized metadata)
export interface NormalizedTransactionPage {
  content: TransactionDto[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

export const normalizeTransactionPage = (
  page: PageTransactionDto
): NormalizedTransactionPage => ({
  content: page.content,
  page: page.number,
  size: page.size,
  totalPages: page.totalPages,
  totalElements: page.totalElements,
  first: !!page.first,
  last: !!page.last,
});
