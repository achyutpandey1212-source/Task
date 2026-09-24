import { IProblem } from '../../modules/problems/problem.model.js';
import { ISubmission } from '../../modules/submissions/submission.model.js';
import { AIEvaluationOutput } from '../../modules/evaluations/evaluation.schema.js';

export interface EvaluatorResult {
  summary: string;
  overallScore: number;
  criteria: AIEvaluationOutput['criteria'];
  provider: string;
}

export interface Evaluator {
  evaluate(problem: IProblem, submission: ISubmission): Promise<EvaluatorResult>;
}
