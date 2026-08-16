import type { TransactionRequestDTO, TransactionResponseDTO } from '../types/transaction';

const API_URL = '/api/transactions';

export const transactionService = {
  async getAll(): Promise<TransactionResponseDTO[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },

  async getById(id: number): Promise<TransactionResponseDTO> {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch transaction');
    return res.json();
  },

  async create(dto: TransactionRequestDTO): Promise<TransactionResponseDTO> {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Failed to create transaction');
    return res.json();
  },

  async update(id: number, dto: TransactionRequestDTO): Promise<TransactionResponseDTO> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Failed to update transaction');
    return res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete transaction');
  },
};