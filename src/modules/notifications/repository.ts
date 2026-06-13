import { NotificationModel, type INotification } from './model';
import type { CreateNotificationInput } from './types';
import { NOTIFICATION_STATUS } from '@shared/constants';

export class NotificationRepository {
  async findAll(page = 1, limit = 20): Promise<{ notifications: INotification[]; total: number }> {
    const [notifications, total] = await Promise.all([
      NotificationModel.find()
        .populate('sentBy', 'name email')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      NotificationModel.countDocuments(),
    ]);
    return { notifications, total };
  }

  async findById(id: string): Promise<INotification | null> {
    return NotificationModel.findById(id).populate('sentBy', 'name email');
  }

  async findScheduledDue(): Promise<INotification[]> {
    return NotificationModel.find({
      status: NOTIFICATION_STATUS.SCHEDULED,
      scheduledAt: { $lte: new Date() },
    }).populate('targetStudents', 'phone');
  }

  async create(data: CreateNotificationInput): Promise<INotification> {
    return NotificationModel.create(data);
  }

  async updateStatus(
    id: string,
    status: string,
    sentAt?: Date,
  ): Promise<INotification | null> {
    const update: Record<string, unknown> = { status };
    if (typeof sentAt !== 'undefined') {
      update.sentAt = sentAt;
    }
    return NotificationModel.findByIdAndUpdate(id, update, { new: true });
  }

  async findPending(): Promise<INotification[]> {
    return NotificationModel.find({ status: 'PENDING' }).populate('targetStudents', 'phone');
  }

  async delete(id: string): Promise<INotification | null> {
    return NotificationModel.findByIdAndDelete(id);
  }
}

export const notificationRepository = new NotificationRepository();
