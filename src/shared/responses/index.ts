import type { ApiResponse, PaginatedResponse } from '@shared/types';

export function successResponse<T>(data: T, message = 'Success', status = 200): Response {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function createdResponse<T>(data: T, message = 'Created'): Response {
  return successResponse(data, message, 201);
}

export function errorResponse(
  message: string,
  status = 500,
  errors?: Record<string, string[]>,
): Response {
  const body: ApiResponse = {
    success: false,
    message,
    errors,
  };
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Success',
): Response {
  const body: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
