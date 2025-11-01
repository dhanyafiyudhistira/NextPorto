'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  Package,
  Users,
  Building2,
  ShoppingCart,
  ShoppingBag,
  LogOut,
} from 'lucide-react'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/products',
    icon: Package,
    adminOnly: true,
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: Users,
    adminOnly: true,
  },
  {
    title: 'Suppliers',
    href: '/suppliers',
    icon: Building2,
    adminOnly: true,
  },
  {
    title: 'Orders',
    href: '/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Purchases',
    href: '/purchases',
    icon: ShoppingBag,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/login' })
  }

  const filteredNavItems = navItems.filter((item) => {
    if (item.adminOnly && userRole !== 'ADMIN') {
      return false
    }
    return true
  })

  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight">ERP System</h2>
        <p className="text-sm text-muted-foreground">
          {session?.user?.name || session?.user?.email}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Role: <span className="font-medium">{userRole}</span>
        </p>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </div>
            </Link>
          )
        })}
      </nav>
      <Separator />
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
