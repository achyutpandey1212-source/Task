import { AIProvider, EvaluationContext, AIResponse } from './aiProvider.js';
import { buildEvaluationSystemPrompt, buildEvaluationUserPrompt } from './evaluationPrompt.js';
import { parseAndValidateAIResponse } from './parseAIResponse.js';

export class GroqProvider implements AIProvider {
  readonly name = 'groq';
  private readonly apiKey: string;
  private readonly model: string;

  constructor(apiKey?: string, model = 'llama-3.3-70b-versatile') {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || '';
    this.model = model;
  }

  async generateEvaluation(context: EvaluationContext): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    const systemPrompt = buildEvaluationSystemPrompt();
    const userPrompt = buildEvaluationUserPrompt(context);

    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const requestBody = {
      model: this.model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error [${response.status}]: ${errorText}`);
    }

    const data = (await response.json()) as any;
    const rawText = data?.choices?.[0]?.message?.content;

    if (!rawText) {
      throw new Error('Groq API returned empty message response');
    }

    const parsed = parseAndValidateAIResponse(rawText);

    return {
      raw: rawText,
      parsed,
      provider: 'groq',
    };
  }
}
