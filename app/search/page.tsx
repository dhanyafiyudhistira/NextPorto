"use client"

import { useState, useEffect } from "react"
import { Search as SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SongRow } from "@/components/song-row"
import { AlbumCard } from "@/components/album-card"
import type { Song } from "@/lib/player-store"

interface SongWithRelations extends Song {
  album?: { id: string; title: string } | null
}

interface Album {
  id: string
  title: string
  coverUrl: string | null
  artist: {
    id: string
    name: string
  }
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [songs, setSongs] = useState<SongWithRelations[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSongs([])
      setAlbums([])
      return
    }

    const delayDebounceFn = setTimeout(() => {
      performSearch(searchQuery)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const performSearch = async (query: string) => {
    setLoading(true)
    try {
      const [songsRes, albumsRes] = await Promise.all([
        fetch(`/api/songs?search=${encodeURIComponent(query)}&limit=20`),
        fetch(`/api/albums?limit=10`),
      ])

      const [songsData, albumsData] = await Promise.all([
        songsRes.json(),
        albumsRes.json(),
      ])

      setSongs(songsData)

      // Filter albums client-side for simplicity
      const filteredAlbums = albumsData.filter((album: Album) =>
        album.title.toLowerCase().includes(query.toLowerCase()) ||
        album.artist.name.toLowerCase().includes(query.toLowerCase())
      )
      setAlbums(filteredAlbums)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Search Header */}
        <div>
          <h1 className="text-4xl font-bold mb-6">Search</h1>

          {/* Search Input */}
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="What do you want to listen to?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results */}
        {searchQuery && (
          <>
            {loading && (
              <div className="text-center text-muted-foreground">
                Searching...
              </div>
            )}

            {!loading && songs.length === 0 && albums.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                No results found for "{searchQuery}"
              </div>
            )}

            {/* Albums */}
            {albums.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Albums</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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

            {/* Songs */}
            {songs.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Songs</h2>
                <div className="space-y-1">
                  {songs.map((song, index) => (
                    <SongRow
                      key={song.id}
                      song={song}
                      index={index}
                      songs={songs}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </ScrollArea>
  )
}
