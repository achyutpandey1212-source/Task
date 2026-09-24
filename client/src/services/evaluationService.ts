import { api } from './api';
import { Evaluation } from '../types';

export const evaluationService = {
  async getById(id: string): Promise<Evaluation> {
    const response = await api.get<{ status: string; evaluation: Evaluation }>(
      `/api/evaluations/${id}`
    );
    return response.data.evaluation;
  },
};
