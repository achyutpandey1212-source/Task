import { z } from 'zod';

export const createAttemptSchema = z.object({
  problemId: z.string().min(1, 'Problem ID is required'),
});

export const attemptIdParamSchema = z.object({
  id: z.string().min(1, 'Attempt ID is required'),
});

export const submitSolutionSchema = z.object({
  requirements: z.object({
    assumptions: z.string().max(10000, 'Assumptions too long'),
    constraints: z.string().max(10000, 'Constraints too long'),
  }),
  design: z.object({
    classes: z.string().min(1, 'Classes design is required').max(20000, 'Classes design too long'),
    relationships: z.string().max(10000, 'Relationships too long'),
    interfaces: z.string().max(10000, 'Interfaces too long'),
  }),
  reasoning: z.object({
    decisions: z.string().max(10000, 'Decisions too long'),
    patterns: z.string().max(10000, 'Patterns too long'),
    tradeoffs: z.string().max(10000, 'Trade-offs too long'),
  }),
  edgeCases: z.string().max(10000, 'Edge cases too long'),
});

export type CreateAttemptInput = z.infer<typeof createAttemptSchema>;
export type SubmitSolutionInput = z.infer<typeof submitSolutionSchema>;
