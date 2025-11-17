import apiClient from './client';
import { Claim } from '../types';

export const claimsAPI = {
  createClaim: async (itemId: string, description: string, verificationDetails: string): Promise<Claim> => {
    const response = await apiClient.post('/claims', {
      itemId,
      description,
      verificationDetails,
    });
    return response.data;
  },

  getMyClaims: async (): Promise<Claim[]> => {
    const response = await apiClient.get('/claims/my-claims');
    return response.data;
  },

  getClaimsByItem: async (itemId: string): Promise<Claim[]> => {
    const response = await apiClient.get(`/claims/item/${itemId}`);
    return response.data;
  },
};
