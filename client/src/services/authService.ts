import { api } from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', { email, password, name });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  async getMe(): Promise<{ user: User }> {
    const response = await api.get<{ user: User }>('/api/auth/me');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('auth_token');
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },
};
