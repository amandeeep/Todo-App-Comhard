import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Section name is required'],
      trim: true,
      maxlength: [100, 'Section name cannot exceed 100 characters'],
    },
    order: { type: Number, default: 0 },
    color: { type: String, default: '#6366f1' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', default: null },
    isDefault: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

sectionSchema.index({ createdBy: 1, isDeleted: 1 });
sectionSchema.index({ order: 1 });

export default mongoose.model('Section', sectionSchema);
