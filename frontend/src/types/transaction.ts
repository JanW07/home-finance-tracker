import type { CategoryResponseDTO } from './category';

export type TransactionType = 'EXPENSE' | 'INCOME';
export type BillingPeriod = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface TransactionRequestDTO {
  title: string;
  amount: number;
  currency: string;
  transactionDate: string;
  transactionType: TransactionType;
  categoryId: number;
  isSubscription?: boolean;
  billingPeriod?: BillingPeriod;
}

export interface TransactionResponseDTO {
  id: number;
  title: string;
  amount: number;
  currency: string;
  transactionDate: string;
  transactionType: TransactionType;
  category: CategoryResponseDTO;
  isSubscription: boolean;
  billingPeriod?: BillingPeriod;
}