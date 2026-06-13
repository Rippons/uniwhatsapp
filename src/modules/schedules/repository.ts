import { ScheduleModel, type ISchedule } from './model';
import type { CreateScheduleInput, UpdateScheduleInput } from './types';
import type { DayOfWeek } from '@shared/constants';

export class ScheduleRepository {
  async findByStudentId(studentId: string): Promise<ISchedule[]> {
    return ScheduleModel.find({ studentId }).sort({ day: 1, startTime: 1 });
  }

  async findByStudentAndDay(studentId: string, day: DayOfWeek): Promise<ISchedule[]> {
    return ScheduleModel.find({ studentId, day }).sort({ startTime: 1 });
  }

  async findById(id: string): Promise<ISchedule | null> {
    return ScheduleModel.findById(id);
  }

  async create(data: CreateScheduleInput): Promise<ISchedule> {
    return ScheduleModel.create(data);
  }

  async update(id: string, data: UpdateScheduleInput): Promise<ISchedule | null> {
    return ScheduleModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<ISchedule | null> {
    return ScheduleModel.findByIdAndDelete(id);
  }

  async countTotalSchedules(): Promise<number> {
    return ScheduleModel.countDocuments({});
  }

  async countStudentsWithSchedule(): Promise<number> {
    const studentIds = await ScheduleModel.distinct('studentId');
    return studentIds.length;
  }
  
  async findRecent(limit = 5): Promise<any[]> {
    return ScheduleModel.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('studentId', 'fullName')
      .lean();
  }

}

export const scheduleRepository = new ScheduleRepository();
