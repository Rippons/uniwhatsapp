export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export type UserRole = 'STUDENT' | 'ADMIN_DELEGATE' | 'ACADEMIC_DELEGATE' | 'SUPER_ADMIN';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedLocals {
  user: JwtPayload;
}
