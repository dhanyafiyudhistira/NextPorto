'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { usePlayerStore } from '@/store/player-store'
import { SongWithRelations } from '@/types'
import styles from './page.module.css'

export default function HomePage() {
  const [songs, setSongs] = useState<SongWithRelations[]>([])
  const [popularSongs, setPopularSongs] = useState<SongWithRelations[]>([])
  const { setTrack, setQueue } = usePlayerStore()

  useEffect(() => {
    // Fetch recent songs
    fetch('/api/songs?limit=12')
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error('Failed to load songs:', err))

    // Fetch popular songs (you can add a different endpoint for this)
    fetch('/api/songs?limit=10')
      .then((res) => res.json())
      .then((data) => setPopularSongs(data))
      .catch((err) => console.error('Failed to load popular songs:', err))
  }, [])

  const handlePlaySong = (song: SongWithRelations, queue: SongWithRelations[]) => {
    setTrack(song, queue)
    usePlayerStore.getState().play()
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Your favorite music awaits</p>
      </div>

      {/* Recent Tracks Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Tracks</h2>
        </div>
        {songs.length > 0 ? (
          <div className={styles.grid}>
            {songs.slice(0, 6).map((song) => (
              <div
                key={song.id}
                className={styles.card}
                onClick={() => handlePlaySong(song, songs)}
              >
                {song.coverUrl ? (
                  <Image
                    src={song.coverUrl}
                    alt={song.title}
                    width={180}
                    height={180}
                    className={styles.cardCover}
                  />
                ) : (
                  <div className={styles.cardCover} />
                )}
                <h3 className={styles.cardTitle}>{song.title}</h3>
                <p className={styles.cardSubtitle}>{song.artist.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>No songs available yet</div>
        )}
      </section>

      {/* Popular Right Now Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Popular Right Now</h2>
        </div>
        {popularSongs.length > 0 ? (
          <div className={styles.tracksList}>
            {popularSongs.map((song, index) => (
              <div
                key={song.id}
                className={styles.trackItem}
                onClick={() => handlePlaySong(song, popularSongs)}
              >
                <span className={styles.trackNumber}>{index + 1}</span>
                {song.coverUrl ? (
                  <Image
                    src={song.coverUrl}
                    alt={song.title}
                    width={48}
                    height={48}
                    className={styles.trackCover}
                  />
                ) : (
                  <div className={styles.trackCover} />
                )}
                <div className={styles.trackInfo}>
                  <h4 className={styles.trackTitle}>{song.title}</h4>
                  <p className={styles.trackArtist}>{song.artist.name}</p>
                </div>
                <span className={styles.trackDuration}>
                  {formatDuration(song.duration)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>No popular songs yet</div>
        )}
      </section>
    </>
  )
}
