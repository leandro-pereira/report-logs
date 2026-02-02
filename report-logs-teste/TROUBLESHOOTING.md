# 🆘 Troubleshooting - Guia de Resolução de Problemas

Este guia ajuda a resolver os problemas mais comuns com o módulo de logs.

---

## ❌ Problema: "Cannot find module '@nestjs/common' in logs"

### Sintomas
```
Error: Cannot find module '@nestjs/common'
```

### Causas Possíveis
- Dependências não instaladas
- node_modules corrompido
- Versão do Node.js incompatível

### Solução

```bash
# 1. Limpar node_modules
rm -rf node_modules
rm package-lock.json

# 2. Reinstalar
npm install

# 3. Reconstruir
npm run build

# 4. Testar
npm run start:dev
```

---

## ❌ Problema: "LogsModule is not imported"

### Sintomas
```
Error: LogsModule is not imported
```

### Causas Possíveis
- LogsModule não foi adicionado ao AppModule
- Typo no import

### Solução

Verificar `src/app.module.ts`:

```typescript
// 1. Import deve estar no topo
import { LogsModule } from './logs/logs.module';

// 2. LogsModule deve estar na lista de imports
@Module({
  imports: [
    LogsModule,  // ← Deve estar aqui!
    DatabaseModule,
    UsersModule,
    // ... outros módulos
  ],
})
```

Se ainda não funcionar:

```bash
# Limpar cache
rm -rf dist
npm run build
npm run start:dev
```

---

## ❌ Problema: Logs não são enviados

### Sintomas
- Nenhum log aparece no console
- Nenhum erro, mas logs não vão para Report Logs

### Causas Possíveis
1. Servidor Report Logs está offline
2. URL incorreta em `LOGS_API_URL`
3. API Key inválida
4. Firewall bloqueando conexão

### Solução

#### Passo 1: Verificar conectividade com Report Logs

```bash
# Testar conexão
curl -v http://localhost:3000/health

# Esperado: HTTP 200 OK

# Se falhar:
# - Verificar se Report Logs está rodando
# - Verificar se URL está correta
# - Verificar firewall
```

#### Passo 2: Verificar variáveis de ambiente

```bash
# Ver valores configurados
echo $LOGS_API_URL
echo $LOGS_PROJECT_NAME
echo $LOGS_AMBIENT

# Esperado: valores aparecerem
# Se vazio: adicionar ao .env
```

#### Passo 3: Verificar .env

```bash
# Verificar conteúdo
cat .env | grep LOGS_

# Esperado:
# LOGS_PROJECT_NAME=NiceTripsAPI
# LOGS_API_URL=http://localhost:3000
# LOGS_AMBIENT=development
# LOGS_API_KEY=pk_...
# LOGS_API_SECRET=sk_...
```

#### Passo 4: Ativar modo debug

```typescript
// src/main.ts - adicionar antes de app.listen()
process.env.DEBUG = 'nestjs*,*log*';

app.listen(3000);
```

Depois:

```bash
DEBUG=* npm run start:dev
```

---

## ❌ Problema: "API Key expirada"

### Sintomas
```
⚠️  API Key expirada ou inválida. Tentando renovar...
```

### Isso é NORMAL!
Este é um comportamento esperado. O LogClient renova automaticamente.

### Se falhar na renovação

```bash
# Gerar nova chave manualmente
curl -X POST http://localhost:3000/api-keys \
  -H "Content-Type: application/json" \
  -d '{"name": "NiceTripsAPI"}'

# Resposta esperada:
# {
#   "success": true,
#   "data": {
#     "key": "pk_...",
#     "secret": "sk_..."
#   }
# }

# Copiar valores para .env
# Reiniciar aplicação
npm run start:dev
```

---

## ❌ Problema: "Cannot GET /api-keys"

### Sintomas
```
404 - Cannot GET /api-keys
```

### Causa
Servidor Report Logs não tem este endpoint.

### Solução

