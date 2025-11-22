import { prisma } from "@/lib/prisma"
import { AlbumCard } from "@/components/album-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Plus, Heart } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getLibraryData() {
  // Get demo user
  const user = await prisma.user.findFirst()

  if (!user) {
    return { playlists: [], likedSongsCount: 0 }
  }

  const [playlists, likedSongsCount] = await Promise.all([
    prisma.playlist.findMany({
      where: { userId: user.id },
      include: {
        _count: { select: { songs: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.likedSong.count({
      where: { userId: user.id },
    }),
  ])

  return { playlists, likedSongsCount }
}

export default async function LibraryPage() {
  const { playlists, likedSongsCount } = await getLibraryData()

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Your Library</h1>
          <p className="text-muted-foreground">
            Manage your playlists and liked songs
          </p>
        </div>

        {/* Liked Songs Card */}
        {likedSongsCount > 0 && (
          <section>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              <Link href="/library/liked-songs">
                <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/80 to-primary/40 p-6 cursor-pointer hover:from-primary/90 hover:to-primary/50 transition-all">
                  <Heart className="h-12 w-12 text-white mb-4" fill="white" />
                  <h3 className="font-semibold text-white text-lg mb-1">
                    Liked Songs
                  </h3>
                  <p className="text-sm text-white/90">
                    {likedSongsCount} songs
                  </p>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Playlists */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Playlists</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Playlist
            </Button>
          </div>

          {playlists.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-4">You don't have any playlists yet</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create your first playlist
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {playlists.map((playlist) => (
                <AlbumCard
                  key={playlist.id}
                  id={playlist.id}
                  title={playlist.name}
                  subtitle={`${playlist._count.songs} songs`}
                  coverUrl={playlist.coverUrl}
                  href={`/playlist/${playlist.id}`}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </ScrollArea>
  )
}
