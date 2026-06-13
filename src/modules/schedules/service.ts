import { NotFoundError } from '@shared/errors';
import { scheduleRepository } from './repository';
import type { CreateScheduleInput, UpdateScheduleInput } from './types';
import type { ISchedule } from './model';
import type { DayOfWeek } from '@shared/constants';

export class ScheduleService {
  async getByStudentId(studentId: string): Promise<ISchedule[]> {
    return scheduleRepository.findByStudentId(studentId);
  }

  async getByStudentAndDay(studentId: string, day: DayOfWeek): Promise<ISchedule[]> {
    return scheduleRepository.findByStudentAndDay(studentId, day);
  }

  async create(input: CreateScheduleInput): Promise<ISchedule> {
    return scheduleRepository.create(input);
  }

  async getSummary(): Promise<{ totalSchedules: number; studentsWithSchedule: number }> {
    const [totalSchedules, studentsWithSchedule] = await Promise.all([
      scheduleRepository.countTotalSchedules(),
      scheduleRepository.countStudentsWithSchedule(),
    ]);
    return { totalSchedules, studentsWithSchedule };
  }

  async getRecent(limit = 5): Promise<any[]> {
    return scheduleRepository.findRecent(limit);
  }

  async update(id: string, input: UpdateScheduleInput): Promise<ISchedule> {
    const schedule = await scheduleRepository.update(id, input);
    if (!schedule) throw new NotFoundError('Schedule');
    return schedule;
  }

  async delete(id: string): Promise<void> {
    const schedule = await scheduleRepository.delete(id);
    if (!schedule) throw new NotFoundError('Schedule');
  }
}

export const scheduleService = new ScheduleService();
