import { auditRepository } from './repository';
import type { CreateAuditLogInput } from './types';
import { logger } from '@core/logger';

export class AuditService {
  async log(input: CreateAuditLogInput): Promise<void> {
    try {
      await auditRepository.create(input);
    } catch (error) {
      logger.error('Failed to create audit log:', error);
    }
  }

  async getAll(page: number, limit: number) {
    return auditRepository.findAll(page, limit);
  }
}

export const auditService = new AuditService();
