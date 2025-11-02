import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiInstance } from '../utils/api-instance';
import {
  TransactionDto,
  CreateTransactionCommand,
} from '../schemas/transaction';

// Query keys for cache management
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters: Record<string, string | number | boolean>) =>
    [...transactionKeys.lists(), filters] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: number) => [...transactionKeys.details(), id] as const,
};

// Fetch all transactions
export const useTransactions = (options = {}) => {
  return useQuery({
    queryKey: transactionKeys.lists(),
    queryFn: async () => {
      const response = await apiInstance.get<TransactionDto[]>('/transactions');
      return response.data;
    },
    ...options,
  });
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
