# 📝 Guia de Uso - LogClient no NiceTrips API

## 🚀 Visão Geral

O módulo de logs foi implementado globalmente no projeto e está disponível em todos os serviços, controllers e middlewares.

## ✅ Características

- ✅ LogClient injetável em todos os serviços
- ✅ Middleware automático para rastrear requisições HTTP
- ✅ Renovação automática de API Key
- ✅ Geração automática de requestId
- ✅ Inicialização automática da API Key (se não configurada)

## 📋 Instalação de Dependências

As dependências já devem estar no `package.json`:

```bash
npm install axios uuid
npm install -D @types/uuid
```

Se não estiverem, execute:

```bash
npm install axios uuid @types/uuid
```

## 🔧 Configuração

### 1. Variáveis de Ambiente (.env)

Adicione ao seu arquivo `.env` (opcional - será gerado automaticamente):

```env
# Report Logs Configuration
LOGS_PROJECT_NAME=NiceTripsAPI
LOGS_API_URL=http://localhost:3000
LOGS_AMBIENT=development
# As chaves abaixo serão geradas automaticamente:
# LOGS_API_KEY=pk_...
# LOGS_API_SECRET=sk_...
```

## 💡 Como Usar

### Exemplo Básico em um Serviço

```typescript
import { Injectable } from '@nestjs/common';
import { LogClient } from '../logs/log-client';

@Injectable()
export class UserService {
  constructor(private readonly logClient: LogClient) {}

  async createUser(userData: CreateUserDto) {
    try {
      await this.logClient.info(
        'Iniciando criação de usuário',
        'UserService',
        { email: userData.email }
      );

      // Sua lógica aqui...
      const user = await this.userRepository.create(userData);

      await this.logClient.info(
        'Usuário criado com sucesso',
        'UserService',
        { userId: user.id, email: user.email }
      );

      return user;
    } catch (error) {
      await this.logClient.error(
        'Erro ao criar usuário',
        error,
        'UserService',
        { email: userData.email }
      );
      throw error;
    }
  }
}
```

### Exemplo em um Controller

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { LogClient } from '../logs/log-client';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logClient: LogClient,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const requestId = this.logClient.generateRequestId();

    try {
      const user = await this.userService.createUser(createUserDto);
      
      await this.logClient.info(
        'Usuário criado via API',
        'UserController',
        { requestId, userId: user.id }
      );

      return user;
    } catch (error) {
      await this.logClient.error(
        'Erro ao criar usuário via API',
        error,
        'UserController',
        { requestId, email: createUserDto.email }
      );
      throw error;
    }
  }
}
```

## 📊 Métodos Disponíveis

### 1. `logClient.info(message, context?, metadata?)`

Log de informação (sucesso, operações normais).

```typescript
await this.logClient.info(
  'Pagamento processado com sucesso',
  'PaymentService',
  { paymentId: '123', amount: 100.00 }
);
```

### 2. `logClient.warn(message, context?, metadata?)`

Log de aviso (situações incomuns mas não críticas).

```typescript
await this.logClient.warn(
  'Taxa de falha está alta',
  'PaymentService',
  { failureRate: '15%', threshold: '10%' }
);
```

### 3. `logClient.error(message, error, context?, metadata?)`

Log de erro com stack trace.

```typescript
try {
  await database.query('SELECT * FROM users');
} catch (error) {
  await this.logClient.error(
    'Erro ao consultar usuários',
    error,
    'UserRepository',
    { query: 'SELECT * FROM users' }
  );
}
```

### 4. `logClient.debug(message, context?, metadata?)`

Log de debug (apenas em desenvolvimento).

```typescript
await this.logClient.debug(
  'Variáveis de processamento',
  'OrderProcessor',
  { orderId: '123', status: 'pending', items: 5 }
);
```

### 5. `logClient.generateRequestId()`

Gera um novo UUID para rastrear uma requisição.

```typescript
const requestId = this.logClient.generateRequestId();
// Use esse requestId em todos os logs relacionados
```

### 6. `logClient.getRequestId()`

Retorna o requestId atual.

```typescript
const currentRequestId = this.logClient.getRequestId();
```

### 7. `logClient.sendLog(payload)`

Envia um log customizado com controle total.

```typescript
await this.logClient.sendLog({
  requestId: 'custom-id',
  message: 'Evento customizado',
  level: 'INFO',
  context: 'MyService',
  metadata: { custom: 'data' },
  ambient: 'production'
});
```

## 🔄 Middleware Automático

O middleware está ativado globalmente e registra automaticamente:

- ✅ Todas as requisições HTTP (GET, POST, PUT, DELETE, etc)
- ✅ Código de status HTTP
- ✅ Tempo de execução
- ✅ IP do cliente
- ✅ User-Agent
- ✅ RequestId único por requisição

**Exemplo de log gerado automaticamente:**

```
GET /api/users - 200
{
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  method: "GET",
  path: "/api/users",
  statusCode: 200,
  duration: "125ms",
  ip: "192.168.1.1",
  userAgent: "Mozilla/5.0..."
}
```

## 📝 Padrões Recomendados

### ✅ Faça Isso

```typescript
// 1. Sempre use um contexto descritivo
await this.logClient.info('Mensagem', 'AuthService');

