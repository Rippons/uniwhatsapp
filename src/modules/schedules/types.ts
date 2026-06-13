import type { DayOfWeek } from '@shared/constants';

export interface CreateScheduleInput {
  studentId: string;
  subject: string;
  classroom: string;
  teacher: string;
  startTime: string;
  endTime: string;
  day: DayOfWeek;
}

export interface UpdateScheduleInput {
  subject?: string;
  classroom?: string;
  teacher?: string;
  startTime?: string;
  endTime?: string;
  day?: DayOfWeek;
}
