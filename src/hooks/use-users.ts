// src/hooks/use-users.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiInstance } from '../utils/api-instance';
import { UserDto, CreateUserCommand, userDtoSchema } from '../schemas/user';
import { z } from 'zod';

// Query keys for cache management
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, string | number | boolean>) =>
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// Fetch all users
export const useUsers = (options = {}) => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: async () => {
      try {
        const response = await apiInstance.get<UserDto[]>('/users');
        // Validate response with Zod schema
        const usersSchema = z.array(userDtoSchema);
        const validatedData = usersSchema.safeParse(response.data);

        if (!validatedData.success) {
          console.error('User data validation failed:', validatedData.error);
          // Return the raw data if validation fails, to at least show something
          return response.data;
        }

        return validatedData.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    ...options,
  });
};

// Create a new user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: CreateUserCommand) => {
      const response = await apiInstance.post<UserDto>('/users', newUser);
      return userDtoSchema.parse(response.data);
    },
    onMutate: async (newUser: CreateUserCommand) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData<UserDto[]>(
        userKeys.lists()
      );

      // Optimistically update to the new value
      if (previousUsers) {
        const optimisticUser: UserDto = {
          id: Date.now(), // Temporary ID
          ...newUser,
          enabled: true,
          accountNonExpired: true,
          accountNonLocked: true,
          credentialsNonExpired: true,
          authorities: [],
        };
        queryClient.setQueryData<UserDto[]>(userKeys.lists(), [
          ...previousUsers,
          optimisticUser,
        ]);
      }

      return { previousUsers };
    },
    onError: (_err, _newUser, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(userKeys.lists(), context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

// Delete a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiInstance.delete(`/users/${id}`);
      return id;
    },
    onMutate: async (id: number) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData<UserDto[]>(
        userKeys.lists()
      );

      // Optimistically update to remove the user
      if (previousUsers) {
        queryClient.setQueryData<UserDto[]>(
          userKeys.lists(),
          previousUsers.filter(user => user.id !== id)
        );
      }

      return { previousUsers };
    },
    onError: (_err, _id, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(userKeys.lists(), context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};
