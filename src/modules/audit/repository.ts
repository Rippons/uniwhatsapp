import { AuditLogModel, type IAuditLog } from './model';
import type { CreateAuditLogInput } from './types';

export class AuditRepository {
  async create(data: CreateAuditLogInput): Promise<IAuditLog> {
    return AuditLogModel.create(data);
  }

  async findAll(page = 1, limit = 50): Promise<{ logs: IAuditLog[]; total: number }> {
    const [logs, total] = await Promise.all([
      AuditLogModel.find()
        .populate('user', 'name email')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      AuditLogModel.countDocuments(),
    ]);
    return { logs, total };
  }
}

export const auditRepository = new AuditRepository();
