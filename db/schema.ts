import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod"
import { nanoid } from "nanoid"
import type { z } from "zod"

export const bots = pgTable(
  "bots",
  {
    id: text("id")
      .$defaultFn(() => nanoid())
      .primaryKey(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    avatar: text("avatar")
      .$defaultFn(() => nanoid())
      .notNull(),
    job: text("job").notNull(),
    instructions: text("instructions"),
    sandboxId: text("sandbox_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("bots_user_id_idx").on(table.userId)]
)

export const botInsertSchema = createInsertSchema(bots, {
  name: (schema) => schema.trim().min(1, "Enter a name."),
  job: (schema) => schema.trim().min(1, "Enter a job."),
  instructions: (schema) => schema.trim(),
}).omit({
  id: true,
  userId: true,
  avatar: true,
  sandboxId: true,
  createdAt: true,
})

export type BotInsert = z.infer<typeof botInsertSchema>
export type Bot = typeof bots.$inferSelect
