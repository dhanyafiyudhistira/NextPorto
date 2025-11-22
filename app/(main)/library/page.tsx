'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { PlaylistWithSongs } from '@/types'
import styles from './page.module.css'

export default function LibraryPage() {
  const [playlists, setPlaylists] = useState<PlaylistWithSongs[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPlaylists()
  }, [])

  const loadPlaylists = async () => {
    try {
      const response = await fetch('/api/playlists')
      const data = await response.json()
      setPlaylists(data)
    } catch (error) {
      console.error('Failed to load playlists:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Library</h1>
        <Button variant="primary">Create Playlist</Button>
      </div>

      {playlists.length > 0 ? (
        <div className={styles.grid}>
          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              href={`/playlist/${playlist.id}`}
              className={styles.card}
            >
              {playlist.coverUrl ? (
                <Image
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  width={200}
                  height={200}
                  className={styles.cardCover}
                />
              ) : (
                <div className={styles.cardCover}>
                  <svg
                    className={styles.cardIcon}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>
              )}
              <h3 className={styles.cardTitle}>{playlist.name}</h3>
              <p className={styles.cardSubtitle}>
                {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <svg
            className={styles.emptyIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          <h3 className={styles.emptyTitle}>No playlists yet</h3>
          <p className={styles.emptyDescription}>
            Create your first playlist to get started
          </p>
          <Button variant="primary">Create Playlist</Button>
        </div>
      )}
    </>
  )
}
