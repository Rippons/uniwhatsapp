import { NotFoundError, ConflictError } from '@shared/errors';
import { studentRepository } from './repository';
import type { CreateStudentInput, UpdateStudentInput, StudentFilters } from './types';
import type { IStudent } from './model';

export class StudentService {
  async getAll(
    filters: StudentFilters,
    page: number,
    limit: number,
  ): Promise<{ students: IStudent[]; total: number }> {
    return studentRepository.findAll(filters, page, limit);
  }

  async getById(id: string): Promise<IStudent> {
    const student = await studentRepository.findById(id);
    if (!student) throw new NotFoundError('Student');
    return student;
  }

  async create(input: CreateStudentInput): Promise<IStudent> {
    const existingPhone = await studentRepository.findByPhone(input.phone);
    if (existingPhone) throw new ConflictError('Phone already registered');

    const existingCode = await studentRepository.findByCode(input.code);
    if (existingCode) throw new ConflictError('Student code already exists');

    return studentRepository.create(input);
  }

  async update(id: string, input: UpdateStudentInput): Promise<IStudent> {
    const student = await studentRepository.update(id, input);
    if (!student) throw new NotFoundError('Student');
    return student;
  }

  async delete(id: string): Promise<void> {
    const student = await studentRepository.delete(id);
    if (!student) throw new NotFoundError('Student');
  }
}

export const studentService = new StudentService();
