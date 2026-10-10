import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod"
import type { z } from "zod"

export const todos = pgTable(
  "todos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    completed: boolean("completed").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("todos_user_id_idx").on(table.userId)]
)

export const todoInsertSchema = createInsertSchema(todos, {
  title: (schema) =>
    schema
      .trim()
      .min(1, "Enter a title.")
      .max(500, "Title must be 500 characters or fewer."),
}).omit({ id: true, userId: true, createdAt: true, updatedAt: true })

export type TodoInsert = z.infer<typeof todoInsertSchema>
export type Todo = typeof todos.$inferSelect
