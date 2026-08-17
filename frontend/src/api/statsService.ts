import apiClient from './client';
import type {
  CategoryStatResponseDTO,
  MonthlyTrendResponseDTO,
  MonthSummaryResponseDTO,
  TopTransactionResponseDTO,
} from '../types/stats';
import type { TransactionType } from '../types/transaction';

const ENDPOINT = '/stats';

export const statsService = {
  getSummary: async (month: string): Promise<MonthSummaryResponseDTO> => {
    const response = await apiClient.get<MonthSummaryResponseDTO>(`${ENDPOINT}/summary`, {
      params: { month },
    });
    return response.data;
  },

  getByCategory: async (
    month: string,
    type: TransactionType
  ): Promise<CategoryStatResponseDTO[]> => {
    const response = await apiClient.get<CategoryStatResponseDTO[]>(`${ENDPOINT}/by-category`, {
      params: { month, type },
    });
    return response.data;
  },

  getMonthlyTrend: async (months = 6): Promise<MonthlyTrendResponseDTO[]> => {
    const response = await apiClient.get<MonthlyTrendResponseDTO[]>(`${ENDPOINT}/monthly-trend`, {
      params: { months },
    });
    return response.data;
  },

  getTopTransactions: async (
    month: string,
    type: TransactionType,
    limit = 5
  ): Promise<TopTransactionResponseDTO[]> => {
    const response = await apiClient.get<TopTransactionResponseDTO[]>(
      `${ENDPOINT}/top-transactions`,
      { params: { month, type, limit } }
    );
    return response.data;
  },
};
