# Webhook Inspect

Uma ferramenta completa para inspecionar, analisar e debugar webhooks em tempo real com uma interface interativa e intuitiva. Esta aplicação full-stack permite capturar webhooks, analisá-los em detalhes e gerar código TypeScript para handlers usando IA.

## ✨ Funcionalidades

- 📡 **Captura de webhooks em tempo real** - Recebe e armazena todos os tipos de requisições webhook
- 🔍 **Inspeção detalhada** - Visualize headers, body, query params, método HTTP, IP de origem e muito mais
- 🗑️ **Gerenciamento de webhooks** - Delete webhooks desnecessários com facilidade
- 🤖 **Geração de código com IA** - Gere handlers TypeScript automaticamente usando Google Gemini
- ♾️ **Scroll infinito** - Interface otimizada com paginação baseada em cursor
- 🎨 **Interface moderna** - Design responsivo com tema escuro e syntax highlighting
- 📚 **Documentação interativa** - API docs automática com Swagger/Scalar
- ⚡ **Performance otimizada** - UUIDv7, JSONB storage e queries eficientes

## 🚀 Tecnologias

### Backend

- **Node.js** com **TypeScript** - Runtime e tipagem estática
- **Fastify** - Framework web rápido e eficiente com suporte a Zod
- **Zod** - Validação de schemas TypeScript-first para APIs type-safe
- **Drizzle ORM** - ORM moderno para PostgreSQL com migrations automáticas
- **PostgreSQL** - Banco de dados com suporte a JSONB
- **Google Gemini AI** - Integração para geração automática de código
- **Docker** - Containerização para desenvolvimento local

### Frontend

- **React 19** com **TypeScript** - Framework reativo com tipagem
- **Vite** - Build tool e dev server ultra-rápido
- **TanStack Router** - Roteamento type-safe
- **TanStack Query** - Gerenciamento de estado do servidor
- **Tailwind CSS** - Framework CSS utility-first com tema customizado
- **Radix UI** - Componentes acessíveis e sem estilo
- **Shiki** - Syntax highlighting para código
- **React Resizable Panels** - Painéis redimensionáveis

## 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **Docker** e **Docker Compose**
- **npm** ou **yarn**
- **Chave da API do Google Gemini** (para funcionalidade de IA)

## 🛠️ Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd webhook-inspect
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o banco de dados PostgreSQL com Docker:

```bash
# Na pasta backend/
cd backend
docker-compose up -d
```

4. Configure as variáveis de ambiente criando um arquivo `.env` na pasta `backend/`:

```env
# Configurações da aplicação
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/webhook_inspect"
NODE_ENV="development"
PORT=3333
HOST="0.0.0.0"
API_DOMAIN="localhost"
API_ROUTE_PREFIX="/api/v1"

# Configurações do Docker PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=webhook_inspect

# Chave da API do Google Gemini (obrigatória para geração de código)
GOOGLE_GENERATIVE_AI_API_KEY="sua_chave_api_aqui"
```

> **Nota:**
>
> - As variáveis `POSTGRES_*` são utilizadas pelo Docker Compose para configurar o container do PostgreSQL
> - A `DATABASE_URL` deve corresponder às credenciais definidas nessas variáveis
> - A `GOOGLE_GENERATIVE_AI_API_KEY` é necessária para a funcionalidade de geração de código com IA

5. Execute as migrações do banco de dados:

```bash
# Volte para a raiz do projeto
cd ..
npm --workspace backend run db:migrate
```

6. (Opcional) Popule o banco com dados de exemplo:

```bash
npm --workspace backend run db:seed
```

## 🚀 Como usar

### Desenvolvimento

1. **Inicie o backend:**

```bash
npm --workspace backend run dev
```

O servidor estará rodando em `http://localhost:3333`

- API disponível em `http://localhost:3333/api/v1`
- Documentação em `http://localhost:3333/docs`
- Webhook capture endpoint: `http://localhost:3333/capture/*`

2. **Inicie o frontend** (em outro terminal):

```bash
npm --workspace frontend run dev
```

A interface estará disponível em `http://localhost:5173`

3. **Configure a URL do backend no frontend** criando `.env` em `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:3333/api/v1
```

### Testando webhooks

Para testar a captura de webhooks, envie requisições para:

```
http://localhost:3333/capture/seu-endpoint-aqui
```

Exemplo usando curl:

```bash
curl -X POST http://localhost:3333/capture/stripe \
  -H "Content-Type: application/json" \
  -d '{"event": "payment_intent.succeeded", "data": {"amount": 1000}}'
```

### Comandos úteis

**Backend:**

```bash
# Desenvolvimento
npm --workspace backend run dev          # Inicia servidor em modo watch

# Banco de dados
npm --workspace backend run db:generate  # Gerar arquivos de migração
npm --workspace backend run db:migrate   # Aplicar migrações
npm --workspace backend run db:push      # Push do schema (desenvolvimento)
npm --workspace backend run db:studio    # Abrir Drizzle Studio (visualizador)
npm --workspace backend run db:seed      # Popular com dados de exemplo
npm --workspace backend run db:reset     # Resetar banco de dados

# Docker
cd backend && docker-compose up -d       # Iniciar PostgreSQL
cd backend && docker-compose down        # Parar PostgreSQL
cd backend && docker-compose restart     # Reiniciar PostgreSQL
```

**Frontend:**

```bash
# Desenvolvimento
npm --workspace frontend run dev          # Servidor de desenvolvimento
npm --workspace frontend run build       # Build para produção
npm --workspace frontend run preview     # Preview da build
npm --workspace frontend run lint        # Lint do código
```

