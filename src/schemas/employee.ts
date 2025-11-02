// src/schemas/employee.ts
import { z } from 'zod';

// Employee DTO matching the API specification
export const employeeDtoSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  salaryPerHour: z.number(),
  hoursWorked: z.number(),
});

export type EmployeeDto = z.infer<typeof employeeDtoSchema>;

// Create Employee Command for POST requests
export const createEmployeeCommandSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  salaryPerHour: z.number(),
});

export type CreateEmployeeCommand = z.infer<typeof createEmployeeCommandSchema>;
