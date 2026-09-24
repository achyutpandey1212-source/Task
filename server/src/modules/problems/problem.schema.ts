import { z } from 'zod';

export const problemIdParamSchema = z.object({
  id: z.string().min(1, 'Problem ID is required'),
});

export const problemResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  requirements: z.array(z.string()),
  constraints: z.array(z.string()).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export type ProblemResponse = z.infer<typeof problemResponseSchema>;
