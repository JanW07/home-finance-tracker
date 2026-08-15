import type { SubscriptionResponseDTO, SubscriptionRequestDTO } from '../types/subscription';

const API_BASE_URL = 'http://localhost:8080/api/subscriptions';

export const subscriptionService = {
  async getAll(): Promise<SubscriptionResponseDTO[]> {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) throw new Error('Nie udało się pobrać subskrypcji');
    return res.json();
  },

  async create(data: SubscriptionRequestDTO): Promise<SubscriptionResponseDTO> {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Nie udało się dodać subskrypcji');
    return res.json();
  },

  async update(id: number, data: SubscriptionRequestDTO): Promise<SubscriptionResponseDTO> {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Nie udało się zaktualizować subskrypcji');
    return res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Nie udało się usunąć subskrypcji');
  },
};