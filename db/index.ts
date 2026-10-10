import "server-only"

import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import * as schema from "@/db/schema"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is required. Add your Neon connection string to .env.local."
  )
}

const globalForDb = globalThis as typeof globalThis & {
  postgresPool?: Pool
}

const pool = globalForDb.postgresPool ?? new Pool({ connectionString })

// Reuse the pool when Next.js reloads modules during development.
if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresPool = pool
}

export const db = drizzle({ client: pool, schema })
