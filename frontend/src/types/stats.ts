import type { TransactionType } from './transaction';

/** GET /api/stats/summary?month=yyyy-MM */
export interface MonthSummaryResponseDTO {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  subscriptionsShare: number;
}

/** GET /api/stats/by-category?month=yyyy-MM&type=INCOME|EXPENSE */
export interface CategoryStatResponseDTO {
  categoryId: number;
  categoryName: string;
  icon: string;
  total: number;
  transactionType: TransactionType;
  percentage: number;
}

/** GET /api/stats/monthly-trend?months=N */
export interface MonthlyTrendResponseDTO {
  month: string; // yyyy-MM
  income: number;
  expense: number;
}

/** GET /api/stats/top-transactions?month=yyyy-MM&type=INCOME|EXPENSE&limit=N */
export interface TopTransactionResponseDTO {
  id: number;
  title: string;
  amount: number;
  transactionType: TransactionType;
  categoryName: string;
  icon: string;
  transactionDate: string; // yyyy-MM-dd
}
