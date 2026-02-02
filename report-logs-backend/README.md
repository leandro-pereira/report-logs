# Report Logs - NestJS API

Sistema centralizado de report de logs com armazenamento no Firebase Firestore, notificações por email, renovação automática de chaves e suporte para múltiplos projetos.

## 🚀 Funcionalidades

- ✅ Registro de logs em tempo real no Firestore
- 📧 Envio automático de alertas por email quando ocorrem erros
- 🧹 Limpeza automática de logs com mais de 1 mês
- 📊 Relatório diário de logs por email
- ⏰ Tarefas agendadas com cron jobs
- 🔍 API REST para consultar e gerenciar logs
- 🔐 Gerenciamento de API Keys com renovação automática
- 🆔 Rastreamento de requisições com requestId único
- 🌍 Suporte a múltiplos ambientes (development, staging, production)
- 🔄 Renovação automática de chaves quando expiram

## 📚 Documentação para Integração

### 👤 Para Outro Projeto usar Report Logs:

| Documento | Descrição |
|-----------|-----------|
| **[GUIA-PRATICO.md](./GUIA-PRATICO.md)** | 👈 **COMECE AQUI** - Guia prático passo-a-passo |
| [PROMPT-RAPIDO.md](./PROMPT-RAPIDO.md) | Resumo em 3 passos |
| [OBTER-API-KEY.md](./OBTER-API-KEY.md) | Como obter e gerenciar chaves |
| [INTEGRACAO-OUTRO-PROJETO.md](./INTEGRACAO-OUTRO-PROJETO.md) | Integração completa com exemplos |
| [RENOVACAO-AUTOMATICA.md](./RENOVACAO-AUTOMATICA.md) | Sistema de renovação automática |

**[📖 Vá direto para o guia prático →](./GUIA-PRATICO.md)**

---

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn
- Conta Firebase com Firestore ativado
- Conta de email (Gmail ou similar com SMTP)

## 🔧 Instalação do Report Logs

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_PRIVATE_KEY=sua-private-key-com-quebras-de-linha
FIREBASE_CLIENT_EMAIL=seu-service-account@project.iam.gserviceaccount.com

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app-gmail
EMAIL_FROM=seu-email@gmail.com
EMAIL_TO=destinatario@example.com

# Application
NODE_ENV=development
PORT=3000

# Log Retention (dias)
LOG_RETENTION_DAYS=30
```

### 3. Obter Credenciais Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para **Configurações do Projeto** → **Contas de Serviço**
4. Clique em **Gerar nova chave privada**
5. Copie os valores de `project_id`, `private_key` e `client_email`

### 4. Configurar Email (Gmail)

1. Ative a autenticação de 2 fatores em sua conta Google
2. Acesse [Senhas de aplicativo](https://myaccount.google.com/apppasswords)
3. Gere uma senha de aplicativo para Gmail
4. Use esta senha no campo `SMTP_PASS`

## 🚀 Executar a Aplicação

### Desenvolvimento

```bash
npm run start:dev
```

### Produção

```bash
npm run build
npm run start
```

## 📚 Endpoints da API

### 1. Criar Log

```bash
POST /logs
Content-Type: application/json

{
  "message": "Erro crítico detectado",
  "level": "ERROR",
  "context": "UserService"
}
```

### 2. Listar Logs

```bash
GET /logs?limit=50
```

### 3. Obter Log por ID

```bash
GET /logs/:id
```

### 4. Limpar Logs Antigos

```bash
POST /logs/cleanup
```

### 5. Enviar Relatório

```bash
POST /logs/report/send
```

### 6. Health Check

```bash
GET /health
```

## ⏰ Tarefas Agendadas

- **02:00 AM**: Limpeza automática de logs com mais de 30 dias
- **08:00 AM**: Envio de relatório diário de logs

Personalize os horários em [src/schedule/schedule.service.ts](src/schedule/schedule.service.ts)

## 📁 Estrutura do Projeto

```
src/
├── config/              # Configurações centralizadas
├── firebase/            # Integração Firestore
├── email/              # Serviço de email
├── logs/               # Módulo de logs (Controller, Service, DTO)
├── schedule/           # Tarefas agendadas (Cron)
└── main.ts
```

## 🚀 Scripts Disponíveis

```bash
npm run start           # Executar em produção
npm run start:dev      # Desenvolvimento com hot reload
npm run build          # Build para produção
npm run lint           # Executar linter
npm test              # Rodar testes
```

## 🔐 Segurança

- Nunca comita `.env` - Use `.env.example`
- Proteja a chave privada Firebase
- Use senhas de aplicativo para emails
- Valide sempre a entrada de dados

## 📖 Recursos Adicionais

- [NestJS Docs](https://docs.nestjs.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/database/admin/start)
- [Nodemailer](https://nodemailer.com/)

---

**Desenvolvido com ❤️ usando NestJS**
