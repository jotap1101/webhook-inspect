# Webhook Inspector

Uma ferramenta completa para inspecionar, analisar e debugar webhooks em tempo real com uma interface interativa e intuitiva.

## 🚀 Tecnologias

### Backend

- **Node.js** com **TypeScript**
- **Fastify** - Framework web rápido e eficiente
- **Zod** - Validação de schemas TypeScript-first
- **Drizzle ORM** - ORM moderno para PostgreSQL
- **PostgreSQL** - Banco de dados

### Frontend

- **React** com **TypeScript**
- **Vite** - Build tool e dev server

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- Docker e Docker Compose
- npm

## 🛠️ Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd webhook-inspector
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
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/webhook_inspector"
NODE_ENV="development"
PORT=3333
HOST="0.0.0.0"
API_DOMAIN="localhost"
API_ROUTE_PREFIX="/api/v1"

# Configurações do Docker PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=webhook_inspector
```

> **Nota:** As variáveis `POSTGRES_*` são utilizadas pelo Docker Compose para configurar o container do PostgreSQL. A `DATABASE_URL` deve corresponder às credenciais definidas nessas variáveis.

5. Execute as migrações do banco de dados:

```bash
# Volte para a raiz do projeto
cd ..
npm --workspace backend run db:migrate
```

## 🚀 Como usar

### Desenvolvimento

1. **Inicie o backend:**

```bash
npm --workspace backend run dev
```

O servidor estará rodando em `http://localhost:3333`

2. **Inicie o frontend** (em outro terminal):

```bash
npm --workspace frontend run dev
```

A interface estará disponível em `http://localhost:5173`

### Comandos úteis

**Backend:**

```bash
# Gerar migrações
npm --workspace backend run db:generate

# Aplicar migrações
npm --workspace backend run db:migrate

# Abrir Drizzle Studio (visualizador do banco)
npm --workspace backend run db:studio

# Push do schema (desenvolvimento)
npm --workspace backend run db:push

# Parar o banco de dados
cd backend && docker-compose down

# Reiniciar o banco de dados
cd backend && docker-compose restart
```

**Frontend:**

```bash
# Build para produção
npm --workspace frontend run build

# Preview da build
npm --workspace frontend run preview

# Lint
npm --workspace frontend run lint
```

## 📚 Documentação da API

Com o backend rodando, acesse a documentação interativa da API em:
`http://localhost:3333/docs`

## 🏗️ Estrutura do projeto

```
webhook-inspector/
├── backend/           # API Fastify + TypeScript
│   ├── src/
│   │   ├── server.ts  # Configuração do servidor
│   │   ├── env.ts     # Validação de variáveis de ambiente
│   │   ├── routes/    # Rotas da API
│   │   └── db/        # Schema e configuração do banco
│   └── package.json
├── frontend/          # Interface React + Vite
│   ├── src/
│   └── package.json
└── package.json       # Configuração do monorepo
```

## 🔄 Fluxo de trabalho

1. **Captura de webhooks**: O backend recebe e armazena webhooks em tempo real
2. **Armazenamento**: Dados são persistidos no PostgreSQL via Drizzle ORM
3. **Visualização**: Frontend consome a API para exibir os webhooks capturados
4. **Análise**: Interface permite inspecionar headers, body, query params, etc.

## 📝 Licença

ISC

---

**Autor:** jotap1101
