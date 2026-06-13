import { verifyToken } from '@core/auth';
import { errorResponse } from '@shared/responses';
import type { JwtPayload } from '@shared/types';
import { HTTP_STATUS } from '@shared/constants';

export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

export function authenticate(request: Request): JwtPayload | Response {
  const token = extractToken(request);
  if (!token) {
    return errorResponse('Authentication required', HTTP_STATUS.UNAUTHORIZED);
  }

  try {
    return verifyToken(token);
  } catch {
    return errorResponse('Invalid or expired token', HTTP_STATUS.UNAUTHORIZED);
  }
}
