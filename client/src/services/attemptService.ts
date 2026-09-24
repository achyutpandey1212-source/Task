import { api } from './api';
import { Attempt, Submission, SubmitSolutionPayload } from '../types';

export const attemptService = {
  async create(problemId: string): Promise<Attempt> {
    const response = await api.post<{ attempt: Attempt }>('/api/attempts', { problemId });
    return response.data.attempt;
  },

  async getAll(): Promise<Attempt[]> {
    const response = await api.get<{ attempts: Attempt[] }>('/api/attempts');
    return response.data.attempts;
  },

  async getById(id: string): Promise<{ attempt: Attempt; submission: Submission | null }> {
    const response = await api.get<{ attempt: Attempt; submission: Submission | null }>(
      `/api/attempts/${id}`
    );
    return response.data;
  },

  async submit(
    attemptId: string,
    payload: SubmitSolutionPayload
  ): Promise<{ attemptId: string; submissionId: string; status: string }> {
    const response = await api.post<{
      attemptId: string;
      submissionId: string;
      status: string;
    }>(`/api/attempts/${attemptId}/submit`, payload);
    return response.data;
  },
};
