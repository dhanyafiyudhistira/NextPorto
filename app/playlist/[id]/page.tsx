import { notFound } from "next/navigation"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Play, Clock, MoreHorizontal } from "lucide-react"
import { SongRow } from "@/components/song-row"
import { PlaylistActions } from "@/components/playlist-actions"
import { formatDurationDetailed } from "@/lib/utils"
import type { Song } from "@/lib/player-store"

export const dynamic = "force-dynamic"

async function getPlaylist(id: string) {
  const playlist = await prisma.playlist.findUnique({
    where: { id },
    include: {
      songs: {
        include: {
          song: {
            include: {
              artist: true,
              album: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!playlist) {
    return null
  }

  // Transform the response
  const songs: Song[] = playlist.songs.map((ps) => ({
    id: ps.song.id,
    title: ps.song.title,
    duration: ps.song.duration,
    audioUrl: ps.song.audioUrl,
    coverUrl: ps.song.coverUrl,
    artist: {
      id: ps.song.artist.id,
      name: ps.song.artist.name,
    },
    album: ps.song.album
      ? {
          id: ps.song.album.id,
          title: ps.song.album.title,
        }
      : null,
  }))

  const totalDuration = songs.reduce((acc, song) => acc + song.duration, 0)

  return {
    ...playlist,
    songs,
    totalDuration,
  }
}

export default async function PlaylistPage({
  params,
}: {
  params: { id: string }
}) {
  const playlist = await getPlaylist(params.id)

  if (!playlist) {
    notFound()
  }

  return (
    <ScrollArea className="h-full">
      <div className="relative">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-primary/20 to-background p-8">
          <div className="flex gap-6 items-end max-w-7xl mx-auto">
            {/* Playlist Cover */}
            <div className="relative h-48 w-48 rounded-lg shadow-2xl overflow-hidden bg-gradient-to-br from-primary/40 to-primary/20 flex-shrink-0">
              {playlist.coverUrl ? (
                <Image
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl font-bold text-white/50">
                    {playlist.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Playlist Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold uppercase mb-2">Playlist</p>
              <h1 className="text-5xl font-bold mb-6 truncate">
                {playlist.name}
              </h1>
              {playlist.description && (
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {playlist.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">
                  {playlist.user.name || "Unknown"}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {playlist.songs.length} songs
                </span>
                {playlist.totalDuration > 0 && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {formatDurationDetailed(playlist.totalDuration)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 py-6 bg-gradient-to-b from-background/50 to-background">
          <PlaylistActions songs={playlist.songs} />
        </div>

        {/* Songs List */}
        <div className="px-8 pb-8">
          {playlist.songs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-4">This playlist is empty</p>
              <Button variant="outline">Find songs to add</Button>
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div className="grid grid-cols-[16px_4fr_2fr_1fr_16px] gap-4 px-4 pb-2 mb-2 border-b text-sm text-muted-foreground">
                <div className="flex items-center justify-center">#</div>
                <div>Title</div>
                <div>Album</div>
                <div className="flex justify-end">
                  <Clock className="h-4 w-4" />
                </div>
                <div></div>
              </div>

              {/* Songs */}
              <div className="space-y-1">
                {playlist.songs.map((song, index) => (
                  <SongRow
                    key={song.id}
                    song={song}
                    index={index}
                    songs={playlist.songs}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  )
}
