import type { CategoryResponseDTO } from "./category";
import type { TransactionType } from "./transaction";

export type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED';
export type BillingPeriod = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface SubscriptionRequestDTO {
  title: string;
  amount: number;
  currency: string;
  categoryId: number;
  billingPeriod: BillingPeriod;
  nextBillingPeriod: string;
  status: SubscriptionStatus;
  transactionType: TransactionType;
}
export interface SubscriptionResponseDTO {
  id: number;
  title: string;
  amount: number;
  currency: string;
  category: CategoryResponseDTO;
  billingPeriod: BillingPeriod;
  nextBillingPeriod: string;
  status: SubscriptionStatus;
  transactionType: TransactionType;
}