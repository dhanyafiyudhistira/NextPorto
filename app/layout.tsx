import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Player } from "@/components/player"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Music Player - Your Spotify Clone",
  description: "A modern music player built with Next.js, PostgreSQL, and shadcn/ui",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 hidden md:block">
              <Sidebar />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-24">
              {children}
            </main>
          </div>

          {/* Player */}
          <Player />
        </ThemeProvider>
      </body>
    </html>
  )
}
