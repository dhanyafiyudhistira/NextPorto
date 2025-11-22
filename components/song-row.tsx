"use client"

import Image from "next/image"
import { Play, Heart, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDuration } from "@/lib/utils"
import { usePlayerStore, type Song } from "@/lib/player-store"
import { cn } from "@/lib/utils"

interface SongRowProps {
  song: Song
  index?: number
  songs?: Song[]
  showAlbum?: boolean
  showAddedAt?: boolean
}

export function SongRow({
  song,
  index,
  songs = [],
  showAlbum = true,
  showAddedAt = false,
}: SongRowProps) {
  const { currentSong, isPlaying, setQueue } = usePlayerStore()
  const isCurrentSong = currentSong?.id === song.id

  const handlePlay = () => {
    if (songs.length > 0) {
      const songIndex = songs.findIndex((s) => s.id === song.id)
      setQueue(songs, songIndex)
    } else {
      setQueue([song], 0)
    }
  }

  return (
    <div
      className={cn(
        "group grid grid-cols-[16px_4fr_2fr_1fr_16px] gap-4 px-4 py-2 rounded-md hover:bg-accent/50 transition-colors",
        isCurrentSong && "bg-accent/50"
      )}
    >
      {/* Index / Play Button */}
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100"
          onClick={handlePlay}
        >
          <Play className="h-4 w-4" />
        </Button>
        <span
          className={cn(
            "text-sm text-muted-foreground group-hover:hidden",
            isCurrentSong && isPlaying && "text-primary"
          )}
        >
          {typeof index === "number" ? index + 1 : ""}
        </span>
      </div>

      {/* Title & Artist */}
      <div className="flex items-center gap-3 min-w-0">
        {song.coverUrl && (
          <div className="relative h-10 w-10 flex-shrink-0 rounded overflow-hidden">
            <Image
              src={song.coverUrl}
              alt={song.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="min-w-0">
          <p
            className={cn(
              "font-medium truncate text-sm",
              isCurrentSong && isPlaying && "text-primary"
            )}
          >
            {song.title}
          </p>
          <p className="text-sm text-muted-foreground truncate">
            {song.artist.name}
          </p>
        </div>
      </div>

      {/* Album */}
      {showAlbum && (
        <div className="flex items-center min-w-0">
          <p className="text-sm text-muted-foreground truncate">
            {song.album?.title || "-"}
          </p>
        </div>
      )}

      {/* Duration */}
      <div className="flex items-center justify-end">
        <span className="text-sm text-muted-foreground">
          {formatDuration(song.duration)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
