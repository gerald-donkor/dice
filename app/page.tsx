import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-6 py-12">
      <h1 className="text-3xl font-semibold">Welcome to Dice</h1>
      <p className="max-w-md text-muted-foreground">
        Sign in or create an account to get started.
      </p>
      <Link href="/dashboard" prefetch={false} className={buttonVariants()}>
        Open dashboard
      </Link>
      <p className="font-mono text-xs text-muted-foreground">
        Press <kbd>d</kbd> to toggle dark mode.
      </p>
    </main>
  )
}
