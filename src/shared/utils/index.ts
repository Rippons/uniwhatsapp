import { DAYS_OF_WEEK, type DayOfWeek } from '@shared/constants';

export function getTodayDayName(): DayOfWeek {
  const days: DayOfWeek[] = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];
  return days[new Date().getDay()];
}

export function isValidDayOfWeek(day: string): day is DayOfWeek {
  return DAYS_OF_WEEK.includes(day as DayOfWeek);
}

export function parseJsonBody(request: Request): Promise<unknown> {
  return request.json();
}

export function getParamFromUrl(url: URL, param: string): string | null {
  return url.searchParams.get(param);
}

export function getPaginationParams(url: URL): { page: number; limit: number } {
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
  return { page, limit };
}
