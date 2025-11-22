'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { Switch } from '@/components/ui/Switch'
import { useTheme } from '@/lib/theme-provider'
import styles from './Sidebar.module.css'

interface Playlist {
  id: string
  name: string
}

export function Sidebar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [playlists, setPlaylists] = useState<Playlist[]>([])

  useEffect(() => {
    // Fetch user playlists
    fetch('/api/playlists')
      .then((res) => res.json())
      .then((data) => setPlaylists(data))
      .catch((err) => console.error('Failed to load playlists:', err))
  }, [])

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: (
        <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: 'Search',
      href: '/search',
      icon: (
        <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      name: 'Library',
      href: '/library',
      icon: (
        <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
  ]

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
          <span>Music Player</span>
        </Link>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.playlists}>
        <div className={styles.playlistsHeader}>
          <h2 className={styles.playlistsTitle}>Playlists</h2>
          <button className={styles.createButton} title="Create playlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        <ScrollArea className={styles.playlistsList}>
          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              href={`/playlist/${playlist.id}`}
              className={`${styles.playlistItem} ${
                pathname === `/playlist/${playlist.id}` ? styles.active : ''
              }`}
            >
              <svg
                className={styles.playlistIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              <span className={styles.playlistName}>{playlist.name}</span>
            </Link>
          ))}
          {playlists.length === 0 && (
            <div
              style={{
                padding: '16px',
                textAlign: 'center',
                color: 'var(--muted-foreground)',
                fontSize: '14px',
              }}
            >
              No playlists yet
            </div>
          )}
        </ScrollArea>
      </div>

      <div className={styles.footer}>
        <div className={styles.themeToggle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            {theme === 'dark' ? (
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            ) : (
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
            )}
          </svg>
          <span>Dark mode</span>
        </div>
        <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
      </div>
    </div>
  )
}
