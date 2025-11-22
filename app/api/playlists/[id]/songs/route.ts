import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/playlists/[id]/songs - Add a song to a playlist
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { songId } = body

    if (!songId) {
      return NextResponse.json(
        { error: 'Song ID is required' },
        { status: 400 }
      )
    }

    // Check if user owns the playlist
    const playlist = await prisma.playlist.findUnique({
      where: { id: params.id },
      include: {
        songs: true,
      },
    })

    if (!playlist) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      )
    }

    if (playlist.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if song already exists in playlist
    const existingSong = await prisma.playlistSong.findUnique({
      where: {
        playlistId_songId: {
          playlistId: params.id,
          songId,
        },
      },
    })

    if (existingSong) {
      return NextResponse.json(
        { error: 'Song already in playlist' },
        { status: 400 }
      )
    }

    // Get the next order value
    const maxOrder = playlist.songs.reduce(
      (max, song) => Math.max(max, song.order),
      -1
    )

    const playlistSong = await prisma.playlistSong.create({
      data: {
        playlistId: params.id,
        songId,
        order: maxOrder + 1,
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
    console.error('Error adding song to playlist:', error)
    return NextResponse.json(
      { error: 'Failed to add song to playlist' },
      { status: 500 }
    )
  }
}

// DELETE /api/playlists/[id]/songs?songId=... - Remove a song from a playlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const songId = searchParams.get('songId')

    if (!songId) {
      return NextResponse.json(
        { error: 'Song ID is required' },
        { status: 400 }
      )
    }

    // Check if user owns the playlist
    const playlist = await prisma.playlist.findUnique({
      where: { id: params.id },
    })

    if (!playlist) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      )
    }

    if (playlist.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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
    console.error('Error removing song from playlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove song from playlist' },
      { status: 500 }
    )
  }
}
