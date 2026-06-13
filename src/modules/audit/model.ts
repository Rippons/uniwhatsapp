import mongoose, { Schema, type Document, type Types } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  user: Types.ObjectId;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

auditLogSchema.index({ action: 1 });
auditLogSchema.index({ user: 1 });
auditLogSchema.index({ createdAt: -1 });

export const AuditLogModel =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
