type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private level: LogLevel;

  constructor(level: LogLevel = 'debug') {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
  }

  private format(level: LogLevel, message: string, ...args: unknown[]): string {
    const timestamp = new Date().toISOString();
    const extra = args.length ? ` ${JSON.stringify(args)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${extra}`;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) console.debug(this.format('debug', message, ...args));
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) console.info(this.format('info', message, ...args));
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) console.warn(this.format('warn', message, ...args));
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog('error')) console.error(this.format('error', message, ...args));
  }
}

export const logger = new Logger(
  (import.meta.env.NODE_ENV === 'production' ? 'info' : 'debug') as LogLevel,
);
