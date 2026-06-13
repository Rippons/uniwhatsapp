import { studentService } from './service';
import { createStudentSchema, updateStudentSchema } from './validation';
import { successResponse, createdResponse, paginatedResponse } from '@shared/responses';
import { handleError } from '@core/middleware';
import { connectDatabase } from '@core/database';
import { validateSchema } from '@shared/utils/validation';
import { getPaginationParams } from '@shared/utils';

export class StudentController {
  async getAll(request: Request): Promise<Response> {
    try {
      await connectDatabase();
      const url = new URL(request.url);
      const { page, limit } = getPaginationParams(url);
      const faculty = url.searchParams.get('faculty') || undefined;
      const search = url.searchParams.get('search') || undefined;
      const semester = url.searchParams.get('semester')
        ? Number(url.searchParams.get('semester'))
        : undefined;
      const activeParam = url.searchParams.get('active');
      const active = activeParam !== null ? activeParam === 'true' : undefined;

      const { students, total } = await studentService.getAll(
        { faculty, semester, active, search },
        page,
        limit,
      );
      return paginatedResponse(students, total, page, limit);
    } catch (error) {
      return handleError(error);
    }
  }

  async getById(id: string): Promise<Response> {
    try {
      await connectDatabase();
      const student = await studentService.getById(id);
      return successResponse(student);
    } catch (error) {
      return handleError(error);
    }
  }

  async create(request: Request): Promise<Response> {
    try {
      await connectDatabase();
      const body = await request.json();
      const data = validateSchema(createStudentSchema, body);
      const student = await studentService.create(data);
      return createdResponse(student, 'Student created');
    } catch (error) {
      return handleError(error);
    }
  }

  async update(id: string, request: Request): Promise<Response> {
    try {
      await connectDatabase();
      const body = await request.json();
      const data = validateSchema(updateStudentSchema, body);
      const student = await studentService.update(id, data);
      return successResponse(student, 'Student updated');
    } catch (error) {
      return handleError(error);
    }
  }

  async delete(id: string): Promise<Response> {
    try {
      await connectDatabase();
      await studentService.delete(id);
      return successResponse(null, 'Student deleted');
    } catch (error) {
      return handleError(error);
    }
  }
}

export const studentController = new StudentController();