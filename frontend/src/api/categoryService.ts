import type { CategoryResponseDTO, CategoryRequestDTO } from '../types/category';

const API_BASE_URL = 'http://localhost:8080/api/categories';

export const categoryService = {
  async getAll(): Promise<CategoryResponseDTO[]> {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) throw new Error('Nie udało się pobrać kategorii');
    return res.json();
  },

  async create(data: CategoryRequestDTO): Promise<CategoryResponseDTO> {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Nie udało się dodać kategorii');
    return res.json();
  },

  async update(id: number, data: CategoryRequestDTO): Promise<CategoryResponseDTO> {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Nie udało się zaktualizować kategorii');
    return res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Nie udało się usunąć kategorii');
  },
};