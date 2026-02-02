# 📚 Índice Completo - Módulo de Logs

Bem-vindo ao módulo de logs do NiceTrips API! Este índice ajuda a navegar pela documentação e código.

---

## 📂 Estrutura do Módulo

```
src/logs/
├── 📄 log-client.ts                 # Cliente principal para enviar logs
├── 📄 logs.module.ts                # Módulo NestJS global (Global)
├── 📄 logs.middleware.ts            # Middleware para rastrear requisições HTTP
├── 📄 base.service.ts               # Classe base para herança em serviços
├── 📄 example-logging.service.ts    # Exemplos práticos de uso
├── 📄 index.ts                      # Exportações do módulo
├── 📄 .env.example.logs             # Template de variáveis de ambiente
│
├── 📖 README.md                     # Guia principal de uso
├── 📖 INTEGRACAO-ROTAS.md          # Exemplos de integração em rotas
├── 📖 TEMPLATE-INTEGRACAO.md       # Template para adicionar logs em serviços
├── 📖 CHECKLIST-INSTALACAO.md      # Checklist passo-a-passo
├── 📖 TROUBLESHOOTING.md           # Guia de resolução de problemas
├── 📖 IMPLEMENTACAO-SUMARIO.md     # Resumo da implementação
└── 📖 INDEX.md                     # Este arquivo
```

---

## 🚀 Começar Rápido (5 minutos)

### Para Iniciantes

1. **Ler primeiro:** [README.md](./README.md) - Visão geral completa
2. **Ver exemplos:** [INTEGRACAO-ROTAS.md](./INTEGRACAO-ROTAS.md) - Como usar em rotas
3. **Começar a integrar:** [TEMPLATE-INTEGRACAO.md](./TEMPLATE-INTEGRACAO.md) - Copiar e colar

### Para Experientes

1. Verificar [example-logging.service.ts](./example-logging.service.ts) para exemplos rápidos
2. Herdar de [base.service.ts](./base.service.ts) para simplificar
3. Consultar [log-client.ts](./log-client.ts) para API completa

---

## 📖 Documentação Detalhada

### 📘 [README.md](./README.md) - Leia Primeiro!
**Melhor para:** Entender como o módulo funciona
**Contém:**
- Visão geral das características
- Instalação de dependências
- Métodos disponíveis (info, warn, error, debug)
- Middleware automático
- Padrões recomendados
- Boas práticas

**Tempo de leitura:** 10 minutos

---

### 📗 [INTEGRACAO-ROTAS.md](./INTEGRACAO-ROTAS.md) - Exemplos Práticos
**Melhor para:** Aprender com exemplos reais
**Contém:**
- Padrão básico em controllers
- Padrão em serviços
- Padrão em repositórios
- Padrão em guards/interceptors
- Exemplo completo: fluxo de pagamento
- Estrutura de logs recomendada
- Boas práticas

**Tempo de leitura:** 15 minutos

---

### 📕 [TEMPLATE-INTEGRACAO.md](./TEMPLATE-INTEGRACAO.md) - Guia Passo-a-Passo
**Melhor para:** Converter serviços existentes
**Contém:**
- Opção 1: Herdar de BaseService (recomendado)
- Opção 2: Injetar LogClient diretamente
- Opção 3: Integração mínima (apenas erros)
- Checklist para converter um serviço
- Exemplo completo de UsersService
- Exemplo completo de Controller
- Prioridade de integração

**Tempo de leitura:** 10 minutos

---

### 📙 [CHECKLIST-INSTALACAO.md](./CHECKLIST-INSTALACAO.md) - Verificação Passo-a-Passo
**Melhor para:** Verificar se tudo está instalado corretamente
**Contém:**
- Checklist de pré-requisitos
- Verificação de instalação de dependências
- Verificação de estrutura de arquivos
- Verificação de integração no AppModule
- Verificação de variáveis de ambiente
- Teste de compilação
- Teste de execução
- Teste de logs
- Teste de renovação de API Key
- Verificações finais
- Troubleshooting básico

**Tempo de leitura:** 15 minutos

---

