import { scheduleService } from './service';
import { createScheduleSchema, updateScheduleSchema } from './validation';
import { successResponse, createdResponse } from '@shared/responses';
import { handleError } from '@core/middleware';
import { connectDatabase } from '@core/database';
import { validateSchema } from '@shared/utils/validation';
import { getTodayDayName } from '@shared/utils';

export class ScheduleController {
  async getByStudent(studentId: string): Promise<Response> {
    try {
      await connectDatabase();
      const schedules = await scheduleService.getByStudentId(studentId);
      return successResponse(schedules);
    } catch (error) {
      return handleError(error);
    }
  }

  async getTodayByStudent(studentId: string): Promise<Response> {
    try {
      await connectDatabase();
      const today = getTodayDayName();
      const schedules = await scheduleService.getByStudentAndDay(studentId, today);
      return successResponse(schedules, `Schedule for ${today}`);
    } catch (error) {
      return handleError(error);
    }
  }

  async create(request: Request): Promise<Response> {
    try {
      await connectDatabase();
      const body = await request.json();
      const data = validateSchema(createScheduleSchema, body);
      const schedule = await scheduleService.create(data);
      return createdResponse(schedule, 'Schedule created');
    } catch (error) {
      return handleError(error);
    }
  }

  async getSummary(): Promise<Response> {
    try {
      await connectDatabase();
      const summary = await scheduleService.getSummary();
      return successResponse(summary, 'Schedule summary');
    } catch (error) {
      return handleError(error);
    }
  }

  async getRecent(request: Request): Promise<Response> {
    try {
      await connectDatabase();
      const url = new URL(request.url);
      const limit = Number(url.searchParams.get('limit') || '5');
      const recent = await scheduleService.getRecent(limit);
      return successResponse(recent, 'Recent schedules');
    } catch (error) {
      return handleError(error);
    }
  }

  async update(id: string, request: Request): Promise<Response> {
    try {
      await connectDatabase();
      const body = await request.json();
      const data = validateSchema(updateScheduleSchema, body);
      const schedule = await scheduleService.update(id, data);
      return successResponse(schedule, 'Schedule updated');
    } catch (error) {
      return handleError(error);
    }
  }

  async delete(id: string): Promise<Response> {
    try {
      await connectDatabase();
      await scheduleService.delete(id);
      return successResponse(null, 'Schedule deleted');
    } catch (error) {
      return handleError(error);
    }
  }
}

export const scheduleController = new ScheduleController();
