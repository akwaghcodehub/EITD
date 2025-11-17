import apiClient from './client';
import { Item } from '../types';

export const itemsAPI = {
  getAllItems: async (): Promise<Item[]> => {
    const response = await apiClient.get('/items');
    return response.data;
  },

  getItemsByType: async (type: 'lost' | 'found'): Promise<Item[]> => {
    const response = await apiClient.get(`/items?type=${type}`);
    return response.data;
  },

  getItemById: async (id: string): Promise<Item> => {
    const response = await apiClient.get(`/items/${id}`);
    return response.data;
  },

  searchItems: async (query: string): Promise<Item[]> => {
    const response = await apiClient.get(`/items/search?q=${query}`);
    return response.data;
  },

  createItem: async (itemData: Partial<Item>): Promise<Item> => {
    const response = await apiClient.post('/items', itemData);
    return response.data;
  },

  updateItem: async (id: string, itemData: Partial<Item>): Promise<Item> => {
    const response = await apiClient.put(`/items/${id}`, itemData);
    return response.data;
  },

  deleteItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/items/${id}`);
  },

  getMyItems: async (): Promise<Item[]> => {
    const response = await apiClient.get('/items/my-items');
    return response.data;
  },
};
