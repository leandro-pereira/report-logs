# 🔧 Setup Report Logs Client

## Pré-requisitos

- Node.js 16+
- npm ou yarn
- NestJS 11+
- TypeScript 5.2+

## Instalação

### 1. Via NPM (GitHub)

```bash
npm install github:leandro-pereira/report-logs
```

### 2. Via Yarn

```bash
yarn add github:leandro-pereira/report-logs
```

### 3. Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/leandro-pereira/report-logs.git
cd report-logs/report-logs-client

# Instale as dependências
npm install

# Compile o código
npm run build
```

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do seu projeto:

```env
# URL da API de logs
LOGS_API_URL=http://localhost:3001/logs

# Nome do seu projeto
LOGS_PROJECT_NAME=meu-projeto-backend

# Ambiente (development, staging, production)
LOGS_AMBIENT=development

# Timeout das requisições (em ms)
LOGS_TIMEOUT=5000

# Número de tentativas em caso de falha
LOGS_RETRY_ATTEMPTS=3

# Delay entre tentativas (em ms)
LOGS_RETRY_DELAY=1000
```

**Nota:** A chave de API é carregada automaticamente em memória quando o projeto inicia.

### 2. Importação no AppModule

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { LogsModule } from '@evertrips/report-logs-client';

@Module({
  imports: [
    LogsModule.forRoot({
      apiUrl: process.env.LOGS_API_URL,
      projectName: process.env.LOGS_PROJECT_NAME,
      ambient: process.env.LOGS_AMBIENT as 'development' | 'staging' | 'production',
    }),
  ],
})
export class AppModule {}
```

### 3. Uso em Services

```typescript
// src/services/user.service.ts
import { Injectable } from '@nestjs/common';
import { LogClient } from '@evertrips/report-logs-client';

@Injectable()
export class UserService {
  constructor(private readonly logClient: LogClient) {}

  async createUser(data: any) {
    try {
      this.logClient.info('Iniciando criação de usuário', { email: data.email });
      
      // Sua lógica aqui
      const user = await this.saveUser(data);
      
      this.logClient.info('Usuário criado com sucesso', { userId: user.id });
      return user;
    } catch (error) {
      this.logClient.error('Erro ao criar usuário', {
        email: data.email,
        erro: error.message,
      });
      throw error;
    }
  }

  private async saveUser(data: any) {
    // Implementar salvamento
    return { id: 1, ...data };
  }
}
```

## Middleware e Interceptor

### Middleware de Request Logs

```typescript
// src/app.module.ts
import { LogsMiddleware } from '@evertrips/report-logs-client';

@Module({
  imports: [LogsModule.forRoot(config)],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogsMiddleware)
      .forRoutes('*');
  }
}
```

### Interceptor de Response Logs

O interceptor é registrado automaticamente pelo módulo.

## Estrutura de Dados de Log

Cada log enviado contém:

```typescript
interface LogPayload {
  message: string;           // Mensagem principal
  level: LogLevel;          // INFO | WARN | ERROR | DEBUG
  context?: string;         // Contexto da operação
  metadata?: Record<string, any>; // Dados adicionais
  stack?: string;           // Stack trace (para errors)
  ambient?: string;         // Ambiente (development/staging/production)
  requestId?: string;       // ID único da requisição
  path?: string;            // Caminho da rota
  method?: string;          // Método HTTP
  userAgent?: string;       // User agent do cliente
  statusCode?: number;      // Status HTTP
  authenticatedBy?: string; // Usuário autenticado
  responseTime?: number;    // Tempo de resposta em ms
  errorMessage?: string;    // Mensagem de erro
}
```

## Compilação

```bash
# Compilar uma vez
npm run build

# Compilar em modo watch
npm run build:watch

# Gerar apenas type definitions
npm run tsc -- --declaration --emitDeclarationOnly
```

## Testing

```bash
# Executar testes
npm test

# Modo watch
npm test:watch

# Com coverage
npm test:cov
```

## Estrutura de Pastas

```
report-logs-client/
├── src/
│   ├── logs/
│   │   ├── base.service.ts         # Serviço base para services
│   │   ├── config.ts               # Configurações
│   │   ├── constants.ts            # Constantes
│   │   ├── example-logging.service.ts
│   │   ├── example-service-with-logs.ts
│   │   ├── index.ts                # Exports
│   │   ├── log-client.ts           # Cliente HTTP
│   │   ├── log-context.ts          # Context para correlação
│   │   ├── logger.ts               # Logger utility
│   │   ├── logs.interceptor.ts    # Interceptor
│   │   ├── logs.middleware.ts     # Middleware
│   │   ├── logs.module.ts          # Módulo NestJS
│   │   ├── types.ts                # Interfaces TypeScript
│   │   └── [docs]                  # Documentação
│   └── index.ts                    # Export principal
├── package.json
├── tsconfig.json
├── nest-cli.json
├── .gitignore
├── .npmignore
├── .prettierrc
├── eslint.config.mjs
└── README.md
```

## Troubleshooting

### "Cannot find module '@evertrips/report-logs-client'"

Certifique-se de que o pacote foi instalado corretamente:
```bash
npm install github:leandro-pereira/report-logs
```

### LogClient não está sendo injetado

Certifique-se de que o `LogsModule` foi importado no `AppModule`:
```typescript
@Module({
  imports: [LogsModule.forRoot(config)],
})
export class AppModule {}
```

### Logs não chegando na API

Verifique se:
1. A URL da API está correta: `LOGS_API_URL`
2. O backend está rodando e acessível
3. O projeto tem permissão para enviar logs
4. Não há erro de CORS se em ambiente remoto

## Desenvolvimento

### Build para produção

```bash
npm run build
```

Isso gera:
- `dist/src/` - Código compilado
- `dist/src/index.d.ts` - Type definitions

### Publicar atualização

```bash
# Build
npm run build

# Commit
git add .
git commit -m "chore: atualização versão"

# Tag
git tag -a v1.0.1 -m "Release v1.0.1"

# Push
git push origin master --tags
```

### Instalação local para testes

```bash
# No projeto que vai usar
npm install file:../report-logs/report-logs-client
```

## Recursos

- [README Principal](./README.md)
- [Documentação de Integração](./src/logs/INTEGRACAO-ROTAS.md)
- [Checklist de Instalação](./src/logs/CHECKLIST-INSTALACAO.md)
- [Template de Integração](./src/logs/TEMPLATE-INTEGRACAO.md)
- [Troubleshooting](./src/logs/TROUBLESHOOTING.md)

## Suporte

Para problemas ou sugestões, abra uma issue no repositório:
https://github.com/leandro-pereira/report-logs/issues
