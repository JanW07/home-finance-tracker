import type { CategoryResponseDTO } from './category';

export interface SubscriptionResponseDTO {
  id: number;
  name: string;
  amount: number;
  currency: string;
  nextPaymentDate: string;
  category: CategoryResponseDTO;
}

export interface SubscriptionRequestDTO {
  name: string;
  amount: number;
  currency: string;
  nextPaymentDate: string;
  categoryId: number;
}