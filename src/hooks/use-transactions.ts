/**
 * Transaction Hooks
 * =================
 *
 * IMPORTANT: Transaction Endpoint Usage Restriction
 * --------------------------------------------------
 * Per project requirement, the /transactions endpoint is LIMITED to fetching the 5 most
 * recent transactions for display on the dashboard ONLY. All sales analytics, aggregations,
 * payment method distributions, and historical data analysis MUST use the /statistics and
 * /statistics/expanded endpoints instead.
 *
 * Removed Hooks (use statistics endpoints instead):
 * - useTodayTransactions → use useStatistics('DAILY')
 * - useDailySalesData → use useStatistics with appropriate range
 * - useSalesByPaymentMethod → use useStatistics (cashIncome/cardIncome fields)
 * - useTransactionsByDateRange → use useStatistics with date range parameter
 *
 * Available Hooks:
 * - useRecentTransactions(limit): Fetches recent transactions for dashboard display
 * - useTransaction(id): Fetches single transaction details
 * - useCreateTransaction(): Mutation for creating new transactions
 * - useTransactionsPaged(page, size): Low-level paginated access (use sparingly)
 *
 * Backend Implementation:
 * The backend exposes a paginated /transactions endpoint requiring page & size parameters
 * (Spring Data style). useTransactionsPaged returns normalized page metadata + content.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiInstance } from '../utils/api-instance';
import {
  TransactionDto,
  CreateTransactionCommand,
  PageTransactionDto,
  normalizeTransactionPage,
} from '../schemas/transaction';

// Query keys for cache management
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters: Record<string, string | number | boolean>) =>
    [...transactionKeys.lists(), filters] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: number) => [...transactionKeys.details(), id] as const,
  pages: () => [...transactionKeys.all, 'page'] as const,
  page: (page: number, size: number) =>
    [...transactionKeys.pages(), { page, size }] as const,
};

// Fetch a single page of transactions (generic paged hook)
export const useTransactionsPaged = (
  page: number,
  size: number,
  sort?: string,
  options: Record<string, unknown> = {}
) => {
  return useQuery({
    queryKey: transactionKeys.page(page, size),
    queryFn: async () => {
      const sortParam = sort ? `&sort=${sort}` : '';
      const response = await apiInstance.get<PageTransactionDto>(
        `/transactions?page=${page}&size=${size}${sortParam}`
      );
      return normalizeTransactionPage(response.data);
    },
    ...options,
  });
};

// INTERNAL: No longer exported for analytics – only dashboard uses recent subset.

// Fetch only recent transactions (single page sized by limit) – primary allowed usage.
export const useRecentTransactions = (limit = 5, options = {}) => {
  const { data: pageData, ...rest } = useTransactionsPaged(
    0,
    limit,
    'id,desc',
    options
  );
  // Server already sorts by id descending, so we just return the content
  return { ...rest, data: pageData?.content || [] };
};

// Removed analytics hooks (useTodayTransactions, useDailySalesData, useSalesByPaymentMethod, etc.)
// per requirement: only fetch limited recent transactions on dashboard – use statistics endpoints for analytics.

// Fetch a single transaction by id
export const useTransaction = (id: number, options = {}) => {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: async () => {
      const response = await apiInstance.get<TransactionDto>(
        `/transactions/${id}`
      );
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

// Create a new transaction
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTransaction: CreateTransactionCommand) => {
      const response = await apiInstance.post<TransactionDto>(
        '/transactions',
        newTransaction
      );
      return response.data;
    },
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: transactionKeys.pages() });

      // Snapshot the previous value (for recent transactions)
      const previousPage = queryClient.getQueryData(transactionKeys.page(0, 4));

      // Note: For transactions, we don't optimistically update because
      // we need the server to calculate totalAmount and productIdQuantities
      // We just return the previous state for potential rollback

      return { previousPage };
    },
    onError: (_err, _newTransaction, context) => {
      // Rollback on error
      if (context?.previousPage) {
        queryClient.setQueryData(
          transactionKeys.page(0, 4),
          context.previousPage
        );
      }
    },
    onSettled: () => {
      // Invalidate all transaction queries after mutation
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.pages() });
    },
  });
};

// (Deprecated hooks removed)
