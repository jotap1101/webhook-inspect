## Orientação rápida

Esta é uma ferramenta completa de inspeção de webhooks full-stack construída como um monorepo (workspaces do `package.json` raiz) com dois pacotes:

- `backend/` — Servidor Fastify + TypeScript que captura, armazena e expõe webhooks com geração de handlers alimentada por IA.
- `frontend/` — Interface Vite + React com componentes modernos e inspeção de webhooks em tempo real.

**Status do Projeto:** ✅ CONCLUÍDO

Principais funcionalidades implementadas:

- Captura e armazenamento de webhooks em tempo real
- Lista interativa de webhooks com scroll infinito e paginação
- Inspeção detalhada de webhooks (headers, body, query params, método, IP, etc.)
- Funcionalidade de exclusão de webhooks
- Geração de código TypeScript de handlers alimentada por IA usando Google Gemini
- Interface moderna com tema escuro, syntax highlighting e design responsivo
- Documentação completa da API com Swagger/Scalar

Áreas de foco para contribuições ou geração de código:

- backend: `backend/src/server.ts`, `backend/src/routes/*`, `backend/src/db/*`, `backend/src/env.ts`
- frontend: `frontend/src/components/*`, `frontend/src/routes/*`, `frontend/src/http/*`

## Resumo da arquitetura (o que você deve saber)

**Arquitetura completa da aplicação full-stack:**

- **Monorepo**: Configuração de workspaces npm com dependências compartilhadas e desenvolvimento coordenado
- **Backend**: Fastify com `fastify-type-provider-zod` para desenvolvimento de API type-safe
  - Rotas implementadas como plugins Fastify com schemas Zod abrangentes
  - Todas as operações CRUD: Create (capturar), Read (listar/obter), Delete webhooks
  - Integração de IA com Google Gemini para geração de handlers TypeScript
- **Banco de dados**: PostgreSQL com Drizzle ORM
  - Abordagem schema-first com migrações
  - Armazenamento JSONB para dados flexíveis de webhook (headers, query params)
  - Chaves primárias UUIDv7 para melhor performance
- **Frontend**: React moderno com TypeScript
  - TanStack Router para roteamento type-safe
  - TanStack Query para gerenciamento de estado do servidor
  - Tailwind CSS com sistema de design de tema escuro customizado
  - Componentes Radix UI para acessibilidade
  - Syntax highlighting com Shiki
- **Ambiente**: Variáveis de ambiente validadas com Zod com mensagens de erro claras
- **Documentação da API**: Gerada automaticamente com Fastify Swagger + Scalar UI
- **Desenvolvimento**: Configuração completa do Docker para PostgreSQL, hot reload e scripts abrangentes

**Principais funcionalidades técnicas:**

- Scroll infinito com paginação baseada em cursor
- Captura de webhooks em tempo real com extração abrangente de metadados
- Geração de código alimentada por IA usando prompts estruturados
- Design responsivo com painéis redimensionáveis
- Tratamento de erros e estados de carregamento em toda a aplicação
- Type safety de ponta a ponta (TypeScript + Zod)

## Fluxos de trabalho e comandos do desenvolvedor (reproduzíveis)

**Configuração completa de desenvolvimento a partir da raiz do repositório:**

**Configuração Inicial:**

```bash
# Instalar todas as dependências
npm install

# Iniciar banco de dados PostgreSQL
cd backend && docker-compose up -d && cd ..

# Configurar variáveis de ambiente (copiar .env.example para .env em backend/)
# Obrigatórias: DATABASE_URL, GOOGLE_GENERATIVE_AI_API_KEY

# Executar migrações do banco de dados
npm --workspace backend run db:migrate

# Opcional: Popular banco de dados com dados de exemplo
npm --workspace backend run db:seed
```

**Comandos de Desenvolvimento:**

```bash
# Iniciar servidor backend (http://localhost:3333)
npm --workspace backend run dev

# Iniciar servidor de desenvolvimento frontend (http://localhost:5173)
npm --workspace frontend run dev

# Operações do banco de dados
npm --workspace backend run db:generate    # gerar arquivos de migração
npm --workspace backend run db:migrate     # aplicar migrações
npm --workspace backend run db:push        # push do schema (desenvolvimento)
npm --workspace backend run db:studio      # abrir Drizzle Studio
npm --workspace backend run db:seed        # popular com dados de exemplo
npm --workspace backend run db:reset       # resetar banco de dados

# Operações do frontend
npm --workspace frontend run build         # build de produção
npm --workspace frontend run preview       # preview do build de produção
npm --workspace frontend run lint          # lint do código
```

**Pronto para Produção:**

- Backend usa `tsx watch` com carregamento automático de `.env`
- Frontend inclui configuração otimizada do build Vite
- Migrações do banco de dados são versionadas e automatizadas
- Validação de ambiente previne erros de runtime
- Documentação da API auto-gerada e sempre atualizada

## Convenções específicas do projeto e exemplos

**Padrões do Backend:**

- **Aliases de caminho**: Imports `@/` mapeados para `./src/*` em `backend/tsconfig.json`
- **Estrutura de rotas**: Cada rota exporta plugin `FastifyPluginAsyncZod`, usa `env.API_ROUTE_PREFIX`
- **Exemplo**: `app.get(\`\${env.API_ROUTE_PREFIX}/webhooks\`, { schema: { ...zod schemas... }}, handler)`
- **API Zod-first**: Todas as formas de request/response definidas com Zod para type safety
- **Banco de dados**: Chaves primárias UUIDv7, JSONB para dados flexíveis, casing snake_case

