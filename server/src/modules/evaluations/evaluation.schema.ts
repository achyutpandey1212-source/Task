import { z } from 'zod';

export const CRITERION_KEYS = [
  'requirement_understanding',
  'responsibilities',
  'coupling_cohesion',
  'abstraction_interfaces',
  'extensibility',
  'edge_cases_testability',
  'reasoning',
] as const;

export const criterionTypeSchema = z.enum(CRITERION_KEYS);

export const evaluationCriterionSchema = z.object({
  criterion: criterionTypeSchema,
  score: z.number().min(0).max(10),
  evidence: z.string().min(1, 'Evidence must not be empty'),
  concern: z.string().min(1, 'Concern must not be empty'),
  suggestion: z.string().min(1, 'Suggestion must not be empty'),
  confidence: z.number().min(0).max(1),
});

export const aiEvaluationOutputSchema = z.object({
  summary: z.string().min(1, 'Summary must not be empty'),
  criteria: z
    .array(evaluationCriterionSchema)
    .length(7, 'AI output must contain exactly 7 rubric criteria')
    .refine(
      (criteria) => {
        const found = new Set(criteria.map((c) => c.criterion));
        return CRITERION_KEYS.every((key) => found.has(key));
      },
      {
        message: 'AI output must contain all 7 distinct rubric criteria',
      }
    ),
});

export const evaluationIdParamSchema = z.object({
  id: z.string().min(1, 'Evaluation ID is required'),
});

export type AIEvaluationOutput = z.infer<typeof aiEvaluationOutputSchema>;
export type EvaluationCriterionInput = z.infer<typeof evaluationCriterionSchema>;
