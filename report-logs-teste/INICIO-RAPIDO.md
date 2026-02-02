# ⚡ INÍCIO RÁPIDO - 5 Minutos

Se você quer começar em menos de 5 minutos, siga este guia.

---

## 1️⃣ Verificar Instalação (1 minuto)

```bash
# Terminal - verificar compilação
npm run build

# Esperado: Sem erros
# Se houver erro, execute:
npm install
npm run build
```

## 2️⃣ Iniciar Aplicação (1 minuto)

```bash
# Iniciar em modo desenvolvimento
npm run start:dev

# Esperado: Ver algo como:
# ✅ LogClient inicializado para o projeto "NiceTripsAPI"
# [NestFactory] Starting Nest application...
# ✓ Nest application successfully started on port 3000
```

## 3️⃣ Testar Logs (1 minuto)

```bash
# Terminal 2 - fazer requisição
curl http://localhost:3000/

# Terminal 1 (app rodando) - deve mostrar algo como:
# GET / - 200
```

## 4️⃣ Usar em um Serviço (2 minutos)

Escolha um dos padrões abaixo:

### Padrão A: Herança (Recomendado)

```typescript
import { Injectable } from '@nestjs/common';
import { BaseService } from './logs/base.service';
import { LogClient } from './logs/log-client';

@Injectable()
export class MeuServico extends BaseService {
  constructor(logClient: LogClient) {
    super(logClient);
  }

  async meuMetodo() {
    try {
      await this.logInfo('Iniciando operação', { dados: 'aqui' });
      // Sua lógica...
      await this.logInfo('Operação concluída');
    } catch (error) {
      await this.logError('Erro', error);
      throw error;
    }
  }
}
```

### Padrão B: Injeção Direta

```typescript
@Injectable()
export class MeuServico {
  constructor(private readonly logClient: LogClient) {}

  async meuMetodo() {
    try {
      await this.logClient.info('Msg', 'MeuServico', { dados: 'aqui' });
      // Sua lógica...
    } catch (error) {
      await this.logClient.error('Erro', error, 'MeuServico');
      throw error;
    }
  }
}
```

---

## ✅ Pronto!

Você tem:
- ✅ LogClient em todos os serviços
- ✅ Middleware automático para HTTP
- ✅ Renovação automática de chaves
- ✅ RequestId único por requisição

---

## 📚 Próximo Passo

Leia [src/logs/README.md](./README.md) para detalhes completos.

---

**É isso! Enjoy!** 🚀
