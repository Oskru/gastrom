// src/hooks/use-reports.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiInstance } from '../utils/api-instance.ts';
import { Report, CreateReportCommand } from '../schemas/report.ts';
import { useSnackbar } from 'notistack';

// Query keys for cache management
export const reportsKeys = {
  all: ['reports'] as const,
  lists: () => [...reportsKeys.all, 'list'] as const,
  detail: (id: number) => [...reportsKeys.all, 'detail', id] as const,
};

// Fetch all reports
export const useReports = (options = {}) => {
  return useQuery({
    queryKey: reportsKeys.lists(),
    queryFn: async () => {
      const response = await apiInstance.get<Report[]>('/reports');
      return response.data;
    },
    ...options,
  });
};

// Create a new report and download it
export const useCreateReport = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (data: CreateReportCommand) => {
      const response = await apiInstance.post<string>('/reports', data, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer', // To handle binary data
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch reports list
      queryClient.invalidateQueries({ queryKey: reportsKeys.lists() });

      // Convert base64 to blob and trigger download
      const blob = new Blob([data], {
        type: 'application/pdf',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${variables.title}_${variables.from}_${variables.to}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      enqueueSnackbar('Report generated and downloaded successfully', {
        variant: 'success',
      });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to generate report';
      enqueueSnackbar(errorMessage, {
        variant: 'error',
      });
    },
  });
};

// Download an existing report by ID
export const useDownloadReport = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (report: Report) => {
      // If fileData is available, use it directly
      if (report.fileData) {
        return {
          data: report.fileData,
          fileName: report.fileName,
        };
      }

      // Otherwise, fetch the report again
      const response = await apiInstance.get<string>(`/reports/${report.id}`, {
        responseType: 'arraybuffer',
      });
      return {
        data: response.data,
        fileName: report.fileName,
      };
    },
    onSuccess: data => {
      // Convert to blob and trigger download
      const blob = new Blob([data.data], {
        type: 'application/pdf',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      enqueueSnackbar('Report downloaded successfully', {
        variant: 'success',
      });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to download report';
      enqueueSnackbar(errorMessage, {
        variant: 'error',
      });
    },
  });
};
