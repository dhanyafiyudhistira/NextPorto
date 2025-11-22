"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Library, Plus, Music2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"

interface Playlist {
  id: string
  name: string
}

export function Sidebar() {
  const pathname = usePathname()
  const [playlists, setPlaylists] = useState<Playlist[]>([])

  useEffect(() => {
    fetch("/api/playlists")
      .then((res) => res.json())
      .then((data) => setPlaylists(data))
      .catch((err) => console.error("Failed to load playlists:", err))
  }, [])

  const routes = [
    {
      label: "Home",
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Search",
      icon: Search,
      href: "/search",
      active: pathname === "/search",
    },
    {
      label: "Library",
      icon: Library,
      href: "/library",
      active: pathname === "/library",
    },
  ]

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <Music2 className="h-8 w-8 text-sidebar-primary" />
          <span className="text-xl font-bold text-sidebar-foreground">
            MusicPlayer
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="px-3 py-2">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link key={route.href} href={route.href}>
              <Button
                variant={route.active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  route.active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <route.icon className="mr-2 h-5 w-5" />
                {route.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Playlists */}
      <div className="px-3 py-2 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-2 px-3">
          <h3 className="text-sm font-semibold text-sidebar-foreground">
            Playlists
          </h3>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1 pr-4">
            {playlists.map((playlist) => (
              <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    pathname === `/playlist/${playlist.id}` &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <Music2 className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{playlist.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-sidebar-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
