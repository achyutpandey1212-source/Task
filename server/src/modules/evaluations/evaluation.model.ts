import mongoose, { Schema, Document } from 'mongoose';

export type CriterionType =
  | 'requirement_understanding'
  | 'responsibilities'
  | 'coupling_cohesion'
  | 'abstraction_interfaces'
  | 'extensibility'
  | 'edge_cases_testability'
  | 'reasoning';

export interface IEvaluationCriterion {
  criterion: CriterionType;
  score: number;
  evidence: string;
  concern: string;
  suggestion: string;
  confidence: number;
}

export type EvaluationStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface IEvaluation extends Document {
  submissionId: mongoose.Types.ObjectId;
  attemptId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: EvaluationStatus;
  overallScore?: number;
  criteria: IEvaluationCriterion[];
  summary?: string;
  errorMessage?: string;
  createdAt: Date;
  completedAt?: Date;
  updatedAt: Date;
}

const EvaluationCriterionSchema = new Schema<IEvaluationCriterion>(
  {
    criterion: {
      type: String,
      enum: [
        'requirement_understanding',
        'responsibilities',
        'coupling_cohesion',
        'abstraction_interfaces',
        'extensibility',
        'edge_cases_testability',
        'reasoning',
      ],
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    evidence: {
      type: String,
      required: true,
    },
    concern: {
      type: String,
      required: true,
    },
    suggestion: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
  },
  { _id: false }
);

const EvaluationSchema = new Schema<IEvaluation>(
  {
    submissionId: {
      type: Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
      unique: true,
      index: true,
    },
    attemptId: {
      type: Schema.Types.ObjectId,
      ref: 'Attempt',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED'],
      default: 'PENDING',
      required: true,
      index: true,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },
    criteria: {
      type: [EvaluationCriterionSchema],
      default: [],
    },
    summary: {
      type: String,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
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

export const EvaluationModel = mongoose.model<IEvaluation>('Evaluation', EvaluationSchema);
