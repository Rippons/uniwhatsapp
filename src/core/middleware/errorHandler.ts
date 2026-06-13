import { AppError, ValidationError } from '@shared/errors';
import { errorResponse } from '@shared/responses';
import { logger } from '@core/logger';

export function handleError(error: unknown): Response {
  if (error instanceof ValidationError) {
    return errorResponse(error.message, error.statusCode, error.errors);
  }

  if (error instanceof AppError) {
    return errorResponse(error.message, error.statusCode);
  }

  logger.error('Unhandled error:', error);
  return errorResponse('Internal server error', 500);
}
