import type { ExpenseResponseDTO, ExpenseRequestDTO } from '../types/expense';

const API_BASE_URL = 'http://localhost:8080/api/expenses';

export const expenseService = {
  async getAll(): Promise<ExpenseResponseDTO[]> {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) throw new Error('Nie udało się pobrać wydatków');
    return res.json();
  },

  async create(data: ExpenseRequestDTO): Promise<ExpenseResponseDTO> {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Nie udało się dodać wydatku');
    return res.json();
  },

  async update(id: number, data: ExpenseRequestDTO): Promise<ExpenseResponseDTO> {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Nie udało się zaktualizować wydatku');
    return res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Nie udało się usunąć wydatku');
  },
};