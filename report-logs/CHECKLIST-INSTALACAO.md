# ✅ Checklist de Instalação e Configuração

Este documento é um checklist passo-a-passo para verificar se tudo foi instalado corretamente.

---

## 📋 Pré-requisitos

### Hardware/Software

- [ ] Node.js 14+ instalado (`node --version`)
- [ ] npm 6+ instalado (`npm --version`)
- [ ] Git configurado
- [ ] Servidor Report Logs rodando em `http://localhost:3000`

### Verificar Pré-requisitos

```bash
# Verificar Node.js
node --version
# Esperado: v14.0.0 ou superior

# Verificar npm
npm --version
# Esperado: 6.0.0 ou superior

# Verificar conectividade com Report Logs
curl http://localhost:3000/health
# Esperado: resposta HTTP 200
```

---

## 🔧 Passo 1: Instalação de Dependências

- [ ] Arquivo `package.json` contém `axios` e `uuid`

```bash
# Verificar
npm list axios uuid

# Se não tiver, instalar:
npm install axios uuid
npm install -D @types/uuid
```

---

## 📁 Passo 2: Estrutura de Arquivos Criados

- [ ] Pasta `src/logs/` existe

Verificar arquivos:

- [ ] `src/logs/log-client.ts` ✅
- [ ] `src/logs/logs.module.ts` ✅
- [ ] `src/logs/logs.middleware.ts` ✅
- [ ] `src/logs/base.service.ts` ✅
- [ ] `src/logs/example-logging.service.ts` ✅
- [ ] `src/logs/index.ts` ✅
- [ ] `src/logs/README.md` ✅
- [ ] `src/logs/INTEGRACAO-ROTAS.md` ✅
- [ ] `src/logs/TEMPLATE-INTEGRACAO.md` ✅
- [ ] `src/logs/IMPLEMENTACAO-SUMARIO.md` ✅

```bash
# Verificar
ls -la src/logs/
```

---

## 🔌 Passo 3: Integração no AppModule

- [ ] `src/app.module.ts` importa `LogsModule`
- [ ] `src/app.module.ts` importa `LogsMiddleware`
- [ ] `AppModule` implementa `NestModule`
- [ ] `configure()` method registra `LogsMiddleware`

```typescript
// Verificar se contém:
import { LogsModule } from './logs/logs.module';
import { LogsMiddleware } from './logs/logs.middleware';

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
```

---

## ⚙️ Passo 4: Variáveis de Ambiente

- [ ] Arquivo `.env` existe (ou `.env.local`)
- [ ] `.env` está no `.gitignore`

Verificar:

```bash
# Verificar se .env existe
ls -la .env

# Verificar se está no .gitignore
grep ".env" .gitignore
# Esperado: .env (ou similar)

# Verificar variáveis mínimas em .env
grep "LOGS_" .env
# Esperado: algo como LOGS_PROJECT_NAME=NiceTripsAPI
```

---

## 🧪 Passo 5: Verificação de Compilação

- [ ] Projeto compila sem erros

```bash
# Compilar
npm run build

# Esperado: Saída sem erros
# Procure por: "Successfully compiled NestJS application"
```

Se houver erros, verifique:

```bash
# Verificar tipagem TypeScript
npx tsc --noEmit

# Verificar imports
npm run lint
```

---

## 🚀 Passo 6: Teste de Execução

- [ ] Aplicação inicia sem erros

```bash
# Iniciar em modo desenvolvimento
npm run start:dev

# Esperado ver algo como:
# ✅ LogClient inicializado para o projeto "NiceTripsAPI"
# [NestFactory] Starting Nest application...
# ✓ Nest application successfully started on port 3000
```

Se não iniciar, verifique:

```bash
# Verificar erros de compilação
npm run build

# Ver logs detalhados
npm run start:debug
```

---

## 📡 Passo 7: Teste de Logs

### 7.1 Teste Automático (Middleware)

- [ ] Middleware está ativo (não precisa fazer nada)

Fazer uma requisição:

```bash
# Terminal 1: Deixar app rodando
npm run start:dev

# Terminal 2: Fazer requisição
curl http://localhost:3000/health

# Verificar no Terminal 1:
# Deve ver logs como: "GET /health - 200"
```

### 7.2 Teste Manual com LogClient

- [ ] LogClient funciona em serviços

Criar um serviço de teste:

```typescript
// src/test-logs.service.ts
import { Injectable } from '@nestjs/common';
import { LogClient } from './logs/log-client';

@Injectable()
export class TestLogsService {
  constructor(private readonly logClient: LogClient) {}

  async test() {
    await this.logClient.info('Teste de log INFO', 'TestLogsService', {
      timestamp: new Date().toISOString(),
    });

    await this.logClient.warn('Teste de log WARN', 'TestLogsService');

    await this.logClient.debug('Teste de log DEBUG', 'TestLogsService', {
      debugInfo: 'Alguns dados',
    });

    try {
      throw new Error('Teste de erro');
    } catch (error) {
      await this.logClient.error(
        'Teste de log ERROR',
        error,
        'TestLogsService',
      );
    }
  }
}
```

