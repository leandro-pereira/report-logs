/**
 * Logger Utility para debug interno
 */

export class Logger {
  private static isDevelopment = process.env.NODE_ENV === 'development';

  static debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.debug(`[LOG_CLIENT_DEBUG] ${message}`, data);
    }
  }

  static info(message: string, data?: any): void {
    console.info(`[LOG_CLIENT_INFO] ${message}`, data);
  }

  static warn(message: string, data?: any): void {
    console.warn(`[LOG_CLIENT_WARN] ${message}`, data);
  }

  static error(message: string, error?: any): void {
    console.error(`[LOG_CLIENT_ERROR] ${message}`, error);
  }

  static log(level: string, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }
}
