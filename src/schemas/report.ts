// src/schemas/report.ts
import { z } from 'zod';

// Schema for Report entity
export const ReportSchema = z.object({
  id: z.number(),
  fromDate: z.string(), // ISO date string
  toDate: z.string(), // ISO date string
  fileName: z.string(),
  fileData: z.string().optional(), // Base64 encoded file data
  generatedAt: z.string(), // ISO datetime string
});

// Schema for creating a new report
export const CreateReportCommandSchema = z.object({
  from: z.string(), // ISO date string
  to: z.string(), // ISO date string
  title: z.string(),
});

// TypeScript types derived from schemas
export type Report = z.infer<typeof ReportSchema>;
export type CreateReportCommand = z.infer<typeof CreateReportCommandSchema>;
