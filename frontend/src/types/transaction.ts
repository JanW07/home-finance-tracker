import type { CategoryResponseDTO } from './category';

export type TransactionType = 'EXPENSE' | 'INCOME';

export interface TransactionResponseDTO {
  id: number;
  description: string;
  amount: number;
  currency: string;
  transactionDate: string;
  type: TransactionType;
  category: CategoryResponseDTO;
}

export interface TransactionRequestDTO {
  description: string;
  amount: number;
  currency: string;
  transactionDate: string;
  type: TransactionType;
  categoryId: number;
}