1. Verificar se é a URL correta:
```bash
curl http://localhost:3000/health
# Se falhar aqui, a URL está errada
```

2. Verificar se Report Logs está na versão correta:
```bash
# Report Logs deve ter endpoint POST /api-keys
# Verifique a documentação do Report Logs
```

3. Se estiver usando server diferente:
```bash
# Atualizar .env
LOGS_API_URL=http://seu-server.com:3000
```

---

## ❌ Problema: Middleware não funciona

### Sintomas
- Requisições não geram logs automáticos
- Não vê logs como "GET /users - 200"

### Causa
Middleware não está registrado no AppModule.

### Solução

Verificar `src/app.module.ts`:

```typescript
// 1. Deve implementar NestModule
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 2. Deve aplicar middleware
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
```

Se estiver correto, reiniciar:

```bash
npm run start:dev
```

Testar:

```bash
# Terminal 1
npm run start:dev

# Terminal 2
curl http://localhost:3000/health

# Terminal 1 deve mostrar
# GET /health - 200
```

---

## ❌ Problema: RequestId não aparece

### Sintomas
- Logs não têm requestId
- Não consegue rastrear requisições

### Causa
RequestId não foi gerado ou não foi incluído nos metadados.

### Solução

Verificar que está usando:

```typescript
// ✅ Correto
const requestId = this.logClient.generateRequestId();
await this.logClient.info('Msg', 'Service', { requestId, ... });

// ❌ Incorreto
await this.logClient.info('Msg', 'Service', { ... });
// RequestId não foi gerado
```

Se estiver usando middleware:

```typescript
// O middleware gera automaticamente
// Você pode acessar assim:
(req as any).requestId  // Do request

// Ou gerar novo:
const requestId = this.logClient.generateRequestId();
```

---

## ❌ Problema: Logs contêm dados sensíveis

### Sintomas
- Senhas aparecem nos logs
- Tokens aparecem nos logs
- Dados de cartão de crédito aparecem

### Solução

**NUNCA faça:**
```typescript
// ❌ NUNCA FAÇA ISTO!
await this.logClient.info('Login', 'Auth', {
  password: user.password,  // ❌ NUNCA!
  token: authToken,        // ❌ NUNCA!
  creditCard: cc,          // ❌ NUNCA!
});
```

**SEMPRE faça:**
```typescript
// ✅ CORRETO
await this.logClient.info('Login bem-sucedido', 'Auth', {
  userId: user.id,        // ✅ ID é seguro
  email: user.email,      // ✅ Email é seguro
  timestamp: new Date(),  // ✅ Timestamp é seguro
});
```

---

## ❌ Problema: Arquivo .env foi commited

### Sintomas
```
git status
# .env

# OU você vê .env no histórico
```

### Solução

**Imediato:**

```bash
# 1. Remover do Git (mas não do disco)
git rm --cached .env

# 2. Gerar novas chaves (porque foram expostas)
curl -X POST http://localhost:3000/api-keys \
  -H "Content-Type: application/json" \
  -d '{"name": "NiceTripsAPI"}'

# 3. Adicionar novo .env ao gitignore
echo ".env" >> .gitignore

# 4. Commitar
git add .gitignore
git commit -m "Remove .env from git and add to gitignore"

# 5. Fazer push (com força se necessário)
git push
```

**Longo prazo:**

```bash
# Verificar se está no .gitignore
cat .gitignore | grep ".env"

# Deve conter algo como:
# .env
# .env.local
# .env.*.local
```

---

## ❌ Problema: "TypeError: Cannot read property 'logClient' of undefined"

### Sintomas
```
TypeError: Cannot read property 'logClient' of undefined
```

### Causa
LogClient não foi injetado no constructor.

### Solução

Verificar constructor do seu serviço:

