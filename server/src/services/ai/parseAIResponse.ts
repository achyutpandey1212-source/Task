import { aiEvaluationOutputSchema, AIEvaluationOutput } from '../../modules/evaluations/evaluation.schema.js';
import { ValidationError } from '../../shared/errors/AppError.js';

export function parseAndValidateAIResponse(rawText: string): AIEvaluationOutput {
  if (!rawText || typeof rawText !== 'string') {
    throw new ValidationError('AI returned empty response');
  }

  let cleaned = rawText.trim();

  // Strip markdown code fences if wrapped in ```json ... ``` or ``` ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(cleaned);
  } catch (err: unknown) {
    throw new ValidationError(
      `Failed to parse AI output as JSON: ${(err as Error).message}. Raw excerpt: ${cleaned.slice(0, 100)}`
    );
  }

  const validation = aiEvaluationOutputSchema.safeParse(parsedJson);
  if (!validation.success) {
    const errorDetails = validation.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    throw new ValidationError(`AI output schema validation failed: ${errorDetails}`);
  }

  return validation.data;
}
