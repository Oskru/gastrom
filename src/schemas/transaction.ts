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
