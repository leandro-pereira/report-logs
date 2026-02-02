/**
 * Configuração padrão para o Report Logs Client
 */
import { LogsModuleConfig } from './types';
export declare const getDefaultConfig: () => LogsModuleConfig;
export declare const validateConfig: (config: LogsModuleConfig) => string | null;
export declare const mergeConfigs: (baseConfig: LogsModuleConfig, overrideConfig: Partial<LogsModuleConfig>) => LogsModuleConfig;
//# sourceMappingURL=config.d.ts.map