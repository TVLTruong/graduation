# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A graduation-ceremony invitation app (UI copy is Vietnamese). An admin manages a guest list; each guest gets a personal invite link `/invite/<shortId>` where they view event details and RSVP with an optional wish.

pnpm workspace (`pnpm-workspace.yaml`: `apps/*`, `packages/*`):
- `apps/api` — NestJS 11 + Prisma 7 (PostgreSQL on Supabase via `@prisma/adapter-pg`)
- `apps/web` — Next.js 16 (App Router) + React 19, Tailwind v4, shadcn (`base-nova` style, Base UI)
- `packages/eslint-config`, `packages/types`, `packages/ui` — empty placeholders, nothing imports them yet

`apps/api` and `apps/web` each contain their own nested `.git`, and `apps/web` has a leftover `pnpm-workspace.yaml`/`pnpm-lock.yaml` from scaffolding. Install from the repo root.

## Commands

From the repo root:
```bash
pnpm install
pnpm dev          # api (:3001) + web (:3000) in parallel
pnpm dev:api      # NestJS watch mode only
pnpm dev:web      # Next.js only
pnpm build
pnpm lint         # note: api lint runs eslint --fix
```

API (`cd apps/api`):
```bash
pnpm test                                  # Jest unit tests (*.spec.ts under src/)
pnpm test -- src/app.controller.spec.ts    # single file
pnpm test -- -t "test name"                # single test by name
pnpm test:e2e                              # test/jest-e2e.json
pnpm prisma generate                       # after editing prisma/schema.prisma
pnpm prisma db push                        # sync schema to DB (no migrations folder exists)
```

The web app has no test setup.

## Architecture

**API** (`apps/api/src`): global route prefix `/api`, CORS open, port `PORT ?? 3001`.
- `prisma/` — global `PrismaService` extends `PrismaClient` from `@prisma/client` with the `PrismaPg` driver adapter. `prisma.config.ts` loads `DATABASE_URL` via `dotenv/config`; the schema's datasource has no `url`. `DATABASE_URL` must be a plain `postgresql://` URL (Supabase session pooler). The `apps/api/generated/` dir is stale output — the generator has no `output`, so the client lives in `@prisma/client`.
- `guests/` — the only domain module, single `Guest` model. Routes are addressed by `shortId` (generated in `GuestsService`), not `id`. Admin routes (list, stats, create, bulk create, delete) use `AdminAuthGuard`; `GET /guests/:shortId`, `PATCH /guests/:shortId/rsvp` and `POST /guests/rsvp` are public. `POST /guests/rsvp` creates a "Tất cả" guest from the shared `/invite/all` link (the web form stores the returned shortId in localStorage so resubmits PATCH instead). Public RSVP input goes through `parseRsvp` in `GuestsService`, which whitelists fields and bounds lengths.
- `auth/` — no JWT/passport despite the dependencies. `POST /auth/login` compares the body against `ADMIN_PASSWORD` and echoes it back as the "token"; `AdminAuthGuard` checks the `x-admin-password` header (or `?password=` query) against `ADMIN_PASSWORD`. DTOs are plain types in `guests/guests.dto.ts` (import them with `import type` in controllers, since `isolatedModules` + `emitDecoratorMetadata` are on); there is no ValidationPipe.
- Supabase JS is installed but unused; Supabase is only the Postgres host.

**Web** (`apps/web`): all data fetching is client-side axios, from `lib/api.ts`:
- `api` — public client; `adminApi(password)` — adds the `x-admin-password` header.
- Shared front-end types (`Guest`, `GuestStats`, `GUEST_TYPES`) live in `lib/types.ts`. The eslint config enforces React Compiler rules (no `setState` directly in effects, no `Math.random` during render), so admin data refetches use a "reload key" state bumped by handlers.
- Base URL is `NEXT_PUBLIC_API_URL`, which **must include `/api`** (e.g. `http://localhost:3001/api`).
- `app/admin/` — password login stored in `localStorage` (`adminPassword`), then a dashboard with guest list (incl. Excel import via `xlsx` → `/guests/bulk`), stats, and wishes tabs.
- `app/invite/[shortId]/` — personal invitation; `app/invite/all/` — generic invitation. Both render `InviteContent`, which fixes the section order (hero → invitation → time + place as one tight group → directions/map → RSVP → contact), with generous spacing between groups. Each section wraps `InviteCard` for consistent spacing and headings. Ceremony date/time/place live in `app/invite/event.ts` (also used by the downloadable invitation image in `app/admin/components/InviteImage*.tsx`); never hardcode them in components. Buttons share one accent (`.bubbly-button`, `--grass-green-dark`) and the name wordmark uses `--title-ink`.
- Fonts: Be Vietnam Pro (`font-sans`) and Baloo 2 (`font-heading`), loaded in `app/layout.tsx` with the `vietnamese` subset.
- Per-guest-type styling: `app/invite/themes.ts` (`getInviteTheme(guest.type)`) holds each type's copy/voice, emojis and confetti colors; colors are CSS variables overridden per `[data-guest-theme="friends|family|special|everyone"]` in `app/globals.css`, set on the invite page's root div. Put new type-dependent text or colors there, not as `guest.type === ...` checks in components, and use the CSS variables instead of hex colors.

### Next.js version (from `apps/web/AGENTS.md`)
This Next.js version has breaking changes from what you may know. Read the relevant guide in `apps/web/node_modules/next/dist/docs/` before writing Next.js code, and heed deprecation notices. The `AGENTS.md` block is regenerated by `next dev`.

## Environment

- `apps/api/.env`: `DATABASE_URL`, `ADMIN_PASSWORD` (used); `JWT_SECRET`, `SUPABASE_*` (present, unused).
- `apps/web/.env`: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

A Prisma error `tenant/user postgres.<ref> not found` means the Supabase project is paused/still restoring or the pooler host is wrong — not a code bug.

## Prisma skills

`apps/api/.claude/skills/` contains Prisma's official skills (CLI, client API, v7 upgrade, driver adapters, etc.). Use them for Prisma 7 specifics.
