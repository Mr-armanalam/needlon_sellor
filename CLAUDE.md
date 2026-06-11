@AGENTS.md
# Project Overview
This is a Next.js app with Drizzle ORM and Supabase.

## Tech Stack
- Next.js 16 (App Router)
- Drizzle ORM
- Supabase (PostgreSQL + Storage)
- Docker

## Database
- Never use raw SQL, always use Drizzle
- Run migrations with: npm run db:migrate

## Code Style
- Use TypeScript strictly
- Prefer async/await over .then()
- Components go in /modules

## Commands
- `npm run dev` → start dev server
- `docker compose up` → run with Docker