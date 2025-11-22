import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/artists - Get all artists
export async function GET(request: NextRequest) {
  try {
    const artists = await prisma.artist.findMany({
      include: {
        _count: {
          select: {
            songs: true,
            albums: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(artists)
  } catch (error) {
    console.error('Error fetching artists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    )
  }
}
