# 🚀 Guia de Integração do LogClient em Rotas

Este documento mostra como integrar o LogClient em diferentes tipos de rotas e serviços do seu projeto NiceTripsAPI.

## 📋 Índice

1. [Integração em Controllers](#integração-em-controllers)
2. [Integração em Serviços](#integração-em-serviços)
3. [Integração em Repositórios](#integração-em-repositórios)
4. [Integração em Guard/Interceptors](#integração-em-guardinterceptors)
5. [Exemplo Completo: Fluxo de Pagamento](#exemplo-completo-fluxo-de-pagamento)

---

## Integração em Controllers

### Padrão Básico

```typescript
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LogClient } from '../logs/log-client';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

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
      await this.logClient.info(
        'POST /users - Iniciando criação de usuário',
        'UserController',
        { requestId, email: createUserDto.email },
      );

      const user = await this.userService.create(createUserDto);

      await this.logClient.info(
        'POST /users - Usuário criado com sucesso',
        'UserController',
        { requestId, userId: user.id, email: user.email },
      );

      return { success: true, data: user };
    } catch (error) {
      await this.logClient.error(
        'POST /users - Erro ao criar usuário',
        error,
        'UserController',
        { requestId, email: createUserDto.email },
      );
      throw error;
    }
  }
}
```

---

## Integração em Serviços

### Usando BaseService (Recomendado)

```typescript
import { Injectable } from '@nestjs/common';
import { BaseService } from '../logs/base.service';
import { LogClient } from '../logs/log-client';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends BaseService {
  constructor(
    private readonly userRepository: UserRepository,
    logClient: LogClient,
  ) {
    super(logClient);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      await this.logInfo('Criando novo usuário', { 
        email: createUserDto.email 
      });

      const user = await this.userRepository.create(createUserDto);

      await this.logInfo('Usuário criado com sucesso', { 
        userId: user.id,
        email: user.email,
      });

      return user;
    } catch (error) {
      await this.logError('Erro ao criar usuário', error, { 
        email: createUserDto.email 
      });
      throw error;
    }
  }

  async findById(id: string) {
    try {
      await this.logDebug('Buscando usuário por ID', { userId: id });

      const user = await this.userRepository.findById(id);

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

### Sem BaseService

```typescript
import { Injectable } from '@nestjs/common';
import { LogClient } from '../logs/log-client';

@Injectable()
export class PaymentService {
  constructor(
    private readonly logClient: LogClient,
  ) {}

  async processPayment(orderId: string, amount: number) {
    const requestId = this.logClient.generateRequestId();

    try {
      await this.logClient.info(
        'Iniciando processamento de pagamento',
        'PaymentService',
        { requestId, orderId, amount },
      );

      // Validar pagamento...
      const result = await this.validatePayment(orderId, amount);

      await this.logClient.info(
        'Pagamento processado com sucesso',
        'PaymentService',
        { requestId, orderId, amount, transactionId: result.id },
      );

      return result;
    } catch (error) {
      await this.logClient.error(
        'Erro ao processar pagamento',
        error,
        'PaymentService',
        { requestId, orderId, amount },
      );
      throw error;
    }
  }
}
```

---

## Integração em Repositórios

```typescript
import { Injectable } from '@nestjs/common';
import { BaseService } from '../logs/base.service';
import { LogClient } from '../logs/log-client';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends BaseService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    logClient: LogClient,
  ) {
    super(logClient);
  }

  async create(data: any): Promise<User> {
    try {
      await this.logDebug('Inserindo novo usuário no banco', { 
        email: data.email 
      });

      const user = this.repository.create(data);
      const savedUser = await this.repository.save(user);

      await this.logInfo('Usuário inserido no banco com sucesso', { 
        userId: savedUser.id 
      });

      return savedUser;
    } catch (error) {
      await this.logError('Erro ao inserir usuário no banco', error, { 
        email: data.email 
      });
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      await this.logDebug('Buscando usuário no banco', { userId: id });

      const user = await this.repository.findOne({ where: { id } });

      return user || null;
    } catch (error) {
      await this.logError('Erro ao buscar usuário no banco', error, { 
        userId: id 
      });
      throw error;
    }
  }
}
```

---

## Integração em Guard/Interceptors

### AuthGuard com Logs

```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { LogClient } from '../logs/log-client';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly logClient: LogClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    const requestId = this.logClient.generateRequestId();

    if (!token) {
      await this.logClient.warn(
        'Tentativa de acesso sem token',
        'AuthGuard',
        { requestId, path: request.path, ip: request.ip },
      );
      throw new UnauthorizedException();
    }

    try {
      // Validar token...
      const user = this.validateToken(token);

      await this.logClient.info(
        'Autenticação bem-sucedida',
        'AuthGuard',
        { requestId, userId: user.id, path: request.path },
      );

      request.user = user;
      return true;
    } catch (error) {
      await this.logClient.warn(
        'Token inválido',
        'AuthGuard',
        { requestId, path: request.path, error: error.message },
      );
      throw new UnauthorizedException();
    }
  }

  private validateToken(token: string) {
    // Sua lógica de validação...
    return { id: 'user-123' };
  }
}
```

---

## Exemplo Completo: Fluxo de Pagamento

### Cenário: Usuário compra uma viagem e faz pagamento

```typescript
// payment.controller.ts
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly logClient: LogClient,
  ) {}

  @Post(':orderId/checkout')
  async checkout(
    @Param('orderId') orderId: string,
    @Body() checkoutDto: CheckoutDto,
  ) {
    const requestId = this.logClient.generateRequestId();

    try {
      // Log 1: Início da requisição
      await this.logClient.info(
        'Iniciando checkout de pagamento',
        'PaymentController',
        { requestId, orderId, userId: checkoutDto.userId },
      );

      // Chamar serviço
      const payment = await this.paymentService.checkout(
        orderId,
        checkoutDto,
        requestId,
      );

      // Log 2: Sucesso
      await this.logClient.info(
        'Checkout concluído com sucesso',
        'PaymentController',
        { 
          requestId, 
          orderId, 
          paymentId: payment.id,
          amount: payment.amount,
        },
      );

      return { success: true, data: payment };
    } catch (error) {
      // Log 3: Erro
      await this.logClient.error(
        'Erro durante checkout',
        error,
        'PaymentController',
        { requestId, orderId, userId: checkoutDto.userId },
      );
      throw error;
    }
  }
}

