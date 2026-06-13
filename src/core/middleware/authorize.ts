import { errorResponse } from '@shared/responses';
import type { JwtPayload, UserRole } from '@shared/types';
import { HTTP_STATUS } from '@shared/constants';

export function authorizeRoles(user: JwtPayload, ...allowedRoles: UserRole[]): Response | null {
  if (!allowedRoles.includes(user.role)) {
    return errorResponse('Insufficient permissions', HTTP_STATUS.FORBIDDEN);
  }
  return null;
}
