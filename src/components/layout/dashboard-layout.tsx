'use client'

import { SessionProvider } from 'next-auth/react'
import { Sidebar } from './sidebar'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex h-screen overflow-hidden">
        <aside className="hidden w-64 md:block">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </SessionProvider>
  )
}
