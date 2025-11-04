/**
 * Transaction hooks
 * ----------------------------------------------
 * The backend now exposes a paginated /transactions endpoint that requires
 * page & size parameters (Spring Data style). We provide:
 *  - useTransactionsPaged(page,size): returns normalized page metadata + content
 *  - useTransactions(): backward-compatible convenience wrapper returning just an array
 *    (first page only, with a large default size). For analytics spanning all
 *    historical transactions, we may later implement a batched "useAllTransactions"
 *    that iteratively loads every page. Current dashboard/report components rely on
 *    a single page slice which is sufficient for recent insights.
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
  options: Record<string, unknown> = {}
) => {
  return useQuery({
    queryKey: transactionKeys.page(page, size),
    queryFn: async () => {
      const response = await apiInstance.get<PageTransactionDto>(
        `/transactions?page=${page}&size=${size}`
      );
      return normalizeTransactionPage(response.data);
    },
    ...options,
  });
};

// Backward-compatible hook returning just an array (first page, large size)
// NOTE: For full historical analytics this may need iteration across all pages.
export const useTransactions = (
  options: Record<string, unknown> = {},
  page: number = 0,
  size: number = 200
) => {
  const { data: pageData, ...rest } = useTransactionsPaged(page, size, options);
  return { data: pageData?.content || [], pageData, ...rest };
};

// Fetch today's transactions
export const useTodayTransactions = (options = {}) => {
  const { data: allTransactions = [], ...rest } = useTransactions(options);

  // Filter transactions that occurred today
  const todayTransactions = allTransactions.filter(tx => {
    const txDate = new Date(tx.dateTime);
    const todayDate = new Date();
    return (
      txDate.getFullYear() === todayDate.getFullYear() &&
      txDate.getMonth() === todayDate.getMonth() &&
      txDate.getDate() === todayDate.getDate()
    );
  });

  const totalSalesToday = todayTransactions.reduce(
    (sum, tx) => sum + tx.totalAmount,
    0
  );

  return {
    ...rest,
    data: todayTransactions,
    totalSalesToday,
    totalTransactionsToday: todayTransactions.length,
  };
};

// Fetch recent transactions
export const useRecentTransactions = (limit = 5, options = {}) => {
  const { data: allTransactions = [], ...rest } = useTransactions(options);

  const sortedTransactions = [...allTransactions].sort((a, b) =>
    a.dateTime < b.dateTime ? 1 : -1
  );
  const recentTransactions = sortedTransactions.slice(0, limit);

  return {
    ...rest,
    data: recentTransactions,
  };
};

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
};

// Get transactions by date range
export const useTransactionsByDateRange = (
  startDate: string,
  endDate: string,
  options = {}
) => {
  const { data: allTransactions = [], ...rest } = useTransactions(options);

  const filteredTransactions = allTransactions.filter(
    tx => tx.dateTime >= startDate && tx.dateTime <= endDate
  );

  return {
    ...rest,
    data: filteredTransactions,
  };
};

// Get sales data by payment method
export const useSalesByPaymentMethod = (options = {}) => {
  const { data: transactions = [], ...rest } = useTransactions(options);

  const paymentMethodMap: Record<string, number> = {};
  transactions.forEach(tx => {
    const method = tx.paymentMethod;
    if (paymentMethodMap[method]) {
      paymentMethodMap[method] += tx.totalAmount;
    } else {
      paymentMethodMap[method] = tx.totalAmount;
    }
  });

  const paymentMethodData = Object.entries(paymentMethodMap).map(
    ([method, amount]) => ({
      method,
      amount,
    })
  );

  return {
    ...rest,
    data: paymentMethodData,
  };
};

// Get daily sales data
export const useDailySalesData = (options = {}) => {
  const { data: transactions = [], ...rest } = useTransactions(options);

  const dailySalesMap: Record<string, number> = {};
  transactions.forEach(tx => {
    const date = tx.dateTime.split('T')[0]; // Extract date part from ISO datetime
    if (dailySalesMap[date]) {
      dailySalesMap[date] += tx.totalAmount;
    } else {
      dailySalesMap[date] = tx.totalAmount;
    }
  });

  const dailySalesData = Object.entries(dailySalesMap)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    ...rest,
    data: dailySalesData,
  };
};
