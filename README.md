# Dice

Next.js App Router app with Clerk authentication, shadcn/ui, and Drizzle ORM with Neon Postgres.

## Development

```bash
npm install
npm run dev
```

Clerk's setup CLI writes development keys to `.env.local`. If setting up another
checkout, copy `.env.example` to `.env.local` and add your Clerk API keys from the
[Clerk Dashboard](https://dashboard.clerk.com/~/api-keys). Never commit secret keys.

## Authentication

- `/` is public and provides sign-in and sign-up links.
- `/sign-in` and `/sign-up` use Clerk's prebuilt authentication components.
- `/dashboard` requires authentication with `await auth.protect()` on the server.
- The account menu provides profile management and sign-out.

`proxy.ts` initializes Clerk sessions. Protect each new private page, Route Handler,
and Server Action where it executes; hiding content in the UI or checking only a
layout does not secure a resource.

Sign-in and sign-up fall back to `/dashboard` unless a return URL was supplied.
The route settings and required keys are listed in `.env.example`.

```bash
npx -y clerk@latest doctor
npm run typecheck
npm run lint
npm run build
```

## Database

Neon connection strings are stored in `.env.local`: `DATABASE_URL` is the pooled
URL for application queries, and `DATABASE_URL_UNPOOLED` is the direct URL for
Drizzle Kit. Both are listed in `.env.example`. Drizzle Kit loads the same env files
as Next.js using `@next/env`.

Import `db` from `@/db` in Server Components, Route Handlers, or Server Actions.
The module is server-only and uses a Postgres pool reused during development hot
reloads. It requires the Node.js runtime.

Define application tables in `db/schema.ts`, then apply schema changes with:

```bash
npm run db:push
```

The `todos` table stores a title, completion status, Clerk user ID, and timestamps.
Its shared insert validator trims titles and requires 1–500 characters. Supply the
owner from the authenticated session when inserting; ownership is not accepted by
the input validator. `updatedAt` updates automatically for Drizzle updates.
This development project uses a clean slate for schema changes and does not use migration files or backfills.
Use `npm run db:studio` to browse the database locally.

When configuring another deployment, set both database URLs on Railway's `dice`
service in the `production` environment as well.

## Production

The setup is linked to the Clerk application `dice`. Development keys and route
variables are configured locally and on the Railway `dice` service in the
`production` environment. No deployment was triggered by this setup.

Before a public release, configure Clerk's production instance and domain with
`npx -y clerk@latest deploy`, then replace the development API keys in Railway with
production keys. Clerk development keys are not intended for a production release.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