// 2. Adicione metadados relevantes
await this.logClient.info('Login', 'AuthService', { userId, email });

// 3. Use requestId para rastrear processos
const requestId = this.logClient.generateRequestId();
await this.logClient.info('Msg 1', 'Service', { requestId });
await this.logClient.info('Msg 2', 'Service', { requestId });

// 4. Sempre inclua o error em logs de erro
await this.logClient.error('Erro', error, 'Service');

// 5. Use o nível apropriado (info, warn, error, debug)
await this.logClient.warn('Situação incomum', 'Service');
```

### ❌ Não Faça Isso

```typescript
// 1. Não envie dados sensíveis
await this.logClient.info('Login', 'Auth', { password: '123456' }); // ❌

// 2. Não deixe de usar contexto
await this.logClient.info('Login bem-sucedido'); // ❌

// 3. Não use nível incorreto
await this.logClient.info('Banco de dados desconectou', 'DB'); // ❌ use error

// 4. Não ignore erros
try { ... } catch (error) { /* sem log */ } // ❌

// 5. Não comita .env com chaves reais
// .env deve estar no .gitignore
```

## 🔐 Segurança

- ✅ Nunca commita `.env` com chaves reais
- ✅ Não envie senhas, tokens ou dados sensíveis nos logs
- ✅ Use variáveis de ambiente para credenciais
- ✅ Confie na renovação automática de chaves

## 🚨 Troubleshooting

### Logs não são enviados

**Possíveis causas:**

1. Servidor Report Logs não está rodando
2. URL incorreta em `LOGS_API_URL`
3. Projeto não tem acesso à internet

**Solução:**

```bash
# Verificar se o servidor está rodando
curl http://localhost:3000/health

# Verificar variáveis de ambiente
echo $LOGS_API_URL
```

### API Key expirada

**O LogClient renova automaticamente!**

Se vir mensagens como:

```
⚠️  API Key expirada ou inválida. Tentando renovar...
```

Não é necessário fazer nada - o cliente obtém uma nova chave automaticamente.

### RequestId não é rastreado

**Certifique-se de:**

1. Gerar requestId com `logClient.generateRequestId()`
2. Incluir no metadata de todos os logs relacionados
3. Usar `await` para garantir que o log foi enviado

## 📞 Exemplo Completo

Veja [example-logging.service.ts](./example-logging.service.ts) para exemplos completos de uso.

## 📚 Documentação Adicional

Consulte os arquivos na raiz do projeto:

- [GUIA-PRATICO.md](../GUIA-PRATICO.md) - Guia rápido
- [INTEGRACAO-OUTRO-PROJETO.md](../INTEGRACAO-OUTRO-PROJETO.md) - Integração detalhada
- [RENOVACAO-AUTOMATICA.md](../RENOVACAO-AUTOMATICA.md) - Sistema de renovação
- [OBTER-API-KEY.md](../OBTER-API-KEY.md) - Como obter chaves

---

**Seu projeto agora tem logs centralizados e automáticos!** 🎉
