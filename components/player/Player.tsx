'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { usePlayerStore } from '@/store/player-store'
import { Slider } from '@/components/ui/Slider'
import styles from './Player.module.css'

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    repeat,
    shuffle,
    currentTime,
    duration,
    setAudioElement,
    play,
    pause,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    setRepeat,
    toggleShuffle,
    setCurrentTime,
    setDuration,
  } = usePlayerStore()

  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current)
    }
  }, [setAudioElement])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration)
    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0
        audio.play()
      } else {
        next()
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [repeat, next, setCurrentTime, setDuration])

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const handleProgressChange = (value: number[]) => {
    seek(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100)
  }

  const cycleRepeat = () => {
    const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one']
    const currentIndex = modes.indexOf(repeat)
    const nextIndex = (currentIndex + 1) % modes.length
    setRepeat(modes[nextIndex])
  }

  if (!currentTrack) {
    return null
  }

  return (
    <>
      <audio ref={audioRef} src={currentTrack.audioUrl} />
      <div className={styles.player}>
        <div className={styles.trackInfo}>
          {currentTrack.coverUrl ? (
            <Image
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              width={56}
              height={56}
              className={styles.cover}
            />
          ) : (
            <div className={styles.cover} />
          )}
          <div className={styles.details}>
            <h3 className={styles.title}>{currentTrack.title}</h3>
            <p className={styles.artist}>{currentTrack.artist.name}</p>
          </div>
        </div>

        <div className={styles.center}>
          <div className={styles.controls}>
            <button
              className={`${styles.controlButton} ${shuffle ? styles.active : ''}`}
              onClick={toggleShuffle}
              title="Shuffle"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
              </svg>
            </button>

            <button
              className={styles.controlButton}
              onClick={previous}
              disabled={!currentTrack}
              title="Previous"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              className={`${styles.controlButton} ${styles.playButton}`}
              onClick={handlePlayPause}
              disabled={!currentTrack}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              className={styles.controlButton}
              onClick={next}
              disabled={!currentTrack}
              title="Next"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>

            <button
              className={`${styles.controlButton} ${repeat !== 'off' ? styles.active : ''}`}
              onClick={cycleRepeat}
              title={`Repeat: ${repeat}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                {repeat === 'one' ? (
                  <>
                    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                    <text x="12" y="15" textAnchor="middle" fontSize="8" fill="currentColor">
                      1
                    </text>
                  </>
                ) : (
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                )}
              </svg>
            </button>
          </div>

          <div className={styles.progressContainer}>
            <span className={styles.time}>{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              onValueChange={handleProgressChange}
              max={duration || 100}
              step={0.1}
              className={styles.progressSlider}
            />
            <span className={styles.time}>{formatTime(duration)}</span>
          </div>
        </div>

        <div className={styles.rightControls}>
          <div className={styles.volumeControl}>
            <button
              className={styles.controlButton}
              onClick={toggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : volume < 0.5 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
              )}
            </button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className={styles.volumeSlider}
            />
          </div>
        </div>
      </div>
    </>
  )
}
