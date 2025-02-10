// src/schemas/employee.ts
import { z } from 'zod';

export const authoritySchema = z.object({
  authority: z.string(),
});

export type Authority = z.infer<typeof authoritySchema>;

export const employeeSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
  role: z.string(),
  position: z.string(),
  enabled: z.boolean(),
  accountNonExpired: z.boolean(),
  accountNonLocked: z.boolean(),
  credentialsNonExpired: z.boolean(),
  authorities: z.array(authoritySchema),
  username: z.string(),
});

export type Employee = z.infer<typeof employeeSchema>;