// payment.service.ts
@Injectable()
export class PaymentService extends BaseService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly tripService: TripService,
    private readonly asaasService: AsaasService,
    logClient: LogClient,
  ) {
    super(logClient);
  }

  async checkout(orderId: string, dto: CheckoutDto, requestId: string) {
    try {
      // Log 1: Validar viagem
      await this.logInfo('Validando viagem', { 
        requestId, 
        orderId, 
        tripId: dto.tripId 
      });

      const trip = await this.tripService.findById(dto.tripId);
      if (!trip) {
        throw new Error('Viagem não encontrada');
      }

      // Log 2: Criar registro de pagamento
      await this.logInfo('Criando registro de pagamento', { 
        requestId, 
        orderId,
        amount: dto.amount,
      });

      const payment = await this.paymentRepository.create({
        orderId,
        tripId: dto.tripId,
        amount: dto.amount,
        status: 'pending',
      });

      // Log 3: Processar pagamento via Asaas
      await this.logInfo('Processando pagamento via Asaas', { 
        requestId, 
        paymentId: payment.id,
        amount: dto.amount,
      });

      const asaasResult = await this.asaasService.charge({
        amount: dto.amount,
        customerId: dto.customerId,
        description: `Viagem ${trip.name}`,
      });

      // Log 4: Atualizar status
      await this.logInfo('Atualizando status do pagamento', { 
        requestId, 
        paymentId: payment.id,
        newStatus: asaasResult.status,
        asaasTransactionId: asaasResult.id,
      });

      payment.status = asaasResult.status;
      payment.asaasTransactionId = asaasResult.id;
      await this.paymentRepository.save(payment);

      // Log 5: Sucesso
      await this.logInfo('Pagamento concluído com sucesso', { 
        requestId, 
        paymentId: payment.id,
        status: payment.status,
      });

      return payment;
    } catch (error) {
      // Log de erro com contexto completo
      await this.logError('Erro ao processar checkout', error, { 
        requestId, 
        orderId,
        errorMessage: error.message,
      });
      throw error;
    }
  }
}
```

---

## 📊 Estrutura de Logs Recomendada

### Padrão de Nomes

Use este padrão para nomear seus logs:

```typescript
// Para rotas:
'GET /users/{id} - Usuário recuperado'
'POST /users - Novo usuário criado'
'PUT /users/{id} - Usuário atualizado'
'DELETE /users/{id} - Usuário deletado'

// Para serviços:
'Validando dados de entrada'
'Processando lógica de negócio'
'Salvando em banco de dados'
'Enviando notificação'

// Para erros:
'Erro ao validar dados'
'Erro ao conectar em banco'
'Erro ao chamar API externa'
```

### Metadata Recomendada

```typescript
// Sempre inclua:
{
  requestId,           // Para rastrear a requisição
  userId,             // Se aplicável
  resourceId,         // ID do recurso sendo manipulado
  operation,          // Operação sendo realizada
  duration,           // Tempo decorrido (ms)
  resultStatus,       // sucesso/falha
}

// Não inclua:
// - senhas
// - tokens
// - cartões de crédito
// - dados muito grandes
```

---

## 🔄 Boas Práticas

### ✅ Faça

1. Gerar `requestId` uma vez por requisição
2. Passar o mesmo `requestId` em todos os logs relacionados
3. Usar o nível apropriado (info, warn, error, debug)
4. Incluir contexto relevante nos metadados
5. Herdar de `BaseService` para comodidade

### ❌ Não Faça

1. Não omita o `context` (nome do serviço/controller)
2. Não envie dados sensíveis
3. Não use níveis incorretos
4. Não decore requestId em metadados sem necessidade
5. Não trate erros silenciosamente sem log

---

## 📞 Verificação de Instalação

Para verificar se tudo está funcionando:

1. Inicie a aplicação: `npm run start:dev`
2. Faça uma requisição: `curl http://localhost:3000/`
3. Verifique se vê logs no console da aplicação
4. Acesse o dashboard do Report Logs para ver os logs centralizados

---

**Parabéns! Seu projeto agora tem logging completo em todas as rotas!** 🎉
