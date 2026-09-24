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

export type ProblemDifficulty = 'easy' | 'medium' | 'hard';

export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements: string[];
  constraints?: string[];
  difficulty: ProblemDifficulty;
  createdAt: string;
  updatedAt: string;
}

export type AttemptStatus = 'DRAFT' | 'SUBMITTED' | 'EVALUATING' | 'COMPLETED' | 'FAILED';

export interface Attempt {
  id: string;
  problemId: Problem | string;
  userId: string;
  status: AttemptStatus;
  submissionId?: string | null;
  startedAt: string;
  submittedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionRequirements {
  assumptions: string;
  constraints: string;
}

export interface SubmissionDesign {
  classes: string;
  relationships: string;
  interfaces: string;
}

export interface SubmissionReasoning {
  decisions: string;
  patterns: string;
  tradeoffs: string;
}

export interface Submission {
  id: string;
  attemptId: string;
  userId: string;
  format: 'structured-text';
  requirements: SubmissionRequirements;
  design: SubmissionDesign;
  reasoning: SubmissionReasoning;
  edgeCases: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitSolutionPayload {
  requirements: SubmissionRequirements;
  design: SubmissionDesign;
  reasoning: SubmissionReasoning;
  edgeCases: string;
}
