'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { usePlayerStore } from '@/store/player-store'
import { SongWithRelations } from '@/types'
import styles from './page.module.css'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SongWithRelations[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { setTrack } = usePlayerStore()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        searchSongs(query)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const searchSongs = async (searchQuery: string) => {
    setIsSearching(true)
    try {
      const response = await fetch(`/api/songs?search=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handlePlaySong = (song: SongWithRelations) => {
    setTrack(song, results)
    usePlayerStore.getState().play()
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={styles.search}>
      <div className={styles.searchBox}>
        <svg
          className={styles.searchIcon}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8" strokeWidth="2" />
          <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="What do you want to listen to?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {query.trim() && (
        <div className={styles.results}>
          {isSearching ? (
            <div className={styles.empty}>Searching...</div>
          ) : results.length > 0 ? (
            <>
              <h2 className={styles.resultsTitle}>
                Found {results.length} {results.length === 1 ? 'song' : 'songs'}
              </h2>
              <div className={styles.tracksList}>
                {results.map((song) => (
                  <div
                    key={song.id}
                    className={styles.trackItem}
                    onClick={() => handlePlaySong(song)}
                  >
                    {song.coverUrl ? (
                      <Image
                        src={song.coverUrl}
                        alt={song.title}
                        width={56}
                        height={56}
                        className={styles.trackCover}
                      />
                    ) : (
                      <div className={styles.trackCover} />
                    )}
                    <div className={styles.trackInfo}>
                      <h3 className={styles.trackTitle}>{song.title}</h3>
                      <p className={styles.trackArtist}>
                        {song.artist.name}
                        {song.album && ` • ${song.album.title}`}
                      </p>
                    </div>
                    <span className={styles.trackDuration}>
                      {formatDuration(song.duration)}
                    </span>
                  </div>
                ))}
              </div>
            </>
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className={styles.emptyTitle}>No results found</h3>
              <p className={styles.emptyDescription}>
                Try searching for something else
              </p>
            </div>
          )}
        </div>
      )}

      {!query.trim() && (
        <div className={styles.empty}>
          <svg
            className={styles.emptyIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="1.5" />
            <path d="m21 21-4.35-4.35" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <h3 className={styles.emptyTitle}>Search for music</h3>
          <p className={styles.emptyDescription}>
            Find your favorite songs, artists, and albums
          </p>
        </div>
      )}
    </div>
  )
}
