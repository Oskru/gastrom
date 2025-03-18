import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiInstance } from '../utils/api-instance';

export interface Transaction {
  id: number;
  totalAmount: number;
  date: string; // Expected format "YYYY-MM-DD"
  paymentMethod: string;
}

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
      const response = await apiInstance.get<Transaction[]>('/transactions');
      return response.data;
    },
    ...options,
  });
};

// Fetch today's transactions
export const useTodayTransactions = (options = {}) => {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const { data: allTransactions = [], ...rest } = useTransactions(options);

  const todayTransactions = allTransactions.filter(tx => tx.date === today);
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
    a.date < b.date ? 1 : -1
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
      const response = await apiInstance.get<Transaction>(
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
    mutationFn: async (newTransaction: Omit<Transaction, 'id'>) => {
      const response = await apiInstance.post<Transaction>(
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
    tx => tx.date >= startDate && tx.date <= endDate
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
    const date = tx.date;
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
