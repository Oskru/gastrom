import { z } from 'zod';

const userRoles = ['MANAGER', 'ADMIN'] as const;
export const userRolesSchema = z.enum(userRoles);
export type UserRole = z.infer<typeof userRolesSchema>;

export const tokenSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  id: z.number(),
  userRole: userRolesSchema,
  sub: z.string(),
  iat: z.number(),
  exp: z.number(),
});
export type Token = z.infer<typeof tokenSchema>;

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userRole: string;
}
