import { create } from 'zustand'

export interface Song {
  id: string
  title: string
  duration: number
  audioUrl: string
  coverUrl: string | null
  artist: {
    id: string
    name: string
  }
  album?: {
    id: string
    title: string
  } | null
}

interface PlayerStore {
  // Current playback state
  currentSong: Song | null
  queue: Song[]
  currentIndex: number
  isPlaying: boolean
  volume: number
  isMuted: boolean
  shuffle: boolean
  repeat: 'off' | 'all' | 'one'
  currentTime: number
  duration: number

  // Actions
  setCurrentSong: (song: Song | null) => void
  setQueue: (songs: Song[], startIndex?: number) => void
  addToQueue: (song: Song) => void
  removeFromQueue: (index: number) => void
  playPause: () => void
  play: () => void
  pause: () => void
  next: () => void
  previous: () => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  playFromQueue: (index: number) => void
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Initial state
  currentSong: null,
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  volume: 0.7,
  isMuted: false,
  shuffle: false,
  repeat: 'off',
  currentTime: 0,
  duration: 0,

  // Actions
  setCurrentSong: (song) => set({ currentSong: song }),

  setQueue: (songs, startIndex = 0) =>
    set({
      queue: songs,
      currentIndex: startIndex,
      currentSong: songs[startIndex] || null,
    }),

  addToQueue: (song) =>
    set((state) => ({
      queue: [...state.queue, song],
    })),

  removeFromQueue: (index) =>
    set((state) => {
      const newQueue = state.queue.filter((_, i) => i !== index)
      const newIndex = state.currentIndex > index ? state.currentIndex - 1 : state.currentIndex
      return {
        queue: newQueue,
        currentIndex: newIndex,
        currentSong: newQueue[newIndex] || null,
      }
    }),

  playPause: () =>
    set((state) => ({
      isPlaying: !state.isPlaying,
    })),

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  next: () => {
    const state = get()
    if (state.queue.length === 0) return

    let nextIndex: number

    if (state.repeat === 'one') {
      // Stay on current song
      set({ currentTime: 0 })
      return
    }

    if (state.shuffle) {
      // Random song
      nextIndex = Math.floor(Math.random() * state.queue.length)
    } else {
      // Next in queue
      nextIndex = state.currentIndex + 1
      if (nextIndex >= state.queue.length) {
        if (state.repeat === 'all') {
          nextIndex = 0
        } else {
          set({ isPlaying: false })
          return
        }
      }
    }

    set({
      currentIndex: nextIndex,
      currentSong: state.queue[nextIndex],
      currentTime: 0,
    })
  },

  previous: () => {
    const state = get()
    if (state.queue.length === 0) return

    // If more than 3 seconds played, restart current song
    if (state.currentTime > 3) {
      set({ currentTime: 0 })
      return
    }

    let prevIndex = state.currentIndex - 1
    if (prevIndex < 0) {
      if (state.repeat === 'all') {
        prevIndex = state.queue.length - 1
      } else {
        prevIndex = 0
      }
    }

    set({
      currentIndex: prevIndex,
      currentSong: state.queue[prevIndex],
      currentTime: 0,
    })
  },

  setVolume: (volume) => {
    set({ volume, isMuted: volume === 0 })
  },

  toggleMute: () =>
    set((state) => ({
      isMuted: !state.isMuted,
    })),

  toggleShuffle: () =>
    set((state) => ({
      shuffle: !state.shuffle,
    })),

  toggleRepeat: () =>
    set((state) => {
      const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one']
      const currentModeIndex = modes.indexOf(state.repeat)
      const nextMode = modes[(currentModeIndex + 1) % modes.length]
      return { repeat: nextMode }
    }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration }),

  playFromQueue: (index) => {
    const state = get()
    if (index >= 0 && index < state.queue.length) {
      set({
        currentIndex: index,
        currentSong: state.queue[index],
        currentTime: 0,
        isPlaying: true,
      })
    }
  },
}))
