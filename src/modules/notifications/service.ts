import { NOTIFICATION_STATUS } from '@shared/constants';
import { notificationRepository } from './repository';
import { whatsappNotificationQueue } from '@core/queue';
import { logger } from '@core/logger';
import type { CreateNotificationInput } from './types';
import type { INotification } from './model';

export class NotificationService {
  async getAll(page: number, limit: number): Promise<{ notifications: INotification[]; total: number }> {
    return notificationRepository.findAll(page, limit);
  }

  async create(input: CreateNotificationInput): Promise<INotification> {
    const scheduledAt = input.scheduledAt ? new Date(input.scheduledAt as string) : null;
    const now = new Date();
    const status =
      scheduledAt && scheduledAt.getTime() > now.getTime()
        ? NOTIFICATION_STATUS.SCHEDULED
        : NOTIFICATION_STATUS.PENDING;

    const notification = await notificationRepository.create({
      ...input,
      scheduledAt,
      status,
    });

    if (status === NOTIFICATION_STATUS.PENDING) {
      whatsappNotificationQueue.add(String(notification._id));
    } else {
      const delay = scheduledAt!.getTime() - Date.now();
      logger.info('[Notifications] Scheduled in ' + Math.round(delay / 1000) + 's');
      setTimeout(() => {
        whatsappNotificationQueue.add(String(notification._id));
      }, delay);
    }

    return notification;
  }

  async sendToFaculty(
    faculty: string,
    title: string,
    message: string,
    sentBy: string,
    scheduledAt?: string,
  ): Promise<{ queued: number }> {
    const { StudentModel } = await import('@modules/students/model');
    const students = await StudentModel.find({ faculty, active: true }).select('_id');

    if (!students.length) {
      logger.warn('[Notifications] No active students in faculty: ' + faculty);
      return { queued: 0 };
    }

    const targetStudents = students.map(s => String(s._id));
    const notification = await notificationRepository.create({
      title,
      message,
      targetStudents,
      sentBy,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      status: NOTIFICATION_STATUS.PENDING,
    });

    if (scheduledAt && new Date(scheduledAt) > new Date()) {
      const delay = new Date(scheduledAt).getTime() - Date.now();
      setTimeout(() => whatsappNotificationQueue.add(String(notification._id)), delay);
    } else {
      whatsappNotificationQueue.add(String(notification._id));
    }

    logger.info('[Notifications] Mass notification queued for ' + targetStudents.length + ' students in ' + faculty);
    return { queued: targetStudents.length };
  }

  async sendToAll(
    title: string,
    message: string,
    sentBy: string,
    scheduledAt?: string,
  ): Promise<{ queued: number }> {
    const { StudentModel } = await import('@modules/students/model');
    const students = await StudentModel.find({ active: true }).select('_id');

    if (!students.length) return { queued: 0 };

    const targetStudents = students.map(s => String(s._id));
    const notification = await notificationRepository.create({
      title,
      message,
      targetStudents,
      sentBy,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      status: NOTIFICATION_STATUS.PENDING,
    });

    if (scheduledAt && new Date(scheduledAt) > new Date()) {
      const delay = new Date(scheduledAt).getTime() - Date.now();
      setTimeout(() => whatsappNotificationQueue.add(String(notification._id)), delay);
    } else {
      whatsappNotificationQueue.add(String(notification._id));
    }

    logger.info('[Notifications] Mass notification queued for ALL ' + targetStudents.length + ' students');
    return { queued: targetStudents.length };
  }

  async delete(id: string): Promise<INotification | null> {
    return notificationRepository.delete(id);
  }
}

export const notificationService = new NotificationService();