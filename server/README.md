# TechCare API

Express, TypeScript, Prisma, and PostgreSQL backend for the TechCare dashboard.

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and a random `JWT_SECRET` of at least 32 characters.
2. Install and generate the Prisma client: `npm install`.
3. Apply migrations: `npm run prisma:deploy` (or `npm run prisma:migrate` during local development).
4. Optionally set the three `COALITION_*` variables and run `npm run import:coalition`.
5. Start development mode with `npm run dev`.

The importer uses server-only Basic Auth credentials, validates the remote payload, and upserts records in per-patient transactions. Re-running it does not duplicate imported data.

## API

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/patients`
- `GET /api/patients/:patientId`
- `POST /api/patients/:patientId/diagnostics`
- `PATCH|DELETE /api/patients/:patientId/diagnostics/:diagnosticId`
- `PATCH /api/patients/:patientId/diagnostics` with the diagnostic `id` in the JSON body
- `DELETE /api/patients/:patientId/diagnostics?id=...`

All patient and diagnostic routes require the JWT session cookie. Browser clients must send credentials (for example, `fetch(url, { credentials: 'include' })`). Patient responses use camelCase and contain real UUIDs, nested `diagnosisHistory`, `diagnosticList`, and string-only `labResults`.

## Verification

Run `npm run typecheck` and `npm test`. Tests inject in-memory repositories, so they do not need a PostgreSQL instance.
