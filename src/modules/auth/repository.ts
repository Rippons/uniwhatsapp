import { AdminUserModel, type IAdminUser } from './model';
import type { RegisterInput } from './types';

export class AuthRepository {
  async findByEmail(email: string): Promise<IAdminUser | null> {
    return AdminUserModel.findOne({ email });
  }

  async findById(id: string): Promise<IAdminUser | null> {
    return AdminUserModel.findById(id);
  }

  async create(data: RegisterInput): Promise<IAdminUser> {
    return AdminUserModel.create(data);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return !!(await AdminUserModel.exists({ email }));
  }
}

export const authRepository = new AuthRepository();
