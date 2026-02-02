# 📝 Report Logs Client

Biblioteca NestJS cliente para centralizar e gerenciar logs de forma centralizada através de uma API backend.

## 📦 Instalação

### Via GitHub
```bash
npm install github:leandro-pereira/report-logs#main
```

## 🚀 Uso Rápido

### 1. Importar o Módulo

```typescript
import { LogsModule } from '@evertrips/report-logs-client';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    LogsModule.forRoot({
      apiUrl: process.env.LOGS_API_URL || 'http://localhost:3001/logs',
      projectName: 'meu-projeto',
      ambient: process.env.NODE_ENV as 'development' | 'staging' | 'production',
    }),
  ],
})
export class AppModule {}
```

### 2. Usar o LogClient

```typescript
import { Injectable } from '@nestjs/common';
import { LogClient } from '@evertrips/report-logs-client';

@Injectable()
export class MeuServico {
  constructor(private readonly logClient: LogClient) {}

  async fazerAlgo() {
    try {
      // Seu código aqui
      this.logClient.info('Operação iniciada', { dados: 'exemplo' });
      
      const resultado = await this.processarDados();
      
      this.logClient.info('Operação concluída', { resultado });
      return resultado;
    } catch (error) {
      this.logClient.error('Erro na operação', {
        erro: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  private async processarDados() {
    return { status: 'ok' };
  }
}
```

## 📋 Métodos Disponíveis

### LogClient

- `log(message: string, metadata?: any)` - Log genérico
- `info(message: string, metadata?: any)` - Log de informação
- `warn(message: string, metadata?: any)` - Log de aviso
- `error(message: string, metadata?: any)` - Log de erro
- `debug(message: string, metadata?: any)` - Log de debug

## 🔧 Configuração

```typescript
interface LogsModuleConfig {
  apiUrl: string;           // URL da API backend
  projectName: string;      // Nome do projeto
  ambient: 'development' | 'staging' | 'production'; // Ambiente
}
```

## 📚 Exemplos

### Com Middleware

```typescript
import { LogsMiddleware } from '@evertrips/report-logs-client';
import { Module } from '@nestjs/common';

@Module({})
export class AppModule {
  configure(consumer) {
    consumer
      .apply(LogsMiddleware)
      .forRoutes('*');
  }
}
```

### Com Interceptor

```typescript
import { LogsInterceptor } from '@evertrips/report-logs-client';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LogsInterceptor,
    },
  ],
})
export class AppModule {}
```

## 🌍 Variáveis de Ambiente

```env
# Backend de logs
LOGS_API_URL=http://localhost:3001/logs

# Ambiente
NODE_ENV=development

# Chave de API (se necessário)
LOGS_API_KEY=sua-chave-aqui
```

## 📖 Documentação Completa

- [Guia de Integração](./src/logs/INTEGRACAO-ROTAS.md)
- [Checklist de Instalação](./src/logs/CHECKLIST-INSTALACAO.md)
- [Template de Integração](./src/logs/TEMPLATE-INTEGRACAO.md)
- [Troubleshooting](./src/logs/TROUBLESHOOTING.md)

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Watch mode
npm run build:watch

# Testes
npm test

# Lint
npm run lint

# Formatar código
npm run format
```

## 📄 Estrutura

```
report-logs-client/
├── src/
│   ├── logs/
│   │   ├── log-client.ts           # Cliente HTTP com Axios
│   │   ├── logs.module.ts          # Módulo NestJS
│   │   ├── logs.middleware.ts      # Middleware para logs de request
│   │   ├── logs.interceptor.ts     # Interceptor para logs de response
│   │   ├── log-context.ts          # Context para correlação
│   │   ├── base.service.ts         # Serviço base
│   │   └── index.ts                # Exports
│   └── index.ts                     # Export principal
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

## 📝 License

MIT

## 👤 Author

Leandro Pereira

## 🔗 Repository

https://github.com/leandro-pereira/report-logs
