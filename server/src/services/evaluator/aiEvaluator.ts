import { Evaluator, EvaluatorResult } from './evaluator.js';
import { IProblem } from '../../modules/problems/problem.model.js';
import { ISubmission } from '../../modules/submissions/submission.model.js';
import { AIProvider, EvaluationContext } from '../ai/aiProvider.js';
import { GeminiProvider } from '../ai/geminiProvider.js';
import { GroqProvider } from '../ai/groqProvider.js';
import { ServiceUnavailableError } from '../../shared/errors/AppError.js';

export class AIEvaluator implements Evaluator {
  private providers: AIProvider[];

  constructor(providers?: AIProvider[]) {
    this.providers = providers && providers.length > 0
      ? providers
      : [new GeminiProvider(), new GroqProvider()];
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

    // Provider Fallback chain: Provider 1 (Gemini) -> Provider 2 (Groq)
    for (const provider of this.providers) {
      try {
        console.log(`[AIEvaluator] Attempting evaluation using provider: ${provider.name}`);
        const response = await provider.generateEvaluation(context);
        console.log(`[AIEvaluator] Evaluation successfully completed with provider: ${provider.name}`);

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
        console.warn(`[AIEvaluator] Provider ${provider.name} failed:`, lastError.message);
      }
    }

    throw new ServiceUnavailableError(
      `All AI evaluation providers failed. Last error: ${lastError?.message || 'Unknown provider error'}`
    );
  }
}

export const aiEvaluator = new AIEvaluator();