### 📕 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Resolução de Problemas
**Melhor para:** Quando algo não funciona
**Contém:**
- Problema: "Cannot find module"
- Problema: "LogsModule is not imported"
- Problema: Logs não são enviados
- Problema: API Key expirada
- Problema: Cannot GET /api-keys
- Problema: Middleware não funciona
- Problema: RequestId não aparece
- Problema: Logs contêm dados sensíveis
- Problema: Arquivo .env foi commited
- Problema: TypeError
- Problema: Aplicação fica lenta
- Problema: ECONNREFUSED
- Problema: Erro ao salvar .env
- E muitos outros...

**Tempo de leitura:** 20 minutos (consultar conforme necessário)

---

### 📊 [IMPLEMENTACAO-SUMARIO.md](./IMPLEMENTACAO-SUMARIO.md) - Resumo Técnico
**Melhor para:** Entender o que foi implementado
**Contém:**
- O que foi implementado
- Estrutura de arquivos
- Características implementadas
- Como usar
- Exemplos de logs
- Fluxo de renovação
- Documentação disponível
- Próximos passos
- Checklist de implementação

**Tempo de leitura:** 10 minutos

---

## 💻 Código-Fonte

### 📄 [log-client.ts](./log-client.ts) - Cliente Principal
**O quê:** Cliente TypeScript para enviar logs
**Usado por:** Todos os serviços e controllers
**Métodos principais:**
- `info(message, context?, metadata?)` - Log de informação
- `warn(message, context?, metadata?)` - Log de aviso
- `error(message, error?, context?, metadata?)` - Log de erro
- `debug(message, context?, metadata?)` - Log de debug
- `generateRequestId()` - Gera novo UUID
- `getRequestId()` - Obtém UUID atual
- `sendLog(payload)` - Envia log customizado

---

### 📄 [logs.module.ts](./logs.module.ts) - Módulo NestJS
**O quê:** Módulo global que fornece LogClient
**Características:**
- Geração automática de API Key se não existir
- Atualização automática de .env
- Renovação automática de chave expirada
- Inicialização com mensagens de sucesso

---

### 📄 [logs.middleware.ts](./logs.middleware.ts) - Middleware
**O quê:** Middleware que registra requisições HTTP
**Funcionalidades:**
- Registra todas as requisições HTTP automaticamente
- Captura status code, tempo de execução, IP, User-Agent
- Usa nível apropriado (info, warn, error)
- Gera requestId único por requisição

---

### 📄 [base.service.ts](./base.service.ts) - Classe Base
**O quê:** Classe base para herança em serviços
**Métodos:**
- `logInfo(message, metadata?)` - Log com contexto automático
- `logWarn(message, metadata?)` - Aviso com contexto automático
- `logError(message, error?, metadata?)` - Erro com contexto automático
- `logDebug(message, metadata?)` - Debug com contexto automático
- `generateRequestId()` - Gera novo requestId
- `getRequestId()` - Obtém requestId atual

---

### 📄 [example-logging.service.ts](./example-logging.service.ts) - Exemplos
**O quê:** Serviço com exemplos de todos os padrões
**Exemplos:**
1. Log simples
2. Log com metadados
3. Log de erro
4. Log de aviso
5. Log de debug
6. Usando requestId
7. Processo multi-passo

---

## 🎯 Fluxos de Uso

### Fluxo 1: Usar em um Novo Serviço (Recomendado)

```
1. Criar novo serviço
   ↓
2. Herdar de BaseService
   ↓
3. Injetar LogClient no constructor
   ↓
4. Chamar super(logClient)
   ↓
5. Usar this.logInfo(), this.logError(), etc
```

**Documentação:** [TEMPLATE-INTEGRACAO.md](./TEMPLATE-INTEGRACAO.md) - Opção 1

---

### Fluxo 2: Converter Serviço Existente

```
1. Adicionar LogClient ao constructor
   ↓
2. Herdar de BaseService (opcional)
   ↓
3. Envolver métodos em try/catch
   ↓
4. Adicionar logs em pontos críticos
   ↓
5. Testar e validar logs
```

**Documentação:** [TEMPLATE-INTEGRACAO.md](./TEMPLATE-INTEGRACAO.md)

---

### Fluxo 3: Adicionar Logs a um Controller

```
1. Injetar LogClient
   ↓
2. Gerar requestId no início
   ↓
3. Registrar início da operação
   ↓
4. Executar lógica
   ↓
5. Registrar sucesso
   ↓
6. Ou registrar erro em catch
```

**Documentação:** [INTEGRACAO-ROTAS.md](./INTEGRACAO-ROTAS.md)

---

## 📋 Checklist de Uso

