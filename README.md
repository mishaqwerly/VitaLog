# VitaLog Dashboard

Full-stack patient dashboard built with React, TypeScript, Express, Prisma,
PostgreSQL, TanStack Query, and Chart.js.

## Local setup

Prerequisites: Node.js 20+ and PostgreSQL.

```bash
cp .env.example .env
cp server/.env.example server/.env
docker compose up -d
npm install
npm run db:deploy
npm run db:import
```

Start the API and web app in separate terminals:

```bash
npm run dev:api
npm run dev:web
```

Open [http://localhost:5173](http://localhost:5173), register an account, and
sign in. Vite proxies `/api` to `http://localhost:4000` by default.

The Coalition credentials are used only by the server-side import script. They
must never be exposed as `VITE_*` variables. Do not export `VITE_API_URL` in
your shell; leave it empty so the browser uses the Vite `/api` proxy.

## Architecture

- `src/` — React/Vite frontend deployed to Vercel
- `server/` — Express API deployed to Railway
- `server/prisma/` — PostgreSQL schema and migrations
- Vercel forwards `/api/*` to Railway so the JWT cookie remains first-party

## Scripts

- `npm run dev:web` — start Vite
- `npm run dev:api` — start Express in watch mode
- `npm run build` — production frontend build
- `npm run build:api` — production API build
- `npm run typecheck` — frontend TypeScript check
- `npm run typecheck:api` — API TypeScript check
- `npm run test:api` — API tests
- `npm run db:up` — start local PostgreSQL
- `npm run db:migrate` — create/apply a local Prisma migration
- `npm run db:deploy` — apply committed migrations
- `npm run db:import` — idempotently import Coalition demo patients
