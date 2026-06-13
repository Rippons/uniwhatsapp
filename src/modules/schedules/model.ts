import mongoose, { Schema, type Document, type Types } from 'mongoose';
import type { DayOfWeek } from '@shared/constants';
import { DAYS_OF_WEEK } from '@shared/constants';

export interface ISchedule extends Document {
  studentId: Types.ObjectId;
  subject: string;
  classroom: string;
  teacher: string;
  startTime: string;
  endTime: string;
  day: DayOfWeek;
  createdAt: Date;
  updatedAt: Date;
}

const scheduleSchema = new Schema<ISchedule>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: String, required: true, trim: true },
    classroom: { type: String, required: true, trim: true },
    teacher: { type: String, required: true, trim: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    day: { type: String, required: true, enum: DAYS_OF_WEEK },
  },
  { timestamps: true },
);

scheduleSchema.index({ studentId: 1, day: 1 });

export const ScheduleModel =
  mongoose.models.Schedule || mongoose.model<ISchedule>('Schedule', scheduleSchema);