### Antes de Começar
- [ ] Li [README.md](./README.md)
- [ ] Entendi como funciona o middleware
- [ ] Tenho conectividade com Report Logs
- [ ] Variáveis de ambiente estão configuradas

### Para Cada Serviço
- [ ] Herdei de BaseService ou injetei LogClient
- [ ] Adicionei logs em operações críticas
- [ ] Adicionei tratamento de erro com log
- [ ] Usei requestId em operações multi-passo
- [ ] Não envio dados sensíveis
- [ ] Testei se os logs aparecem

### Antes de Deploy
- [ ] Todos os logs funcionam
- [ ] .env não foi commited
- [ ] Chaves são diferentes por ambiente
- [ ] Middleware está ativo
- [ ] Renovação automática testada

---

## 🔗 Documentação Externa

Consulte também a documentação na raiz do projeto:

- [GUIA-PRATICO.md](../GUIA-PRATICO.md) - Guia rápido de integração
- [INTEGRACAO-OUTRO-PROJETO.md](../INTEGRACAO-OUTRO-PROJETO.md) - Integração detalhada
- [RENOVACAO-AUTOMATICA.md](../RENOVACAO-AUTOMATICA.md) - Sistema de renovação automática
- [OBTER-API-KEY.md](../OBTER-API-KEY.md) - Como obter chaves API

---

## 🎓 Matriz de Aprendizado

| Experiência | Comece Com | Depois | Finalmente |
|-------------|-----------|--------|-----------|
| **Iniciante** | README.md | INTEGRACAO-ROTAS.md | TEMPLATE-INTEGRACAO.md |
| **Intermediário** | TEMPLATE-INTEGRACAO.md | example-logging.service.ts | TROUBLESHOOTING.md |
| **Avançado** | log-client.ts | base.service.ts | logs.module.ts |
| **DevOps** | CHECKLIST-INSTALACAO.md | logs.module.ts | TROUBLESHOOTING.md |

---

## 💡 Dicas Rápidas

- **Dúvida:** "Como começo?" → [README.md](./README.md)
- **Dúvida:** "Como integro em um serviço?" → [TEMPLATE-INTEGRACAO.md](./TEMPLATE-INTEGRACAO.md)
- **Dúvida:** "Qual padrão usar?" → [INTEGRACAO-ROTAS.md](./INTEGRACAO-ROTAS.md)
- **Dúvida:** "Algo não funciona" → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Dúvida:** "Tudo está instalado?" → [CHECKLIST-INSTALACAO.md](./CHECKLIST-INSTALACAO.md)
- **Dúvida:** "Vejo um exemplo?" → [example-logging.service.ts](./example-logging.service.ts)

---

## 📞 Hierarquia de Suporte

1. **Documentação:** Procure por palavras-chave nos arquivos acima
2. **Exemplos:** Consulte [example-logging.service.ts](./example-logging.service.ts)
3. **Código-fonte:** Leia os comentários em [log-client.ts](./log-client.ts)
4. **Troubleshooting:** Procure o erro em [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
5. **Checklist:** Verifique [CHECKLIST-INSTALACAO.md](./CHECKLIST-INSTALACAO.md)

---

## ✅ Próximas Ações

### Agora (5-10 minutos)
1. Ler [README.md](./README.md)
2. Ver exemplos em [INTEGRACAO-ROTAS.md](./INTEGRACAO-ROTAS.md)

### Hoje (30-60 minutos)
1. Integrar logs em um serviço crítico
2. Testar se logs aparecem
3. Executar [CHECKLIST-INSTALACAO.md](./CHECKLIST-INSTALACAO.md)

### Esta Semana (2-4 horas)
1. Integrar logs em todos os serviços
2. Configurar alertas no Report Logs
3. Analisar primeiros logs

### Este Mês
1. Otimizar logs baseado em dados
2. Criar relatórios customizados
3. Treinamento da equipe

---

## 🎉 Conclusão

Você tem acesso a toda a documentação necessária para:
- ✅ Entender o sistema de logs
- ✅ Integrar em seus serviços
- ✅ Resolver problemas
- ✅ Otimizar logs
- ✅ Treinar a equipe

**Comece agora lendo [README.md](./README.md)!** 🚀

---

**Última atualização:** 01/02/2026
**Versão:** 1.0.0
**Status:** ✅ Completo e Pronto para Uso
