import apiClient from './client';
import { MarketplaceItem } from '../types';

export const marketplaceAPI = {
  getAllItems: async (): Promise<MarketplaceItem[]> => {
    const response = await apiClient.get('/marketplace');
    return response.data;
  },

  listItem: async (itemId: string, price: number): Promise<MarketplaceItem> => {
    const response = await apiClient.post('/marketplace', { itemId, price });
    return response.data;
  },

  updateStatus: async (id: string, status: 'available' | 'sold'): Promise<MarketplaceItem> => {
    const response = await apiClient.patch(`/marketplace/${id}`, { status });
    return response.data;
  },
};
