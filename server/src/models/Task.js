import mongoose from 'mongoose';

const STATUSES = ['Backlog', 'To Do', 'In Progress', 'In Review', 'Done'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const SLA_STATUSES = ['N/A', 'On Track', 'At Risk', 'Breached', 'Met'];

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ['created', 'status_change', 'priority_change', 'edited', 'assigned', 'completed', 'reopened', 'deleted', 'restored'],
    },
    field: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'To Do',
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: 'Medium',
    },
    startAt: { type: Date, default: null },
    dueAt: { type: Date, default: null },
    estimatedDurationMinutes: { type: Number, default: null, min: [0, 'Duration cannot be negative'] },
    actualDurationMinutes: { type: Number, default: null, min: [0, 'Duration cannot be negative'] },
    timeSpentMinutes: { type: Number, default: 0, min: [0, 'Time spent cannot be negative'] },
    slaDurationMinutes: { type: Number, default: null, min: [0, 'SLA duration cannot be negative'] },
    slaStatus: { type: String, enum: SLA_STATUSES, default: 'N/A' },
    slaDeadline: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', default: null },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', default: null },
    tags: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    activity: [activitySchema],
  },
  { timestamps: true }
);

taskSchema.index({ createdBy: 1, isDeleted: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueAt: 1 });
taskSchema.index({ slaStatus: 1 });
taskSchema.index({ sectionId: 1 });
taskSchema.index({ tags: 1 });
taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ createdBy: 1, status: 1, isDeleted: 1 });
taskSchema.index({ createdBy: 1, dueAt: 1, isDeleted: 1 });

taskSchema.pre('save', function () {
  this.calculateSlaStatus();
});

taskSchema.methods.calculateSlaStatus = function () {
  if (!this.slaDurationMinutes || this.slaDurationMinutes <= 0) {
    this.slaStatus = 'N/A';
    this.slaDeadline = null;
    return;
  }

  const startTime = this.startAt || this.createdAt || new Date();
  this.slaDeadline = new Date(startTime.getTime() + this.slaDurationMinutes * 60 * 1000);

  const now = new Date();
  const atRiskThreshold = parseFloat(process.env.SLA_AT_RISK_THRESHOLD || '0.2');

  if (this.status === 'Done' && this.completedAt) {
    this.slaStatus = this.completedAt <= this.slaDeadline ? 'Met' : 'Breached';
  } else {
    if (now > this.slaDeadline) {
      this.slaStatus = 'Breached';
    } else {
      const totalDuration = this.slaDeadline.getTime() - startTime.getTime();
      const remainingTime = this.slaDeadline.getTime() - now.getTime();
      const remainingRatio = remainingTime / totalDuration;
      this.slaStatus = remainingRatio <= atRiskThreshold ? 'At Risk' : 'On Track';
    }
  }
};

taskSchema.statics.STATUSES = STATUSES;
taskSchema.statics.PRIORITIES = PRIORITIES;
taskSchema.statics.SLA_STATUSES = SLA_STATUSES;

export default mongoose.model('Task', taskSchema);