```typescript
// ✅ Correto
@Injectable()
export class MyService extends BaseService {
  constructor(
    private readonly logClient: LogClient  // ← Deve estar aqui
  ) {
    super(logClient);  // ← Passar ao super
  }
}

// ❌ Incorreto
@Injectable()
export class MyService {
  constructor() {  // ← Falta LogClient!
    // ...
  }
}
```

---

## ❌ Problema: Aplicação fica lenta com logs

### Sintomas
- Requisições demoram mais
- CPU em 100%

### Causa
Muitos logs sendo enviados simultaneamente.

### Solução

#### Opção 1: Reduzir quantidade de logs

```typescript
// ❌ Evite fazer isto em loop
for (let i = 0; i < 10000; i++) {
  await this.logClient.info('Processando', 'Service', { index: i });
}

// ✅ Melhor
const processed = 10000;
await this.logClient.info('Processamento concluído', 'Service', { 
  processed,
  duration: '5.2s' 
});
```

#### Opção 2: Usar debug apenas em desenvolvimento

```typescript
if (process.env.NODE_ENV === 'development') {
  await this.logClient.debug('Debug info', 'Service');
}
```

#### Opção 3: Aumentar timeout

```typescript
// Em log-client.ts
const response = await this.axiosInstance.post('/logs', {
  // ...
}, {
  timeout: 10000  // De 5000 para 10000ms
});
```

---

## ❌ Problema: ECONNREFUSED - Conexão recusada

### Sintomas
```
Error: connect ECONNREFUSED 127.0.0.1:3000
```

### Causa
Report Logs não está rodando na porta esperada.

### Solução

```bash
# 1. Verificar se Report Logs está rodando
netstat -an | grep 3000
# Ou no Windows:
netstat -an | findstr "3000"

# 2. Se não aparecer, iniciar Report Logs
# (depende de como você instalou)

# 3. Se usar porta diferente, atualizar .env
LOGS_API_URL=http://localhost:8080  # Ajuste a porta

# 4. Reiniciar aplicação
npm run start:dev
```

---

## ❌ Problema: Erro ao salvar .env

### Sintomas
```
Error saving .env: EACCES: permission denied
```

### Causa
Sem permissão para escrever em .env.

### Solução

```bash
# 1. Verificar permissões
ls -la .env

# 2. Se necessário, dar permissão
chmod 644 .env

# 3. Ou criar novo arquivo
cp .env.example .env
chmod 644 .env

# 4. Reiniciar
npm run start:dev
```

---

## ✅ Checklist de Troubleshooting

- [ ] Report Logs está rodando? (`curl http://localhost:3000/health`)
- [ ] LOGS_API_URL está correto? (`echo $LOGS_API_URL`)
- [ ] LogsModule foi importado? (verificar `app.module.ts`)
- [ ] LogsMiddleware foi registrado? (verificar `configure()`)
- [ ] .env contém LOGS_*? (`grep "LOGS_" .env`)
- [ ] node_modules está completo? (`ls -la node_modules/@nestjs`)
- [ ] Aplicação compila? (`npm run build`)
- [ ] Aplicação inicia? (`npm run start:dev`)

---

## 📞 Se Nada Funcionar

1. **Resete tudo:**
```bash
rm -rf node_modules dist .env
npm install
npm run build
npm run start:dev
```

2. **Consulte a documentação:**
   - [README.md](./README.md)
   - [INTEGRACAO-ROTAS.md](./INTEGRACAO-ROTAS.md)
   - [CHECKLIST-INSTALACAO.md](./CHECKLIST-INSTALACAO.md)

3. **Procure por:**
   - Mensagens de erro em `npm run start:dev`
   - Logs em `src/logs/` para verificar sintaxe

4. **Teste manualmente:**
```bash
# Testar LogClient direto
node -e "
const { LogClient } = require('./dist/logs/log-client');
const client = new LogClient('http://localhost:3000', 'Test', 'key', 'secret');
client.info('Test message', 'Test');
"
```

---

**Ainda com problemas? Consulte a seção de suporte da documentação!** 📖
