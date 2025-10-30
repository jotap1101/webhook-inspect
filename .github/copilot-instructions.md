## Quick orientation

This repository is a small monorepo (root `package.json` workspaces) with two packages:

- `backend/` — Fastify + TypeScript server that captures and exposes webhooks.
- `frontend/` — Vite + React UI.

Focus areas for contributions or code-generation:

- backend: `backend/src/server.ts`, `backend/src/routes/*`, `backend/src/db/*`, `backend/src/env.ts`
- frontend: `frontend/src/` and `frontend/README.md`

## Architecture summary (what you should know)

- Monorepo using npm workspaces. Work on a package by running npm workspace commands (examples below).
- Backend: Fastify with `fastify-type-provider-zod` (Zod-driven request/response schemas). Routes are implemented as Fastify plugins (see `get-webhooks.ts`).
- DB: Drizzle ORM (Postgres). Table schemas live in `backend/src/db/schema/*.ts`. The connection is created in `backend/src/db/index.ts` using `env.DATABASE_URL`.
- Env: `backend/src/env.ts` validates environment variables with Zod — missing/invalid env will throw on start (DATABASE_URL is required).
- API docs: fastify-swagger + ScalarApiReference registered; docs exposed under `/docs`.

## Developer workflows & commands (reproducible)

Use npm workspaces from the repository root. Examples:

- install dependencies:
  npm install

- start backend in dev (uses `tsx watch` and reads `.env`):
  npm --workspace backend run dev

- run drizzle commands (from root via workspace):
  npm --workspace backend run db:generate # generate migration files
  npm --workspace backend run db:migrate # apply migrations
  npm --workspace backend run db:push # push schema (drizzle-kit)
  npm --workspace backend run db:studio # open drizzle studio

- start frontend dev server:
  npm --workspace frontend run dev

Notes:

- Backend `dev` script: "tsx watch --env-file=.env src/server.ts" — ensure `.env` contains required vars (see `backend/src/env.ts`).

## Project-specific conventions and examples

- Path alias: code uses `@/` imports. See `backend/tsconfig.json` -> `paths` maps `@/*` to `./src/*`. Use the same alias when adding files.
- Route pattern: Each route exports a plugin typed as `FastifyPluginAsyncZod` and registers paths using `env.API_ROUTE_PREFIX`. Example: `app.get(`${env.API_ROUTE_PREFIX}/webhooks`, { schema: { ...zod schemas... }}, handler)` (`backend/src/routes/get-webhooks.ts`).
- Zod-first routes: request query/body/response shapes are defined with Zod in the route `schema` object; keep response shapes narrow and consistent with DB types.
- DB schema: Add or change tables under `backend/src/db/schema/*.ts`. The `webhooks` table stores headers/query as JSONB and body as text (see `webhooks.ts`). After editing schema, run `db:generate`/`db:migrate`.

## Integration & error modes to watch for

- Missing env: `backend/src/env.ts` uses `z.parse(process.env)` — server will crash at startup if required envs (like DATABASE_URL) are absent.
- DB connectivity: DB client created using `drizzle(env.DATABASE_URL)`; migrations and runtime both rely on that URL.
- Schema vs runtime: Some route handlers currently use placeholders (e.g., `get-webhooks.ts` returns generated objects). When hooking to DB, follow existing query/response shapes.

## Files to inspect for context when making changes

- backend/src/server.ts — app bootstrap, CORS, Swagger/docs registration
- backend/src/routes/get-webhooks.ts — canonical route example (Zod + Fastify plugin)
- backend/src/db/schema/webhooks.ts — schema design and types
- backend/src/db/index.ts — how Drizzle is initialized
- backend/src/env.ts — required env keys and defaults
- backend/package.json — dev scripts, drizzle-kit usage
- frontend/README.md and `frontend/package.json` — frontend dev/build commands

## If you are generating code for the backend

- Use `@/` imports and Zod for all request/response schemas.
- Register routes as plugins and use `env.API_ROUTE_PREFIX` to build URLs.
- Validate that new DB fields are reflected in schema files and add migrations using the drizzle-kit scripts.

## After making changes

- Run the appropriate workspace script from repo root (see commands above).
- Ensure `.env` is present when starting the backend dev server.

If any of this is unclear or you'd like more examples (e.g., a sample `.env`, or a new CRUD route scaffold), tell me which area to expand and I will iterate.
