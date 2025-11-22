import { Song, Artist, Album, Playlist, PlaylistSong } from '@prisma/client'

export type SongWithRelations = Song & {
  artist: Artist
  album: Album | null
}

export type PlaylistWithSongs = Playlist & {
  songs: (PlaylistSong & {
    song: SongWithRelations
  })[]
  user: {
    name: string | null
    email: string
  }
}

export type PlayerState = {
  currentTrack: SongWithRelations | null
  queue: SongWithRelations[]
  currentIndex: number
  isPlaying: boolean
  volume: number
  isMuted: boolean
  repeat: 'off' | 'all' | 'one'
  shuffle: boolean
  currentTime: number
  duration: number
}

export type RepeatMode = 'off' | 'all' | 'one'
