import { prisma } from "@/lib/prisma"
import { AlbumCard } from "@/components/album-card"
import { ScrollArea } from "@/components/ui/scroll-area"

export const dynamic = "force-dynamic"

async function getHomeData() {
  const [playlists, albums] = await Promise.all([
    prisma.playlist.findMany({
      where: { isPublic: true },
      include: {
        _count: { select: { songs: true } },
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.album.findMany({
      include: {
        artist: true,
        _count: { select: { songs: true } },
      },
      take: 6,
      orderBy: { releaseDate: "desc" },
    }),
  ])

  return { playlists, albums }
}

export default async function HomePage() {
  const { playlists, albums } = await getHomeData()

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground">
            Discover your favorite music and playlists
          </p>
        </div>

        {/* Featured Playlists */}
        {playlists.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Featured Playlists</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
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
          </section>
        )}

        {/* Recent Albums */}
        {albums.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Recent Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {albums.map((album) => (
                <AlbumCard
                  key={album.id}
                  id={album.id}
                  title={album.title}
                  subtitle={album.artist.name}
                  coverUrl={album.coverUrl}
                  href={`/album/${album.id}`}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </ScrollArea>
  )
}
