import type { CategoryResponseDTO } from './category';

export type TransactionType = 'EXPENSE' | 'INCOME';

export interface TransactionRequestDTO {
  title: string;
  amount: number;
  currency: string;
  transactionDate: string;
  transactionType: TransactionType;
  categoryId: number;
}

export interface TransactionResponseDTO {
  id: number;
  title: string;
  amount: number;
  currency: string;
  transactionDate: string;
  transactionType: TransactionType;
  category: CategoryResponseDTO;
  subscriptionId: number | null;
}