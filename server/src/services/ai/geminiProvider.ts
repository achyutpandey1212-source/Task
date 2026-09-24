import { AIProvider, EvaluationContext, AIResponse } from './aiProvider.js';
import { buildEvaluationSystemPrompt, buildEvaluationUserPrompt } from './evaluationPrompt.js';
import { parseAndValidateAIResponse } from './parseAIResponse.js';

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini';
  private readonly apiKey: string;
  private readonly model: string;

  constructor(apiKey?: string, model = 'gemini-2.5-flash') {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    this.model = model;
  }

  async generateEvaluation(context: EvaluationContext): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const systemPrompt = buildEvaluationSystemPrompt();
    const userPrompt = buildEvaluationUserPrompt(context);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error [${response.status}]: ${errorText}`);
    }

    const data = (await response.json()) as any;
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Gemini API returned empty candidate response');
    }

    const parsed = parseAndValidateAIResponse(rawText);

    return {
      raw: rawText,
      parsed,
      provider: 'gemini',
    };
  }
}
