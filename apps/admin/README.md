# Needlon Admin (`@needlon/admin`)

The platform administration console for Needlon — a standalone Next.js app,
sibling to `apps/client` (storefront) and `apps/seller` (seller dashboard).
Platform operators use it to manage everything sellers do not control:

- **Overview** — real platform counts (sellers, stores, buyers, products,
  orders, executives/shipments by status, open support tickets)
- **Delivery Executives** — the platform delivery roster (create, edit,
  suspend, deactivate)
- **Delivery Partners** — carrier catalogue + shipping-method rate cards
- **Categories** — storefront product-category hierarchy
- **Sellers** — verification and suspension (suspension is enforced at login
  across the platform)
- **Support Inbox** — staff side of seller support tickets (agent replies
  are visible to sellers in their own support centre)
- **Knowledge Base** — help-centre article authoring with a publish flag
- **Hero Banners** — storefront hero-banner management
- **Platform Settings** — including the platform commission rate, which the
  seller dashboard and earnings read from this one setting

All business logic lives in `packages/modules` (admin module + platform
settings); this app is the admin front door: pages, its own login, and the
`/api/admin/*` routes. Pages live under `app/(console)/` (a route group, so
URLs are unprefixed: `/`, `/executives`, `/sellers`, …).

## Running

```bash
pnpm install            # from the repo root
pnpm --filter @needlon/admin dev   # http://localhost:3002
```

Copy `.env.example` to `.env.local` and fill it in. The admin app shares
the platform database and session secrets with the seller app
(`DATABASE_URL`, `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` must match).

## Auth — how admins are provisioned

There is no admin signup, by design. An admin is a normal seller account
whose `role` is `admin`. Promote an existing (email-verified) seller from
the repo root:

```bash
cd packages/db
DATABASE_URL=<your-database-url> ./node_modules/.bin/tsx scripts/promote-admin.ts you@example.com
```

Then sign in at http://localhost:3002/login with that account. The login
route rejects non-admin sellers with `403 Admin access required` and
creates no session for them; suspended admins get the platform's
`ACCOUNT_SUSPENDED` rejection. Sessions are the platform's standard
seller sessions (same cookies/helpers), every `/api/admin/*` handler
re-checks the admin role server-side, and the route guard (`proxy.ts`)
bounces unauthenticated page requests to `/login`.
