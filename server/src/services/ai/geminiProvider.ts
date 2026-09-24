import { AIProvider, EvaluationContext, AIResponse } from './aiProvider.js';
import { buildEvaluationSystemPrompt, buildEvaluationUserPrompt } from './evaluationPrompt.js';
import { parseAndValidateAIResponse } from './parseAIResponse.js';
import { env } from '../../config/env.js';

export class GeminiProvider implements AIProvider {
  readonly name: string;
  private readonly apiKey: string;
  readonly models: string[];

  constructor(apiKey?: string, models?: string[]) {
    this.apiKey = apiKey || env.GEMINI_API_KEY || '';
    if (models && models.length > 0) {
      this.models = models;
    } else {
      const primary = env.GEMINI_PRIMARY_MODEL || 'gemini-3.8-flash';
      const fallbacks = (env.GEMINI_FALLBACK_MODELS || 'gemini-3.7-flash,gemini-3.6-flash')
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);
      this.models = [primary, ...fallbacks];
    }
    this.name = `gemini (${this.models.join(' -> ')})`;
  }

  /**
   * Evaluates whether an error is eligible for fallback (rate limits, 503 capacity, 429, timeouts).
   * Client-side misconfigurations (like 400 Bad Request) are NOT eligible for fallback.
   */
  private isEligibleForFallback(status: number, message: string): boolean {
    if (status === 429 || status === 503 || status === 500 || status === 504) {
      return true;
    }
    const lower = message.toLowerCase();
    return (
      lower.includes('rate limit') ||
      lower.includes('quota') ||
      lower.includes('high demand') ||
      lower.includes('unavailable') ||
      lower.includes('overloaded') ||
      lower.includes('timeout')
    );
  }

  async generateEvaluation(context: EvaluationContext): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const systemPrompt = buildEvaluationSystemPrompt();
    const userPrompt = buildEvaluationUserPrompt(context);

    let lastError: Error | null = null;

    for (const model of this.models) {
      console.log(`[GeminiProvider] Attempting model: ${model}`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

      // Gemini 3 clean payload: responseMimeType json without obsolete parameters
      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      };

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          const isFallback = this.isEligibleForFallback(response.status, errorText);
          const error = new Error(`Gemini API error [${response.status}] on model ${model}: ${errorText}`);

          if (isFallback) {
            console.warn(`[GeminiProvider] Model ${model} failed with recoverable error [${response.status}]. Proceeding to fallback if available.`);
            lastError = error;
            continue;
          } else {
            // Non-transient client error (e.g. 400 bad request) - fail immediately without pointless retries
            throw error;
          }
        }

        const data = (await response.json()) as any;
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
          throw new Error(`Gemini API returned empty candidate response from model ${model}`);
        }

        const parsed = parseAndValidateAIResponse(rawText);

        console.log(`[GeminiProvider] Successfully generated evaluation using model: ${model}`);
        return {
          raw: rawText,
          parsed,
          provider: 'gemini',
        };
      } catch (err: unknown) {
        lastError = err as Error;
        const errMsg = (err as Error).message || '';
        const shouldFallback = this.isEligibleForFallback(0, errMsg);

        if (shouldFallback) {
          console.warn(`[GeminiProvider] Model ${model} encountered transient error (${errMsg}). Falling back...`);
          continue;
        } else {
          throw err;
        }
      }
    }

    throw new Error(
      `All Gemini models (${this.models.join(', ')}) failed. Last error: ${lastError?.message || 'Unknown error'}`
    );
  }
}
