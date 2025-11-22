import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/playlists - Get all playlists for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    // For demo purposes, use a default user if not specified
    const demoUser = await prisma.user.findFirst()

    const playlists = await prisma.playlist.findMany({
      where: {
        userId: userId || demoUser?.id,
      },
      include: {
        _count: {
          select: { songs: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(playlists)
  } catch (error) {
    console.error("Error fetching playlists:", error)
    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 }
    )
  }
}

// POST /api/playlists - Create a new playlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, userId, coverUrl, isPublic = true } = body

    if (!name) {
      return NextResponse.json(
        { error: "Playlist name is required" },
        { status: 400 }
      )
    }

    // For demo purposes, use a default user if not specified
    const demoUser = await prisma.user.findFirst()
    const finalUserId = userId || demoUser?.id

    if (!finalUserId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        userId: finalUserId,
        coverUrl,
        isPublic,
      },
    })

    return NextResponse.json(playlist, { status: 201 })
  } catch (error) {
    console.error("Error creating playlist:", error)
    return NextResponse.json(
      { error: "Failed to create playlist" },
      { status: 500 }
    )
  }
}
