import { api } from './api';
import { HealthResponse } from '../types';

export const healthService = {
  async getHealth(): Promise<HealthResponse> {
    const response = await api.get<HealthResponse>('/api/health');
    return response.data;
  },
};
