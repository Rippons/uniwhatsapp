import mongoose, { Schema, type Document, type Types } from 'mongoose';
import { NOTIFICATION_STATUS } from '@shared/constants';

export interface INotification extends Document {
  title: string;
  message: string;
  targetStudents: Types.ObjectId[];
  sentBy: Types.ObjectId;
  status: keyof typeof NOTIFICATION_STATUS;
  scheduledAt: Date | null;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    targetStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    sentBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
    scheduledAt: { type: Date, default: null },
    status: {
      type: String,
      enum: Object.values(NOTIFICATION_STATUS),
      default: NOTIFICATION_STATUS.PENDING,
    },
    sentAt: { type: Date, default: null },
  },
  { timestamps: true },
);

notificationSchema.index({ status: 1, scheduledAt: 1 });
notificationSchema.index({ sentBy: 1 });

const existingNotificationModel = mongoose.models.Notification as mongoose.Model<INotification> | undefined;
if (existingNotificationModel) {
  const statusPath = existingNotificationModel.schema.path('status');
  const enumValues = (statusPath as any)?.enumValues as string[] | undefined;
  if (!enumValues?.includes(NOTIFICATION_STATUS.SCHEDULED)) {
    delete mongoose.models.Notification;
  }
}

export const NotificationModel =
  mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', notificationSchema);
