'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { usePlayerStore } from '@/store/player-store'
import { PlaylistWithSongs } from '@/types'
import styles from './page.module.css'

export default function PlaylistPage() {
  const params = useParams()
  const [playlist, setPlaylist] = useState<PlaylistWithSongs | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { setQueue } = usePlayerStore()

  useEffect(() => {
    if (params.id) {
      loadPlaylist(params.id as string)
    }
  }, [params.id])

  const loadPlaylist = async (id: string) => {
    try {
      const response = await fetch(`/api/playlists/${id}`)
      const data = await response.json()
      setPlaylist(data)
    } catch (error) {
      console.error('Failed to load playlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayAll = () => {
    if (!playlist || playlist.songs.length === 0) return

    const songs = playlist.songs.map((ps) => ps.song)
    setQueue(songs, 0)
    usePlayerStore.getState().play()
  }

  const handlePlaySong = (index: number) => {
    if (!playlist) return

    const songs = playlist.songs.map((ps) => ps.song)
    setQueue(songs, index)
    usePlayerStore.getState().play()
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTotalDuration = () => {
    if (!playlist) return 0
    return playlist.songs.reduce((total, ps) => total + ps.song.duration, 0)
  }

  const formatTotalDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)

    if (hours > 0) {
      return `${hours} hr ${minutes} min`
    }
    return `${minutes} min`
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!playlist) {
    return <div>Playlist not found</div>
  }

  const totalDuration = getTotalDuration()

  return (
    <>
      <div className={styles.header}>
        {playlist.coverUrl ? (
          <Image
            src={playlist.coverUrl}
            alt={playlist.name}
            width={200}
            height={200}
            className={styles.cover}
          />
        ) : (
          <div className={styles.cover}>
            <svg
              className={styles.coverIcon}
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
        <div className={styles.info}>
          <p className={styles.type}>Playlist</p>
          <h1 className={styles.title}>{playlist.name}</h1>
          {playlist.description && <p>{playlist.description}</p>}
          <div className={styles.meta}>
            <span>{playlist.user.name || playlist.user.email}</span>
            <span className={styles.metaDot} />
            <span>
              {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
            </span>
            {totalDuration > 0 && (
              <>
                <span className={styles.metaDot} />
                <span>{formatTotalDuration(totalDuration)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.playButton}
          onClick={handlePlayAll}
          disabled={playlist.songs.length === 0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      {playlist.songs.length > 0 ? (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>#</div>
            <div>Title</div>
            <div>Album</div>
            <div>Duration</div>
          </div>
          {playlist.songs.map((playlistSong, index) => {
            const song = playlistSong.song
            return (
              <div
                key={playlistSong.id}
                className={styles.tableRow}
                onClick={() => handlePlaySong(index)}
              >
                <div className={styles.trackNumber}>{index + 1}</div>
                <div className={styles.trackDetails}>
                  {song.coverUrl ? (
                    <Image
                      src={song.coverUrl}
                      alt={song.title}
                      width={40}
                      height={40}
                      className={styles.trackCover}
                    />
                  ) : (
                    <div className={styles.trackCover} />
                  )}
                  <div className={styles.trackInfo}>
                    <h4 className={styles.trackTitle}>{song.title}</h4>
                    <p className={styles.trackArtist}>{song.artist.name}</p>
                  </div>
                </div>
                <div className={styles.trackAlbum}>
                  {song.album?.title || '-'}
                </div>
                <div className={styles.trackDuration}>
                  {formatDuration(song.duration)}
                </div>
              </div>
            )
          })}
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
          <h3 className={styles.emptyTitle}>This playlist is empty</h3>
        </div>
      )}
    </>
  )
}