**Monorepo (raiz do projeto):**

```bash
npm install                              # Instalar todas as dependências
npm run dev                              # (se configurado) Iniciar ambos os serviços
```

## 📚 Documentação da API

Com o backend rodando, acesse a documentação interativa da API em:
`http://localhost:3333/docs`

### Principais endpoints:

- `GET /api/v1/webhooks` - Listar webhooks com paginação
- `GET /api/v1/webhooks/:id` - Obter detalhes de um webhook
- `DELETE /api/v1/webhooks/:id` - Deletar um webhook
- `ALL /capture/*` - Capturar webhooks (todos os métodos HTTP)
- `POST /api/v1/handler/generate` - Gerar código TypeScript com IA
- `GET /api/v1/healthy` - Health check da aplicação

## 🏗️ Estrutura do projeto

```
webhook-inspect/
├── package.json              # Configuração do monorepo (workspaces)
├── README.md                 # Documentação principal
├── .github/
│   └── copilot-instructions.md # Instruções para GitHub Copilot
├── backend/                  # API Fastify + TypeScript
│   ├── src/
│   │   ├── server.ts         # Bootstrap da aplicação Fastify
│   │   ├── env.ts            # Validação de variáveis de ambiente
│   │   ├── routes/           # Definição das rotas da API
│   │   │   ├── capture-webhook.ts    # Captura universal de webhooks
│   │   │   ├── list-webhooks.ts      # Listagem com paginação
│   │   │   ├── get-webhook.ts        # Detalhes de webhook específico
│   │   │   ├── delete-webhook.ts     # Exclusão de webhooks
│   │   │   ├── generate-handler.ts   # Geração de código com IA
│   │   │   └── healthy.ts            # Health check
│   │   └── db/               # Configuração e schema do banco
│   │       ├── index.ts              # Conexão Drizzle
│   │       ├── schema/               # Definições de tabelas
│   │       ├── migrations/           # Arquivos de migração
│   │       ├── seed.ts               # População de dados exemplo
│   │       └── reset.ts              # Reset do banco
│   ├── docker-compose.yml    # PostgreSQL para desenvolvimento
│   ├── drizzle.config.ts     # Configuração do Drizzle Kit
│   └── package.json          # Dependencies e scripts do backend
└── frontend/                 # Interface React + Vite
    ├── src/
    │   ├── main.tsx          # Entry point da aplicação
    │   ├── index.css         # Estilos globais e tema Tailwind
    │   ├── components/       # Componentes React reutilizáveis
    │   │   ├── webhooks-list.tsx     # Lista com scroll infinito
    │   │   ├── webhook-details.tsx   # Visualização detalhada
    │   │   ├── sidebar.tsx           # Navegação lateral
    │   │   └── ui/                   # Componentes base (Radix UI)
    │   ├── routes/           # Páginas da aplicação (TanStack Router)
    │   └── http/schemas/     # Schemas Zod para API (frontend)
    ├── vite.config.ts        # Configuração do Vite
    └── package.json          # Dependencies e scripts do frontend
```

## 🔄 Fluxo de trabalho

1. **Captura de webhooks**: O backend recebe e armazena webhooks em tempo real através do endpoint `/capture/*`
2. **Armazenamento**: Dados são persistidos no PostgreSQL via Drizzle ORM com schema otimizado (JSONB para flexibilidade)
3. **Visualização**: Frontend consome a API REST para exibir webhooks com paginação infinita
4. **Análise**: Interface permite inspecionar todos os aspectos da requisição (headers, body, query params, IP, etc.)
5. **Geração de código**: IA analisa webhooks selecionados e gera handlers TypeScript personalizados
6. **Gerenciamento**: Usuário pode deletar webhooks desnecessários para manter o banco organizado

## 🤖 Funcionalidade de IA

A aplicação integra com **Google Gemini** para gerar automaticamente código TypeScript de handlers baseado nos webhooks capturados:

- Selecione múltiplos webhooks na interface
- Clique em "Gerar handler"
- A IA analisa os payloads e gera código TypeScript com:
  - Schemas Zod para validação
  - Handlers tipados para cada tipo de evento
  - Tratamento de erros apropriado
  - Documentação inline

## 🛠️ Desenvolvimento

### Arquitetura técnica

- **Type Safety**: Zod schemas compartilhados entre frontend e backend
- **Performance**: Cursor-based pagination, UUIDv7 PKs, JSONB indexing
- **Scalability**: Stateless API, efficient queries, modular components
- **Developer Experience**: Hot reload, auto-generated docs, type-safe routing
- **Modern Stack**: Latest React 19, Fastify 5, Drizzle ORM, Tailwind 4

### Padrões de código

- **Backend**: Fastify plugins pattern, environment validation, schema-first API
- **Frontend**: Component composition, custom hooks, state management with TanStack Query
- **Database**: Migration-driven development, schema evolution, seed data for testing
- **Styling**: Utility-first CSS, design system with custom zinc palette, responsive design

## � Deploy

### Backend

O backend pode ser deployado em qualquer plataforma que suporte Node.js:

```bash
# Build e start
npm --workspace backend run build
npm --workspace backend run start
```

Variáveis de ambiente necessárias em produção:

- `DATABASE_URL`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `NODE_ENV=production`

### Frontend

```bash
# Build para produção
npm --workspace frontend run build

# Preview local
npm --workspace frontend run preview
```

Configure `VITE_BACKEND_URL` para apontar para sua API em produção.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## �📝 Licença

ISC

---

**Autor:** jotap1101

**Desafio:** Rocketseat - Full-stack com IA
