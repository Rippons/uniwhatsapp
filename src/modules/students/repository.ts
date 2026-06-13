import { StudentModel, type IStudent } from './model';
import type { CreateStudentInput, UpdateStudentInput, StudentFilters } from './types';

export class StudentRepository {
  async findAll(
    filters: StudentFilters = {},
    page = 1,
    limit = 20,
  ): Promise<{ students: IStudent[]; total: number }> {
    const query: Record<string, unknown> = {};

    if (filters.faculty) query.faculty = filters.faculty;
    if (filters.semester) query.semester = filters.semester;
    if (filters.active !== undefined) query.active = filters.active;

    // Búsqueda por texto en nombre, código o teléfono
    if (filters.search) {
      const regex = { $regex: filters.search, $options: 'i' };
      query.$or = [
        { fullName: regex },
        { code: regex },
        { phone: regex },
      ];
    }

    const [students, total] = await Promise.all([
      StudentModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      StudentModel.countDocuments(query),
    ]);

    return { students, total };
  }

  async findById(id: string): Promise<IStudent | null> {
    return StudentModel.findById(id);
  }

  async findByPhone(phone: string): Promise<IStudent | null> {
    return StudentModel.findOne({ phone });
  }

  async findByCode(code: string): Promise<IStudent | null> {
    return StudentModel.findOne({ code });
  }

  async create(data: CreateStudentInput): Promise<IStudent> {
    return StudentModel.create(data);
  }

  async update(id: string, data: UpdateStudentInput): Promise<IStudent | null> {
    return StudentModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IStudent | null> {
    return StudentModel.findByIdAndDelete(id);
  }
}

export const studentRepository = new StudentRepository();