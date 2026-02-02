"use strict";
/**
 * Configuração padrão para o Report Logs Client
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeConfigs = exports.validateConfig = exports.getDefaultConfig = void 0;
const getDefaultConfig = () => {
    const ambient = process.env.NODE_ENV || 'development';
    return {
        apiUrl: process.env.LOGS_API_URL || 'http://localhost:3001/logs',
        projectName: process.env.LOGS_PROJECT_NAME || 'default-project',
        ambient: ambient,
        timeout: parseInt(process.env.LOGS_TIMEOUT || '5000', 10),
        retryAttempts: parseInt(process.env.LOGS_RETRY_ATTEMPTS || '3', 10),
        retryDelay: parseInt(process.env.LOGS_RETRY_DELAY || '1000', 10),
    };
};
exports.getDefaultConfig = getDefaultConfig;
const validateConfig = (config) => {
    if (!config.apiUrl) {
        return 'apiUrl é obrigatório';
    }
    if (!config.projectName) {
        return 'projectName é obrigatório';
    }
    if (!config.ambient) {
        return 'ambient é obrigatório';
    }
    const validEnvironments = ['development', 'staging', 'production'];
    if (!validEnvironments.includes(config.ambient)) {
        return `ambient deve ser um de: ${validEnvironments.join(', ')}`;
    }
    return null;
};
exports.validateConfig = validateConfig;
const mergeConfigs = (baseConfig, overrideConfig) => {
    return {
        ...baseConfig,
        ...overrideConfig,
    };
};
exports.mergeConfigs = mergeConfigs;
//# sourceMappingURL=config.js.map