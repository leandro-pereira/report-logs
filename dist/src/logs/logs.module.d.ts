import { DynamicModule } from '@nestjs/common';
import { LogsModuleConfig } from './types';
export declare class LogsModule {
    /**
     * Configura o módulo de logs com parâmetros customizados
     *
     * @param config Configuração do módulo (apiUrl, projectName, ambient)
     * @returns DynamicModule
     *
     * @example
     * ```typescript
     * import { LogsModule } from '@evertrips/report-logs-client';
     *
     * @Module({
     *   imports: [
     *     LogsModule.forRoot({
     *       apiUrl: 'http://localhost:3001/logs',
     *       projectName: 'meu-projeto',
     *       ambient: 'development',
     *     }),
     *   ],
     * })
     * export class AppModule {}
     * ```
     */
    static forRoot(config: LogsModuleConfig): DynamicModule;
}
//# sourceMappingURL=logs.module.d.ts.map