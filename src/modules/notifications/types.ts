export interface CreateNotificationInput {
  title: string;
  message: string;
  targetStudents: string[];
  sentBy: string;
  scheduledAt?: string | Date | null;
  status?: string;
}
