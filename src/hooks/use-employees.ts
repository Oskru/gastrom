// src/hooks/use-employees.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiInstance } from '../utils/api-instance';
import { EmployeeDto, CreateEmployeeCommand } from '../schemas/employee';

// Query keys for cache management
export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (filters: Record<string, string | number | boolean>) =>
    [...employeeKeys.lists(), filters] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
};

// Fetch all employees
export const useEmployees = (options = {}) => {
  return useQuery({
    queryKey: employeeKeys.lists(),
    queryFn: async () => {
      const response = await apiInstance.get<EmployeeDto[]>('/employees');
      return response.data;
    },
    ...options,
  });
};

// Fetch a single employee by id
export const useEmployee = (id: number, options = {}) => {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: async () => {
      const response = await apiInstance.get<EmployeeDto>(`/employees/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

// Create a new employee
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEmployee: CreateEmployeeCommand) => {
      const response = await apiInstance.post<EmployeeDto>(
        '/employees',
        newEmployee
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
};

// Update employee hours (PATCH /employees/update-hours/{id})
export const useUpdateEmployeeHours = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, hours }: { id: number; hours: number }) => {
      const response = await apiInstance.patch<EmployeeDto>(
        `/employees/update-hours/${id}`,
        hours,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: employeeKeys.detail(data.id),
      });
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
};

// Generate/withdraw salary (POST /employees/generateSalary/{id})
export const useGenerateEmployeeSalary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiInstance.post<EmployeeDto>(
        `/employees/generateSalary/${id}`
      );
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: employeeKeys.detail(data.id),
      });
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
};

// Delete an employee
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiInstance.delete(`/employees/${id}`);
      return id;
    },
    onSuccess: id => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
};
