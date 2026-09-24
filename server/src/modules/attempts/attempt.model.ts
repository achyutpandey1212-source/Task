import mongoose, { Schema, Document } from 'mongoose';

export type AttemptStatus = 'DRAFT' | 'SUBMITTED' | 'EVALUATING' | 'COMPLETED' | 'FAILED';

export interface IAttempt extends Document {
  problemId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: AttemptStatus;
  submissionId?: mongoose.Types.ObjectId;
  startedAt: Date;
  submittedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AttemptSchema = new Schema<IAttempt>(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
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
      enum: ['DRAFT', 'SUBMITTED', 'EVALUATING', 'COMPLETED', 'FAILED'],
      default: 'DRAFT',
      required: true,
      index: true,
    },
    submissionId: {
      type: Schema.Types.ObjectId,
      ref: 'Submission',
      default: null,
    },
    startedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    submittedAt: {
      type: Date,
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

// Compound index for querying a user's attempts for a problem
AttemptSchema.index({ userId: 1, createdAt: -1 });
AttemptSchema.index({ userId: 1, problemId: 1 });

export const AttemptModel = mongoose.model<IAttempt>('Attempt', AttemptSchema);
