import { ProblemModel, IProblem } from './problem.model.js';
import { NotFoundError } from '../../shared/errors/AppError.js';
import mongoose from 'mongoose';

export class ProblemService {
  async getAllProblems(): Promise<IProblem[]> {
    return ProblemModel.find().sort({ createdAt: 1 });
  }

  async getProblemById(idOrSlug: string): Promise<IProblem> {
    let problem: IProblem | null = null;

    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      problem = await ProblemModel.findById(idOrSlug);
    }

    if (!problem) {
      problem = await ProblemModel.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!problem) {
      throw new NotFoundError(`Problem with identifier '${idOrSlug}' not found`);
    }

    return problem;
  }
}

export const problemService = new ProblemService();
