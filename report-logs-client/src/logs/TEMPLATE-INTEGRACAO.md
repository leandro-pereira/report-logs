# 🔧 Template para Integração de Logs em Serviços Existentes

Este arquivo mostra como integrar logs em seus serviços existentes com o mínimo de alterações.

## Opção 1: Herdar de BaseService (Recomendado)

### Antes

```typescript
import { Injectable } from '@nestjs/common';
import { SomeRepository } from './some.repository';

@Injectable()
export class SomeService {
  constructor(
    private readonly repository: SomeRepository,
  ) {}

  async create(data: any) {
    const item = await this.repository.create(data);
    return item;
  }
}
```

### Depois

```typescript
import { Injectable } from '@nestjs/common';
import { BaseService } from '../logs/base.service';
import { LogClient } from '../logs/log-client';
import { SomeRepository } from './some.repository';

@Injectable()
export class SomeService extends BaseService {
  constructor(
    private readonly repository: SomeRepository,
    logClient: LogClient,  // Adicione isto
  ) {
    super(logClient);  // Adicione isto
  }

  async create(data: any) {
    try {
      await this.logInfo('Criando novo item', { data });  // Adicione isto
      
      const item = await this.repository.create(data);
      
      await this.logInfo('Item criado com sucesso', { id: item.id });  // Adicione isto
      return item;
    } catch (error) {
      await this.logError('Erro ao criar item', error, { data });  // Adicione isto
      throw error;
    }
  }
}
```

---

## Opção 2: Injetar LogClient Diretamente

### Antes

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  constructor(
    private readonly repository: PaymentRepository,
  ) {}

  async process(orderId: string, amount: number) {
    const payment = await this.repository.save({
      orderId,
      amount,
      status: 'pending',
    });
    return payment;
  }
}
```

### Depois

```typescript
import { Injectable } from '@nestjs/common';
import { LogClient } from '../logs/log-client';  // Adicione isto

@Injectable()
export class PaymentService {
  constructor(
    private readonly repository: PaymentRepository,
    private readonly logClient: LogClient,  // Adicione isto
  ) {}

  async process(orderId: string, amount: number) {
    const requestId = this.logClient.generateRequestId();  // Adicione isto
    
    try {
      await this.logClient.info(  // Adicione isto
        'Iniciando processamento de pagamento',
        'PaymentService',
        { requestId, orderId, amount },
      );
      
      const payment = await this.repository.save({
        orderId,
        amount,
        status: 'pending',
      });
      
      await this.logClient.info(  // Adicione isto
        'Pagamento processado com sucesso',
        'PaymentService',
        { requestId, paymentId: payment.id },
      );
      
      return payment;
    } catch (error) {
      await this.logClient.error(  // Adicione isto
        'Erro ao processar pagamento',
        error,
        'PaymentService',
        { requestId, orderId },
      );
      throw error;
    }
  }
}
```

---

## Opção 3: Integração Mínima (Apenas Erros)

Se você quer apenas registrar erros, sem adicionar muitos logs:

### Antes

```typescript
async updateUser(id: string, data: any) {
  const user = await this.repository.update(id, data);
  return user;
}
```

### Depois

```typescript
async updateUser(id: string, data: any) {
  try {
    const user = await this.repository.update(id, data);
    return user;
  } catch (error) {
    await this.logClient.error(  // Adicione apenas isto
      'Erro ao atualizar usuário',
      error,
      'UserService',
      { userId: id },
    );
    throw error;
  }
}
```

---

## Checklist para Converter um Serviço

- [ ] Adicionar `LogClient` ao constructor
- [ ] Herdar de `BaseService` (opcional, mas recomendado)
- [ ] Chamar `super(logClient)` no constructor (se herdar)
- [ ] Gerar `requestId` no início de métodos críticos
- [ ] Adicionar `logInfo()` para operações importantes
- [ ] Adicionar `logWarn()` para situações incomuns
- [ ] Adicionar `logError()` em blocos catch
- [ ] Incluir `requestId` nos logs relacionados

---

## Exemplo Completo: UsersService

### Original

```typescript
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async create(user: CreateUserDto) {
    const hasUser = await this.usersRepository.checkUserExist(user.email);
    if (hasUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.usersRepository.create(user);
    return newUser;
  }

  async findById(id: string) {
    return await this.usersRepository.findById(id);
  }
}
```

### Com Logs

```typescript
@Injectable()
export class UsersService extends BaseService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
    logClient: LogClient,
  ) {
    super(logClient);
  }

  async create(user: CreateUserDto) {
    const requestId = this.logClient.generateRequestId();

    try {
      await this.logInfo('Iniciando criação de usuário', { 
        requestId, 
        email: user.email 
      });

      const hasUser = await this.usersRepository.checkUserExist(user.email);
      if (hasUser) {
        await this.logWarn('Email já existe', { 
          requestId, 
          email: user.email 
        });
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }

      const newUser = await this.usersRepository.create(user);

      await this.logInfo('Usuário criado com sucesso', { 
        requestId, 
        userId: newUser.id,
        email: newUser.email,
      });

      return newUser;
    } catch (error) {
      await this.logError('Erro ao criar usuário', error, { 
        requestId, 
        email: user.email 
      });
      throw error;
    }
  }

  async findById(id: string) {
    try {
      await this.logDebug('Buscando usuário por ID', { userId: id });

      const user = await this.usersRepository.findById(id);

      if (!user) {
        await this.logWarn('Usuário não encontrado', { userId: id });
        return null;
      }

      return user;
    } catch (error) {
      await this.logError('Erro ao buscar usuário', error, { userId: id });
      throw error;
    }
  }
}
```

---

## Exemplo Completo: Controller

### Original

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }
}
```

### Com Logs

```typescript
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logClient: LogClient,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const requestId = this.logClient.generateRequestId();

    try {
      await this.logClient.info(
        'POST /users - Iniciando',
        'UsersController',
        { requestId, email: createUserDto.email },
      );

      const result = await this.usersService.create(createUserDto);

      await this.logClient.info(
        'POST /users - Sucesso',
        'UsersController',
        { requestId, userId: result.id },
      );

      return result;
    } catch (error) {
      await this.logClient.error(
        'POST /users - Erro',
        error,
        'UsersController',
        { requestId, email: createUserDto.email },
      );
      throw error;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const user = await this.usersService.findById(id);
      return user;
    } catch (error) {
      await this.logClient.error(
        'GET /users/:id - Erro',
        error,
        'UsersController',
        { userId: id },
      );
      throw error;
    }
  }
}
```

---

## 🚀 Prioridade de Integração

Comece por estes serviços (em ordem de importância):

1. **Auth** - Crítico para segurança
2. **Payment** - Crítico para negócio
3. **Users** - Importante para entender fluxos
4. **Agencies** - Importante para agências
5. **Trips** - Central do negócio
6. Demais serviços conforme necessidade

---

## 💡 Dicas

1. **Comece simples**: Adicione apenas logs em métodos críticos
2. **Use herança**: `BaseService` simplifica muito o código
3. **RequestId**: Use em operações multi-passo
4. **Sem pânico**: O middleware já registra todas as requisições HTTP
5. **Gradual**: Integre um serviço por vez, teste, depois próximo

---

## ✅ Verificação

Depois de integrar, teste:

```bash
# 1. Inicie a aplicação
npm run start:dev

# 2. Faça uma requisição
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# 3. Verifique se aparecem logs no console
# Deve ver mensagens como:
# ✅ LogClient inicializado para o projeto "NiceTripsAPI"
# POST /users - 201
# ... seus logs customizados ...
```

---

**Pronto para integrar logs em seus serviços!** 🚀
