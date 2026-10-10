"use client"

import { Show, UserButton } from "@clerk/nextjs"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export function AuthControls() {
  return (
    <nav aria-label="Account" className="flex items-center gap-3">
      <Show when="signed-out">
        <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>
          Sign in
        </Link>
        <Link href="/sign-up" className={buttonVariants()}>
          Sign up
        </Link>
      </Show>
      <Show when="signed-in">
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: "ghost" })}
        >
          Dashboard
        </Link>
        <UserButton />
      </Show>
    </nav>
  )
}
