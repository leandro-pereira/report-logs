import { Provider } from '@nestjs/common';
import { LogsModuleConfig } from './types';
/**
 * Factory para criar providers do sistema de logs
 * Para ser usado diretamente no AppModule quando a injeção automática não funciona
 */
export declare class LogsProviderFactory {
    /**
     * Cria todos os providers necessários para o sistema de logs
     * Use isso no seu AppModule quando a importação do LogsModule não funcionar
     */
    static createProviders(config: LogsModuleConfig): Provider[];
    /**
     * Cria providers sem o interceptor automático
     * Use quando quiser registrar o interceptor manualmente
     */
    static createBasicProviders(config: LogsModuleConfig): Provider[];
}
//# sourceMappingURL=logs.provider-factory.d.ts.map