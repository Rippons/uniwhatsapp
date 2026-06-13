export const ROLES = {
  STUDENT: 'STUDENT',
  ADMIN_DELEGATE: 'ADMIN_DELEGATE',
  ACADEMIC_DELEGATE: 'ACADEMIC_DELEGATE',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export const DAYS_OF_WEEK = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const NOTIFICATION_STATUS = {
  PENDING: 'PENDING',
  SCHEDULED: 'SCHEDULED',
  SENT: 'SENT',
  FAILED: 'FAILED',
} as const;

export const WHATSAPP_COMMANDS = {
  HORARIO: 'horario',
  HORARIO_HOY: 'horario hoy',
  MATERIAS: 'materias',
  AYUDA: 'ayuda',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
} as const;
