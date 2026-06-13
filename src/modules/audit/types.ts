export interface CreateAuditLogInput {
  action: string;
  user: string;
  metadata?: Record<string, unknown>;
}
