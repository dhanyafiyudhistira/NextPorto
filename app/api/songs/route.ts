import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/songs - Get all songs (with optional search)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")
    const limit = parseInt(searchParams.get("limit") || "50")

    const songs = await prisma.song.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { artist: { name: { contains: search, mode: "insensitive" } } },
              { album: { title: { contains: search, mode: "insensitive" } } },
            ],
          }
        : undefined,
      include: {
        artist: true,
        album: true,
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(songs)
  } catch (error) {
    console.error("Error fetching songs:", error)
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 }
    )
  }
}
