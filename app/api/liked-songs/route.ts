import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/liked-songs - Get all liked songs for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    // For demo purposes, use a default user if not specified
    const demoUser = await prisma.user.findFirst()
    const finalUserId = userId || demoUser?.id

    if (!finalUserId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const likedSongs = await prisma.likedSong.findMany({
      where: { userId: finalUserId },
      include: {
        song: {
          include: {
            artist: true,
            album: true,
          },
        },
      },
      orderBy: {
        likedAt: "desc",
      },
    })

    // Transform to return just the songs
    const songs = likedSongs.map((ls) => ls.song)

    return NextResponse.json(songs)
  } catch (error) {
    console.error("Error fetching liked songs:", error)
    return NextResponse.json(
      { error: "Failed to fetch liked songs" },
      { status: 500 }
    )
  }
}

// POST /api/liked-songs - Like a song
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { songId, userId } = body

    if (!songId) {
      return NextResponse.json(
        { error: "Song ID is required" },
        { status: 400 }
      )
    }

    // For demo purposes, use a default user if not specified
    const demoUser = await prisma.user.findFirst()
    const finalUserId = userId || demoUser?.id

    if (!finalUserId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const likedSong = await prisma.likedSong.create({
      data: {
        userId: finalUserId,
        songId,
      },
    })

    return NextResponse.json(likedSong, { status: 201 })
  } catch (error) {
    console.error("Error liking song:", error)
    return NextResponse.json(
      { error: "Failed to like song" },
      { status: 500 }
    )
  }
}

// DELETE /api/liked-songs - Unlike a song
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const songId = searchParams.get("songId")
    const userId = searchParams.get("userId")

    if (!songId) {
      return NextResponse.json(
        { error: "Song ID is required" },
        { status: 400 }
      )
    }

    // For demo purposes, use a default user if not specified
    const demoUser = await prisma.user.findFirst()
    const finalUserId = userId || demoUser?.id

    if (!finalUserId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await prisma.likedSong.delete({
      where: {
        userId_songId: {
          userId: finalUserId,
          songId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unliking song:", error)
    return NextResponse.json(
      { error: "Failed to unlike song" },
      { status: 500 }
    )
  }
}
