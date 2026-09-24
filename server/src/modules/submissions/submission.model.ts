import mongoose, { Schema, Document } from 'mongoose';

export type SubmissionFormat = 'structured-text';

export interface ISubmissionRequirements {
  assumptions: string;
  constraints: string;
}

export interface ISubmissionDesign {
  classes: string;
  relationships: string;
  interfaces: string;
}

export interface ISubmissionReasoning {
  decisions: string;
  patterns: string;
  tradeoffs: string;
}

export interface ISubmission extends Document {
  attemptId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  format: SubmissionFormat;
  requirements: ISubmissionRequirements;
  design: ISubmissionDesign;
  reasoning: ISubmissionReasoning;
  edgeCases: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    attemptId: {
      type: Schema.Types.ObjectId,
      ref: 'Attempt',
      required: true,
      unique: true, // One final submission per attempt in Phase 2
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    format: {
      type: String,
      enum: ['structured-text'],
      default: 'structured-text',
      required: true,
    },
    requirements: {
      assumptions: { type: String, required: true, default: '' },
      constraints: { type: String, required: true, default: '' },
    },
    design: {
      classes: { type: String, required: true, default: '' },
      relationships: { type: String, required: true, default: '' },
      interfaces: { type: String, required: true, default: '' },
    },
    reasoning: {
      decisions: { type: String, required: true, default: '' },
      patterns: { type: String, required: true, default: '' },
      tradeoffs: { type: String, required: true, default: '' },
    },
    edgeCases: {
      type: String,
      required: true,
      default: '',
    },
    version: {
      type: Number,
      default: 1,
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

export const SubmissionModel = mongoose.model<ISubmission>('Submission', SubmissionSchema);
