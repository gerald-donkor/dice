import { ClerkProvider } from "@clerk/nextjs"
import { shadcn } from "@clerk/ui/themes"
import Link from "next/link"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { AuthControls } from "@/components/auth-controls"
import { ThemeProvider } from "@/components/theme-provider"
import { DirectionProvider } from "@/components/ui/direction"
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ClerkProvider appearance={{ theme: shadcn }} afterSignOutUrl="/">
          <ThemeProvider>
            <DirectionProvider direction="ltr">
              <TooltipProvider>
                <Toaster>
                  <header className="border-b">
                    <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
                      <Link href="/" className="font-semibold">
                        Dice
                      </Link>
                      <AuthControls />
                    </div>
                  </header>
                  {children}
                </Toaster>
              </TooltipProvider>
            </DirectionProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
