import { auth } from "@clerk/nextjs/server"
import { PlusIcon } from "lucide-react"
import { randomInt, randomUUID } from "node:crypto"
import { connection } from "next/server"

import { ChatAvatar, type ChatAvatarStyle } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

const avatarStyles = [
  "combined",
  "gaze",
  "marbles",
  "clay",
] as const satisfies readonly ChatAvatarStyle[]

export default async function Page() {
  await auth.protect()
  await connection()

  const avatarSeed = randomUUID()
  const avatarStyle = avatarStyles[randomInt(avatarStyles.length)]

  return (
    <main className="mx-auto flex min-h-[calc(100svh-4.0625rem)] w-full max-w-5xl items-center justify-center px-6 pb-16">
      <Empty className="max-w-md">
        <EmptyHeader>
          <ChatAvatar
            seed={avatarSeed}
            style={avatarStyle}
            animated
            className="mb-2"
          />
          <EmptyTitle role="heading" aria-level={1}>
            Meet your first bot
          </EmptyTitle>
          <EmptyDescription>
            Every bot gets its own personality, memory, and face. Spin one up
            and start the conversation.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button type="button" variant="secondary">
            <PlusIcon data-icon="inline-start" />
            Create a new bot
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  )
}
