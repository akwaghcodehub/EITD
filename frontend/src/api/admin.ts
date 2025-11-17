import apiClient from './client';
import { Item, Claim, User } from '../types';

export const adminAPI = {
  getAllItems: async (): Promise<Item[]> => {
    const response = await apiClient.get('/admin/items');
    return response.data;
  },

  getAllClaims: async (): Promise<Claim[]> => {
    const response = await apiClient.get('/admin/claims');
    return response.data;
  },

  updateClaimStatus: async (claimId: string, status: 'approved' | 'rejected'): Promise<Claim> => {
    const response = await apiClient.patch(`/admin/claims/${claimId}`, { status });
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  deleteItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/items/${id}`);
  },
};
