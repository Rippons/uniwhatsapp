import { logger } from '@core/logger';
import { whatsappProvider } from '@modules/whatsapp/provider';
import { connectDatabase } from '@core/database';
import { NOTIFICATION_STATUS } from '@shared/constants';

export interface QueueJob<T = unknown> {
  id: string;
  data: T;
  createdAt: Date;
  attempts: number;
}

type JobHandler<T> = (job: QueueJob<T>) => Promise<void>;

export class SimpleQueue<T = unknown> {
  private queue: QueueJob<T>[] = [];
  private processing = false;
  private handler: JobHandler<T>;
  private maxRetries: number;
  private name: string;

  constructor(name: string, handler: JobHandler<T>, maxRetries = 3) {
    this.name = name;
    this.handler = handler;
    this.maxRetries = maxRetries;
  }

  add(data: T): string {
    const id = crypto.randomUUID();
    this.queue.push({ id, data, createdAt: new Date(), attempts: 0 });
    logger.debug('[Queue:' + this.name + '] Job ' + id + ' added. Pending: ' + this.queue.length);
    this.process();
    return id;
  }

  private async process(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift()!;
      job.attempts++;

      try {
        await this.handler(job);
        logger.debug('[Queue:' + this.name + '] Job ' + job.id + ' completed');
      } catch (error) {
        logger.error('[Queue:' + this.name + '] Job ' + job.id + ' failed (attempt ' + job.attempts + '):', error);
        if (job.attempts < this.maxRetries) {
          const delay = Math.pow(2, job.attempts - 1) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
          this.queue.push(job);
        } else {
          logger.error('[Queue:' + this.name + '] Job ' + job.id + ' exhausted retries. Dropping.');
        }
      }
    }

    this.processing = false;
  }

  get pending(): number {
    return this.queue.length;
  }

  get isProcessing(): boolean {
    return this.processing;
  }

  getStatus() {
    return {
      name: this.name,
      pending: this.queue.length,
      processing: this.processing,
    };
  }
}

// Cola principal para envío de notificaciones WhatsApp
export const whatsappNotificationQueue = new SimpleQueue<string>(
  'whatsapp-notifications',
  async (job) => {
    // Imports dinámicos para evitar importación circular
    const { notificationRepository } = await import('@modules/notifications/repository');
    const { StudentModel } = await import('@modules/students/model');

    const notification = await notificationRepository.findById(job.data);
    if (!notification) {
      logger.warn('[Queue] Notification ' + job.data + ' not found, skipping');
      return;
    }

    for (const studentId of notification.targetStudents) {
      const student = await StudentModel.findById(studentId);
      if (!student || !student.phone) {
        logger.warn('[Queue] Student ' + studentId + ' not found or has no phone');
        continue;
      }

      await whatsappProvider.sendMessage({
        to: student.phone,
        body: '*' + notification.title + '*\n\n' + notification.message,
      });

      logger.info('[Queue] Notification sent to student ' + student.phone);
    }

    await notificationRepository.updateStatus(job.data, 'SENT', new Date());
    logger.info('[Queue] Notification ' + job.data + ' completed for ' + notification.targetStudents.length + ' students');
  },
  3,
);

async function dispatchScheduledNotifications(): Promise<void> {
  try {
    await connectDatabase();
    const { notificationRepository } = await import('@modules/notifications/repository');
    const notifications = await notificationRepository.findScheduledDue();
    if (!notifications.length) return;

    for (const notification of notifications) {
      await notificationRepository.updateStatus(String(notification._id), NOTIFICATION_STATUS.PENDING);
      whatsappNotificationQueue.add(String(notification._id));
      logger.info('[Scheduler] Scheduled notification ' + notification._id + ' queued');
    }
  } catch (error) {
    logger.error('[Scheduler] Error dispatching scheduled notifications:', error);
  }
}

setInterval(() => {
  void dispatchScheduledNotifications();
}, 30_000);

void dispatchScheduledNotifications();