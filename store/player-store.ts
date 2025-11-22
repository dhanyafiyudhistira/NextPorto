import { create } from 'zustand'
import { SongWithRelations, RepeatMode } from '@/types'

interface PlayerStore {
  // State
  currentTrack: SongWithRelations | null
  queue: SongWithRelations[]
  originalQueue: SongWithRelations[]
  currentIndex: number
  isPlaying: boolean
  volume: number
  isMuted: boolean
  repeat: RepeatMode
  shuffle: boolean
  currentTime: number
  duration: number
  audioElement: HTMLAudioElement | null

  // Actions
  setAudioElement: (element: HTMLAudioElement) => void
  setTrack: (track: SongWithRelations, queue?: SongWithRelations[]) => void
  play: () => void
  pause: () => void
  togglePlay: () => void
  next: () => void
  previous: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  setRepeat: (mode: RepeatMode) => void
  toggleShuffle: () => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setQueue: (queue: SongWithRelations[], startIndex?: number) => void
  addToQueue: (track: SongWithRelations) => void
  removeFromQueue: (index: number) => void
  clearQueue: () => void
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Initial State
  currentTrack: null,
  queue: [],
  originalQueue: [],
  currentIndex: 0,
  isPlaying: false,
  volume: 0.7,
  isMuted: false,
  repeat: 'off',
  shuffle: false,
  currentTime: 0,
  duration: 0,
  audioElement: null,

  // Actions
  setAudioElement: (element) => set({ audioElement: element }),

  setTrack: (track, queue) => {
    const state = get()

    if (queue) {
      const index = queue.findIndex((t) => t.id === track.id)
      set({
        currentTrack: track,
        queue,
        originalQueue: queue,
        currentIndex: index >= 0 ? index : 0,
        currentTime: 0,
      })
    } else {
      set({
        currentTrack: track,
        currentTime: 0,
      })
    }

    if (state.audioElement) {
      state.audioElement.src = track.audioUrl
      state.audioElement.load()
    }
  },

  play: () => {
    const { audioElement } = get()
    if (audioElement) {
      audioElement.play()
      set({ isPlaying: true })
    }
  },

  pause: () => {
    const { audioElement } = get()
    if (audioElement) {
      audioElement.pause()
      set({ isPlaying: false })
    }
  },

  togglePlay: () => {
    const { isPlaying, play, pause } = get()
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  },

  next: () => {
    const { queue, currentIndex, repeat, setTrack } = get()

    if (queue.length === 0) return

    let nextIndex = currentIndex + 1

    if (nextIndex >= queue.length) {
      if (repeat === 'all') {
        nextIndex = 0
      } else {
        set({ isPlaying: false })
        return
      }
    }

    const nextTrack = queue[nextIndex]
    if (nextTrack) {
      set({ currentIndex: nextIndex })
      setTrack(nextTrack)
      get().play()
    }
  },

  previous: () => {
    const { queue, currentIndex, currentTime, setTrack, seek } = get()

    if (currentTime > 3) {
      seek(0)
      return
    }

    if (queue.length === 0) return

    let prevIndex = currentIndex - 1

    if (prevIndex < 0) {
      prevIndex = queue.length - 1
    }

    const prevTrack = queue[prevIndex]
    if (prevTrack) {
      set({ currentIndex: prevIndex })
      setTrack(prevTrack)
      get().play()
    }
  },

  seek: (time) => {
    const { audioElement } = get()
    if (audioElement) {
      audioElement.currentTime = time
      set({ currentTime: time })
    }
  },

  setVolume: (volume) => {
    const { audioElement } = get()
    if (audioElement) {
      audioElement.volume = volume
      set({ volume, isMuted: volume === 0 })
    }
  },

  toggleMute: () => {
    const { isMuted, volume, audioElement } = get()
    const newMutedState = !isMuted

    if (audioElement) {
      if (newMutedState) {
        audioElement.volume = 0
      } else {
        audioElement.volume = volume
      }
    }

    set({ isMuted: newMutedState })
  },

  setRepeat: (mode) => set({ repeat: mode }),

  toggleShuffle: () => {
    const { shuffle, queue, originalQueue, currentTrack } = get()
    const newShuffle = !shuffle

    if (newShuffle) {
      // Shuffle the queue
      const shuffled = [...originalQueue]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }

      // Ensure current track is first
      if (currentTrack) {
        const currentIndex = shuffled.findIndex((t) => t.id === currentTrack.id)
        if (currentIndex > 0) {
          ;[shuffled[0], shuffled[currentIndex]] = [shuffled[currentIndex], shuffled[0]]
        }
      }

      set({ shuffle: true, queue: shuffled, currentIndex: 0 })
    } else {
      // Restore original queue
      const currentIndex = originalQueue.findIndex((t) => t.id === currentTrack?.id)
      set({
        shuffle: false,
        queue: originalQueue,
        currentIndex: currentIndex >= 0 ? currentIndex : 0
      })
    }
  },

  setCurrentTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration }),

  setQueue: (queue, startIndex = 0) => {
    set({
      queue,
      originalQueue: queue,
      currentIndex: startIndex,
    })

    if (queue[startIndex]) {
      get().setTrack(queue[startIndex])
    }
  },

  addToQueue: (track) => {
    const { queue, originalQueue } = get()
    set({
      queue: [...queue, track],
      originalQueue: [...originalQueue, track],
    })
  },

  removeFromQueue: (index) => {
    const { queue, originalQueue, currentIndex } = get()
    const newQueue = queue.filter((_, i) => i !== index)
    const newOriginalQueue = originalQueue.filter((_, i) => i !== index)

    let newCurrentIndex = currentIndex
    if (index < currentIndex) {
      newCurrentIndex = currentIndex - 1
    } else if (index === currentIndex && newQueue.length > 0) {
      if (newCurrentIndex >= newQueue.length) {
        newCurrentIndex = newQueue.length - 1
      }
      get().setTrack(newQueue[newCurrentIndex])
    }

    set({
      queue: newQueue,
      originalQueue: newOriginalQueue,
      currentIndex: newCurrentIndex,
    })
  },

  clearQueue: () => {
    set({
      queue: [],
      originalQueue: [],
      currentIndex: 0,
      currentTrack: null,
      isPlaying: false,
    })
  },
}))
