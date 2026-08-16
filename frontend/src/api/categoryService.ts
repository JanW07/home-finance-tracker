import apiClient from './client';
import type { CategoryResponseDTO, CategoryRequestDTO } from '../types/category';

const ENDPOINT = '/categories';

export const categoryService = {
  getAll: async (): Promise<CategoryResponseDTO[]> => {
    const response = await apiClient.get<CategoryResponseDTO[]>(ENDPOINT);
    return response.data;
  },

  create: async (data: CategoryRequestDTO): Promise<CategoryResponseDTO> => {
    const response = await apiClient.post<CategoryResponseDTO>(ENDPOINT, data);
    return response.data;
  },

  update: async (id: number, data: CategoryRequestDTO): Promise<CategoryResponseDTO> => {
    const response = await apiClient.patch<CategoryResponseDTO>(`${ENDPOINT}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};