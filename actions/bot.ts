"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

import { db } from "@/db"
import { botInsertSchema, bots, type BotInsert } from "@/db/schema"

export async function createBot(input: BotInsert) {
  const { isAuthenticated, userId } = await auth()
  if (!isAuthenticated) {
    throw new Error("Sign in to create a bot.")
  }

  const values = botInsertSchema.parse(input)
  const [bot] = await db
    .insert(bots)
    .values({
      ...values,
      userId,
      instructions: values.instructions || null,
    })
    .returning()

  revalidatePath("/")
  return bot
}
