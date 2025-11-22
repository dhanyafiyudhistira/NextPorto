import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/playlists/[id] - Get a single playlist with songs
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: params.id },
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
            email: true,
          },
        },
      },
    })

    if (!playlist) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      )
    }

    // Transform the response to flatten the song structure
    const transformedPlaylist = {
      ...playlist,
      songs: playlist.songs.map((ps) => ps.song),
    }

    return NextResponse.json(transformedPlaylist)
  } catch (error) {
    console.error("Error fetching playlist:", error)
    return NextResponse.json(
      { error: "Failed to fetch playlist" },
      { status: 500 }
    )
  }
}

// PATCH /api/playlists/[id] - Update a playlist
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, coverUrl, isPublic } = body

    const playlist = await prisma.playlist.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(coverUrl !== undefined && { coverUrl }),
        ...(isPublic !== undefined && { isPublic }),
      },
    })

    return NextResponse.json(playlist)
  } catch (error) {
    console.error("Error updating playlist:", error)
    return NextResponse.json(
      { error: "Failed to update playlist" },
      { status: 500 }
    )
  }
}

// DELETE /api/playlists/[id] - Delete a playlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.playlist.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting playlist:", error)
    return NextResponse.json(
      { error: "Failed to delete playlist" },
      { status: 500 }
    )
  }
}
