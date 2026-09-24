import mongoose, { Schema, Document } from 'mongoose';

export type ProblemDifficulty = 'easy' | 'medium' | 'hard';

export interface IProblem extends Document {
  title: string;
  slug: string;
  description: string;
  requirements: string[];
  constraints?: string[];
  difficulty: ProblemDifficulty;
  createdAt: Date;
  updatedAt: Date;
}

const ProblemSchema = new Schema<IProblem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    requirements: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'A problem must have at least one requirement',
      },
    },
    constraints: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id ? ret._id.toString() : '';
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

ProblemSchema.index({ slug: 1 }, { unique: true });

export const ProblemModel = mongoose.model<IProblem>('Problem', ProblemSchema);
