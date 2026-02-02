"use strict";
/**
 * Logger Utility para debug interno
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static debug(message, data) {
        if (this.isDevelopment) {
            console.debug(`[LOG_CLIENT_DEBUG] ${message}`, data);
        }
    }
    static info(message, data) {
        console.info(`[LOG_CLIENT_INFO] ${message}`, data);
    }
    static warn(message, data) {
        console.warn(`[LOG_CLIENT_WARN] ${message}`, data);
    }
    static error(message, error) {
        console.error(`[LOG_CLIENT_ERROR] ${message}`, error);
    }
    static log(level, message, data) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] ${message}`;
        if (data) {
            console.log(logMessage, data);
        }
        else {
            console.log(logMessage);
        }
    }
}
exports.Logger = Logger;
Logger.isDevelopment = process.env.NODE_ENV === 'development';
//# sourceMappingURL=logger.js.map