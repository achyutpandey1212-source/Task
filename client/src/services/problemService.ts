import { api } from './api';
import { Problem } from '../types';

export const problemService = {
  async getAll(): Promise<Problem[]> {
    const response = await api.get<{ problems: Problem[] }>('/api/problems');
    return response.data.problems;
  },

  async getById(id: string): Promise<Problem> {
    const response = await api.get<{ problem: Problem }>(`/api/problems/${id}`);
    return response.data.problem;
  },
};
