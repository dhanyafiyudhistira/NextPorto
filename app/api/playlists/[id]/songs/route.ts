import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/playlists/[id]/songs - Add song to playlist
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { songId } = body

    if (!songId) {
      return NextResponse.json(
        { error: "Song ID is required" },
        { status: 400 }
      )
    }

    // Check if song is already in playlist
    const existing = await prisma.playlistSong.findUnique({
      where: {
        playlistId_songId: {
          playlistId: params.id,
          songId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Song already in playlist" },
        { status: 400 }
      )
    }

    // Get the current max order
    const maxOrder = await prisma.playlistSong.findFirst({
      where: { playlistId: params.id },
      orderBy: { order: "desc" },
      select: { order: true },
    })

    const newOrder = maxOrder ? maxOrder.order + 1 : 0

    const playlistSong = await prisma.playlistSong.create({
      data: {
        playlistId: params.id,
        songId,
        order: newOrder,
      },
      include: {
        song: {
          include: {
            artist: true,
            album: true,
          },
        },
      },
    })

    return NextResponse.json(playlistSong, { status: 201 })
  } catch (error) {
    console.error("Error adding song to playlist:", error)
    return NextResponse.json(
      { error: "Failed to add song to playlist" },
      { status: 500 }
    )
  }
}

// DELETE /api/playlists/[id]/songs - Remove song from playlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const songId = searchParams.get("songId")

    if (!songId) {
      return NextResponse.json(
        { error: "Song ID is required" },
        { status: 400 }
      )
    }

    await prisma.playlistSong.delete({
      where: {
        playlistId_songId: {
          playlistId: params.id,
          songId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing song from playlist:", error)
    return NextResponse.json(
      { error: "Failed to remove song from playlist" },
      { status: 500 }
    )
  }
}
