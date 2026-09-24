export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface HealthResponse {
  status: string;
  database: string;
  timestamp: string;
  uptime: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
