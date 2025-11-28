import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tagName, value, quality, p, q, v, i, loadingPercent } = body;

    const record = await prisma.historianData.create({
      data: {
        tagName,
        value,
        quality: quality || 'GOOD',
        p,
        q,
        v,
        i,
        loadingPercent,
        timestamp: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
