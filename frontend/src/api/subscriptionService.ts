import type { SubscriptionRequestDTO, SubscriptionResponseDTO } from '../types/subscription';

const API_URL = '/api/subscriptions';

export const subscriptionService = {
  async getAll(): Promise<SubscriptionResponseDTO[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch subscriptions');
    return res.json();
  },

  async getById(id: number): Promise<SubscriptionResponseDTO> {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch subscription');
    return res.json();
  },

  async create(dto: SubscriptionRequestDTO): Promise<SubscriptionResponseDTO> {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Failed to create subscription');
    return res.json();
  },

  async update(id: number, dto: SubscriptionRequestDTO): Promise<SubscriptionResponseDTO> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Failed to update subscription');
    return res.json();
  },

  async changeStatus(id: number, status: String): Promise<SubscriptionResponseDTO> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update subscription');
    return res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete subscription');
  },
};