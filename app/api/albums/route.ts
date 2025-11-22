import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/albums - Get all albums
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "20")

    const albums = await prisma.album.findMany({
      include: {
        artist: true,
        _count: {
          select: { songs: true },
        },
      },
      take: limit,
      orderBy: {
        releaseDate: "desc",
      },
    })

    return NextResponse.json(albums)
  } catch (error) {
    console.error("Error fetching albums:", error)
    return NextResponse.json(
      { error: "Failed to fetch albums" },
      { status: 500 }
    )
  }
}
