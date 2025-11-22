"use client"

import { Play, Shuffle, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePlayerStore, type Song } from "@/lib/player-store"

interface PlaylistActionsProps {
  songs: Song[]
}

export function PlaylistActions({ songs }: PlaylistActionsProps) {
  const { setQueue, shuffle } = usePlayerStore()

  const handlePlay = () => {
    if (songs.length > 0) {
      setQueue(songs, 0)
    }
  }

  const handleShuffle = () => {
    if (songs.length > 0) {
      // Create a shuffled copy of songs
      const shuffled = [...songs].sort(() => Math.random() - 0.5)
      setQueue(shuffled, 0)
    }
  }

  if (songs.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        size="lg"
        className="h-14 w-14 rounded-full"
        onClick={handlePlay}
      >
        <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="rounded-full"
        onClick={handleShuffle}
      >
        <Shuffle className="h-5 w-5 mr-2" />
        Shuffle
      </Button>

      <Button variant="ghost" size="icon" className="rounded-full">
        <MoreHorizontal className="h-5 w-5" />
      </Button>
    </div>
  )
}
