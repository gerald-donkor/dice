import { auth, currentUser } from "@clerk/nextjs/server"

export default async function DashboardPage() {
  await auth.protect()
  const user = await currentUser()

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-12">
      <h1 className="text-2xl font-semibold">
        Welcome{user?.firstName ? `, ${user.firstName}` : ""}!
      </h1>
      <p className="text-muted-foreground">
        You&apos;re signed in to Dice. Manage your account or sign out using the
        profile menu.
      </p>
    </main>
  )
}
