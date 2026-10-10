import { loadEnvConfig } from "@next/env"
import { defineConfig } from "drizzle-kit"

loadEnvConfig(process.cwd())

const url = process.env.DATABASE_URL_UNPOOLED

if (!url) {
  throw new Error(
    "DATABASE_URL_UNPOOLED is required for Drizzle Kit. Add your direct Neon connection string to .env.local."
  )
}

export default defineConfig({
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url },
})
