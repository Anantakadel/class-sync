import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  status: 'submitted' | 'late';
  feedback?: string;
  submittedAt: Date;
  files?: string[];
  text?: string;
}

const submissionSchema = new Schema<ISubmission>({
  assignmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['submitted', 'late'],
    default: 'submitted'
  },
  feedback: {
    type: String,
    trim: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  files: [{
    type: String
  }],
  text: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
submissionSchema.index({ assignmentId: 1, status: 1 });
submissionSchema.index({ studentId: 1, status: 1 });

export default mongoose.model<ISubmission>('Submission', submissionSchema); 