import type { CategoryResponseDTO } from './category';

export interface ExpenseResponseDTO {
  id: number;
  title: string;
  amount: number;
  currency: string;
  purchaseDate: string;
  category: CategoryResponseDTO;
}

export interface ExpenseRequestDTO {
  title: string;
  amount: number;
  currency: string;
  categoryId: number;
}