export interface ILogger {
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}

export class LoggerService implements ILogger {
  private static _instance?: ILogger;

  static getInstance(): ILogger {
    if (!LoggerService._instance) {
      LoggerService._instance = new LoggerService();
    }
    return LoggerService._instance;
  }

  info(message: string, ...args: unknown[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(`[WARN] ${message}`, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(`[ERROR] ${message}`, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
}
