# Needlon Monorepo

Marketplace platform: a customer storefront and a seller dashboard, built as a Turborepo + pnpm monorepo.

## Apps

- **`apps/client`** — customer storefront (Next.js App Router): home, product pages, cart, checkout with Stripe, orders, account (addresses, measurements, wishlist), auth via Supabase / NextAuth.
- **`apps/seller`** — seller dashboard (Next.js App Router): product listing with variants and custom attributes, inventory management, orders, invoices / packing slips / shipping labels, manifests, messaging.

## Packages

- **`packages/db`** (`@needlon/db`) — Drizzle ORM schema, migrations, seed scripts.
- **`packages/modules`** — shared domain services, repositories, validations.
- **`packages/client-packages`** — client-app feature modules (auth, cart, checkout, orders, product, account, category).
- **`packages/ui`** — shared React components (includes the shared `Form` component).
- **`docs/`** — documentation.

## Requirements

- Node.js (24+ recommended), pnpm 9 (`corepack` or `npm i -g pnpm@9`)
- A Supabase project (URL + publishable/anon key + secret key)
- Stripe keys for checkout
- A Postgres `DATABASE_URL` (the Supabase connection pooler works)

## Getting started

```bash
pnpm install

# Fill in real values, then copy into place (gitignored — never committed)
cp apps/client/.env.example apps/client/.env.local
cp apps/seller/.env.example apps/seller/.env.local

pnpm db:generate && pnpm db:migrate && pnpm db:seed
pnpm dev
```

`pnpm dev` runs both apps through Turbo. Both apps default to port 3000, so run them side by side with distinct ports, e.g. `pnpm --filter <app> dev -- -p 3001`.

## Scripts (root, via Turbo)

`dev`, `build`, `lint`, `check-types`, `test`, plus `db:generate`, `db:migrate`, `db:seed` (the latter runs `packages/db`'s `seed-database.ts`; `seed-client-data.ts` is available as `pnpm --filter @needlon/db seed:client`).

## Conventions

- TypeScript **strict mode**. **Never use `any`** — enforced by `@typescript-eslint/no-explicit-any` (error). Use the actual type, or `unknown` + narrowing at genuine type boundaries.
- Drizzle ORM only for database access — no raw SQL.
- ESLint + Prettier. Test files exist across the packages; a test runner is on the roadmap (see the production-grade report).