Adicionar ao AppModule:

```typescript
// app.module.ts
import { TestLogsService } from './test-logs.service';

@Module({
  providers: [TestLogsService],
})
export class AppModule implements NestModule {
  constructor(private testLogsService: TestLogsService) {
    this.testLogsService.test();
  }
}
```

Verificar:

```bash
npm run start:dev
# Deve ver 4 logs no console (INFO, WARN, DEBUG, ERROR)
```

---

## 🔄 Passo 8: Renovação Automática de API Key

- [ ] LogClient detecta expiração automaticamente
- [ ] Chama `/api-keys` para renovar
- [ ] Atualiza `.env` automaticamente

Para testar (manual):

```bash
# 1. Obter chave do Report Logs
curl -X POST http://localhost:3000/api-keys \
  -H "Content-Type: application/json" \
  -d '{"name": "NiceTripsAPI"}'

# 2. Copiar `key` e `secret`

# 3. Adicionar ao .env
LOGS_API_KEY=pk_...
LOGS_API_SECRET=sk_...

# 4. Iniciar app
npm run start:dev

# 5. Fazer requisição para gerar log
curl http://localhost:3000/health

# 6. Se esperar a chave expirar (simular):
#    - Editar .env com chave inválida
#    - Fazer requisição
#    - Deve ver: "API Key expirada ou inválida. Tentando renovar..."

# Verificar se .env foi atualizado:
grep "LOGS_API_KEY" .env
```

---

## ✨ Passo 9: Verificações Finais

### Checklist de Funcionalidade

- [ ] Logs de requisição HTTP funcionam
- [ ] LogClient pode ser injetado em serviços
- [ ] Logs com info() funcionam
- [ ] Logs com warn() funcionam
- [ ] Logs com error() funcionam
- [ ] Logs com debug() funcionam
- [ ] RequestId é único por requisição
- [ ] BaseService funciona por herança
- [ ] API Key é renovada automaticamente
- [ ] .env é atualizado automaticamente

### Checklist de Segurança

- [ ] Arquivo `.env` está no `.gitignore`
- [ ] Nenhuma chave real foi commited no Git
- [ ] Arquivo `.env.example.logs` documenta config
- [ ] Logs não contêm senhas ou tokens

### Checklist de Documentação

- [ ] README.md em src/logs/ existe
- [ ] INTEGRACAO-ROTAS.md em src/logs/ existe
- [ ] TEMPLATE-INTEGRACAO.md em src/logs/ existe
- [ ] example-logging.service.ts tem exemplos
- [ ] IMPLEMENTACAO-SUMARIO.md tem resumo

---

## 🐛 Troubleshooting

### Problema: "Cannot find module 'axios'"

```bash
# Solução
npm install axios uuid
npm install -D @types/uuid
npm run build
```

### Problema: "LogsModule is not imported"

```bash
# Verificar se app.module.ts tem:
import { LogsModule } from './logs/logs.module';

// E se LogsModule está na lista de imports:
@Module({
  imports: [
    LogsModule,  // Deve estar aqui
    // ... outros módulos
  ],
})
```

### Problema: Logs não aparecem

```bash
# 1. Verificar se servidor Report Logs está rodando
curl http://localhost:3000/health

# 2. Verificar conectividade
ping localhost:3000

# 3. Verificar variáveis de ambiente
npm run dev  # Deve mostrar logs de inicialização
```

### Problema: "API Key está expirada"

```bash
# Solução: Renovar manualmente
curl -X POST http://localhost:3000/api-keys \
  -H "Content-Type: application/json" \
  -d '{"name": "NiceTripsAPI"}'

# Copiar novos valores para .env
# Reiniciar aplicação
npm run start:dev
```

---

## 📊 Teste de Performance

- [ ] App inicia em menos de 5 segundos
- [ ] Requisições HTTP não são significativamente lentas
- [ ] Envio de logs não bloqueia a aplicação

```bash
# Teste de velocidade
time npm run build

# Esperado: menos de 30 segundos no build completo
```

---

## 🎓 Treinamento (Opcional)

Para toda a equipe:

- [ ] Todos leram src/logs/README.md
- [ ] Todos viram exemplo em src/logs/INTEGRACAO-ROTAS.md
- [ ] Todos sabem como herdar de BaseService
- [ ] Todos sabem como usar logInfo(), logError(), etc

---

## 📞 Suporte

Se algo não funcionar:

1. Verifique este checklist
2. Consulte `src/logs/README.md`
3. Veja exemplos em `src/logs/INTEGRACAO-ROTAS.md`
4. Verifique `src/logs/example-logging.service.ts`

---

## ✅ Conclusão

Se você verificou tudo neste checklist e tudo passou:

**🎉 Parabéns! Seu sistema de logs está totalmente operacional!**

Você pode começar a integrar logs em seus serviços e controllers usando os exemplos fornecidos.

---

**Status: PRONTO PARA PRODUÇÃO** ✅

Data de Verificação: ___________________

Responsável: ___________________

Notas: ___________________
