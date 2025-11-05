// src/schemas/user.ts
import { z } from 'zod';

// User roles enum
export const userRoleSchema = z.enum(['ADMIN', 'MANAGER']);
export type UserRole = z.infer<typeof userRoleSchema>;

// User DTO matching the API specification
export const userDtoSchema = z.object({
  id: z.number(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().optional(), // Password might not be returned in GET requests
  enabled: z.boolean(),
  role: userRoleSchema,
  authorities: z.array(z.object({ authority: z.string() })).optional(),
  accountNonExpired: z.boolean().optional(),
  accountNonLocked: z.boolean().optional(),
  credentialsNonExpired: z.boolean().optional(),
});

export type UserDto = z.infer<typeof userDtoSchema>;

// Create User Command for POST requests
export const createUserCommandSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: userRoleSchema,
});

export type CreateUserCommand = z.infer<typeof createUserCommandSchema>;
