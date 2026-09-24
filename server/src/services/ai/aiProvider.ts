import { AIEvaluationOutput } from '../../modules/evaluations/evaluation.schema.js';

export interface EvaluationProblemContext {
  title: string;
  description: string;
  requirements: string[];
  constraints?: string[];
}

export interface EvaluationSubmissionContext {
  format: 'structured-text';
  requirements: {
    assumptions: string;
    constraints: string;
  };
  design: {
    classes: string;
    relationships: string;
    interfaces: string;
  };
  reasoning: {
    decisions: string;
    patterns: string;
    tradeoffs: string;
  };
  edgeCases: string;
}

export interface EvaluationContext {
  problem: EvaluationProblemContext;
  submission: EvaluationSubmissionContext;
}

export interface AIResponse {
  raw: string;
  parsed: AIEvaluationOutput;
  provider: 'gemini' | 'groq' | 'fake';
}

export interface AIProvider {
  readonly name: string;
  generateEvaluation(context: EvaluationContext): Promise<AIResponse>;
}
