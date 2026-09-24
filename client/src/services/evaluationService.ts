import { api } from './api';
import { Evaluation } from '../types';

export const evaluationService = {
  async getById(id: string): Promise<Evaluation> {
    const response = await api.get<{ status: string; evaluation: Evaluation }>(
      `/api/evaluations/${id}`
    );
    return response.data.evaluation;
  },

  async retry(id: string): Promise<{ status: string; evaluationId: string; attemptId: string }> {
    const response = await api.post<{ status: string; evaluationId: string; attemptId: string }>(
      `/api/evaluations/${id}/retry`
    );
    return response.data;
  },
};
