import { Evaluator, EvaluatorResult } from './evaluator.js';
import { IProblem } from '../../modules/problems/problem.model.js';
import { ISubmission } from '../../modules/submissions/submission.model.js';
import { AIProvider, EvaluationContext } from '../ai/aiProvider.js';
import { GeminiProvider } from '../ai/geminiProvider.js';
import { GroqProvider } from '../ai/groqProvider.js';
import { ServiceUnavailableError } from '../../shared/errors/AppError.js';
import { isTransientError, getExponentialBackoffDelay } from './retryHelper.js';

export interface AIEvaluatorOptions {
  maxRetries?: number;
  initialRetryDelayMs?: number;
  maxRetryDelayMs?: number;
}

export class AIEvaluator implements Evaluator {
  private providers: AIProvider[];
  private maxRetries: number;
  private initialRetryDelayMs: number;
  private maxRetryDelayMs: number;

  constructor(providers?: AIProvider[], options?: AIEvaluatorOptions) {
    this.providers =
      providers && providers.length > 0
        ? providers
        : [new GeminiProvider(), new GroqProvider()];
    this.maxRetries = options?.maxRetries ?? 3;
    this.initialRetryDelayMs = options?.initialRetryDelayMs ?? 1000;
    this.maxRetryDelayMs = options?.maxRetryDelayMs ?? 4000;
  }

  async evaluate(problem: IProblem, submission: ISubmission): Promise<EvaluatorResult> {
    const context: EvaluationContext = {
      problem: {
        title: problem.title,
        description: problem.description,
        requirements: problem.requirements,
        constraints: problem.constraints,
      },
      submission: {
        format: 'structured-text',
        requirements: submission.requirements,
        design: submission.design,
        reasoning: submission.reasoning,
        edgeCases: submission.edgeCases,
      },
    };

    let lastError: Error | null = null;
    let anyTransientInCycle = false;

    // Retry cycle: initial attempt (retry = 0) followed by up to maxRetries
    for (let retryCount = 0; retryCount <= this.maxRetries; retryCount++) {
      if (retryCount > 0) {
        const delay = getExponentialBackoffDelay(
          retryCount - 1,
          this.initialRetryDelayMs,
          this.maxRetryDelayMs
        );
        console.log(
          `[evaluation] backoff retry=${retryCount}/${this.maxRetries} delayMs=${delay}`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      console.log(`[evaluation] start cycle attempt=${retryCount + 1}/${this.maxRetries + 1}`);
      anyTransientInCycle = false;

      // Provider Fallback chain: Gemini (with inner model fallback) -> Groq
      for (const provider of this.providers) {
        try {
          console.log(`[evaluation] provider_attempt provider=${provider.name}`);
          const response = await provider.generateEvaluation(context);
          console.log(`[evaluation] completed provider=${provider.name}`);

          // Deterministic backend calculation of overallScore
          const total = response.parsed.criteria.reduce((sum, c) => sum + c.score, 0);
          const overallScore = Math.round((total / response.parsed.criteria.length) * 10) / 10;

          return {
            summary: response.parsed.summary,
            overallScore,
            criteria: response.parsed.criteria,
            provider: provider.name,
          };
        } catch (err: unknown) {
          lastError = err as Error;
          const isTransient = isTransientError(err);
          if (isTransient) {
            anyTransientInCycle = true;
          }
          console.warn(
            `[evaluation] ${isTransient ? 'transient_failure' : 'non_transient_failure'} provider=${provider.name}: ${lastError.message}`
          );
        }
      }

      // If no providers succeeded and none had transient errors (e.g., all 400 Bad Request or invalid auth without network issue),
      // stop retrying early.
      if (!anyTransientInCycle && retryCount === 0) {
        console.warn('[evaluation] All provider failures were non-transient. Skipping further retries.');
        break;
      }
    }

    console.error(
      `[evaluation] permanently_failed after retries. Last error: ${lastError?.message || 'Unknown error'}`
    );

    throw new ServiceUnavailableError(
      `All AI evaluation providers failed after retries. Last error: ${lastError?.message || 'Unknown provider error'}`
    );
  }
}

export const aiEvaluator = new AIEvaluator();