**Padrões do Frontend:**

- **Roteamento**: TanStack Router com definições de rota type-safe
- **Estado**: TanStack Query para estado do servidor, React state para UI
- **Estilização**: Tailwind CSS com paleta de tema escuro customizada (baseada em zinc)
- **Componentes**: Primitivos Radix UI com estilização customizada
- **Highlighting de código**: Shiki para syntax highlighting na exibição do body do webhook

**Organização de Arquivos:**

```
backend/src/
├── routes/          # Endpoints da API (capture-webhook, list-webhooks, get-webhook, delete-webhook, generate-handler)
├── db/schema/       # Definições de schema Drizzle
├── db/migrations/   # Arquivos de migração auto-gerados
├── env.ts          # Validação de ambiente com Zod
└── server.ts       # Bootstrap da aplicação Fastify

frontend/src/
├── components/     # Componentes React reutilizáveis
├── routes/         # Componentes de rota TanStack Router
├── http/schemas/   # Schemas Zod do frontend (correspondentes ao backend)
└── main.tsx        # Ponto de entrada da aplicação React
```

**Principais Rotas Implementadas:**

- `GET /api/v1/webhooks` - Listar webhooks com paginação baseada em cursor
- `GET /api/v1/webhooks/:id` - Obter informações detalhadas do webhook
- `DELETE /api/v1/webhooks/:id` - Deletar webhook
- `ALL /capture/*` - Capturar webhooks recebidos (todos os métodos HTTP)
- `POST /api/v1/handler/generate` - Geração de código de handler alimentada por IA
- `GET /docs` - Documentação interativa da API

## Modos de integração e erro para observar

**Variáveis de Ambiente:**

- Backend trava na inicialização se envs obrigatórias estiverem ausentes (validado por `backend/src/env.ts`)
- Obrigatórias: `DATABASE_URL`, `GOOGLE_GENERATIVE_AI_API_KEY`
- Opcionais com padrões: `PORT`, `HOST`, `API_DOMAIN`, `API_ROUTE_PREFIX`, `NODE_ENV`

**Conectividade do Banco de Dados:**

- Cliente DB usa `drizzle(env.DATABASE_URL)` de `backend/src/db/index.ts`
- Migrações e runtime dependem de conexão PostgreSQL válida
- Docker Compose fornece instância PostgreSQL local

**Integração Frontend-Backend:**

- Frontend espera backend na variável de ambiente `VITE_BACKEND_URL`
- Schemas da API compartilhados via definições Zod em `frontend/src/http/schemas/`
- Atualizações em tempo real via refetch automático do TanStack Query

**Integração com IA:**

- API Google Gemini usada para geração de handlers TypeScript
- Requer `GOOGLE_GENERATIVE_AI_API_KEY` válida no ambiente backend
- Tratamento de erro gracioso se serviço de IA indisponível

## Arquivos para inspecionar para contexto ao fazer alterações

**Arquivos Principais da Aplicação:**

- `backend/src/server.ts` — Bootstrap da aplicação Fastify, CORS, registro Swagger/docs, registro de rotas
- `backend/src/env.ts` — Validação de variáveis de ambiente e definições de tipos
- `backend/src/db/index.ts` — Conexão e configuração do banco de dados Drizzle
- `backend/src/db/schema/webhooks.ts` — Schema completo da tabela webhook com todos os campos

**Exemplos de Rotas do Backend:**

- `backend/src/routes/list-webhooks.ts` — Implementação de paginação baseada em cursor
- `backend/src/routes/get-webhook.ts` — Recuperação individual de webhook com detalhes completos
- `backend/src/routes/delete-webhook.ts` — Exclusão de webhook com tratamento de erro
- `backend/src/routes/capture-webhook.ts` — Captura universal de webhook (todos os métodos HTTP)
- `backend/src/routes/generate-handler.ts` — Geração de código TypeScript alimentada por IA

**Arquitetura do Frontend:**

- `frontend/src/routes/__root.tsx` — Layout da aplicação com painéis e providers
- `frontend/src/components/webhooks-list.tsx` — Implementação de scroll infinito com integração de IA
- `frontend/src/components/webhook-details.tsx` — Interface de inspeção detalhada de webhook
- `frontend/src/components/sidebar.tsx` — Navegação principal e container da lista de webhooks
- `frontend/src/http/schemas/webhooks.ts` — Schemas da API frontend correspondentes ao backend

**Configuração & Setup:**

- `backend/package.json` — Todos os scripts npm disponíveis e dependências
- `frontend/package.json` — Configuração de build frontend e dependências
- `backend/drizzle.config.ts` — Configuração de migração e schema do banco de dados
- `backend/docker-compose.yml` — Setup do banco de dados PostgreSQL de desenvolvimento

## Se você estiver gerando código para o backend

- Use imports `@/` e Zod para todos os schemas de request/response.
- Registre rotas como plugins e use `env.API_ROUTE_PREFIX` para construir URLs.
- Valide que novos campos do BD estão refletidos nos arquivos de schema e adicione migrações usando os scripts drizzle-kit.

## Depois de fazer alterações

- Execute o script workspace apropriado da raiz do repositório (veja comandos acima).
- Certifique-se de que `.env` está presente ao iniciar o servidor backend em dev.

Se algo não estiver claro ou você quiser mais exemplos (ex.: um `.env` de exemplo, ou um scaffold de nova rota CRUD), me diga qual área expandir e eu iterarei.
