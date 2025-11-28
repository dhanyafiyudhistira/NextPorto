import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assetId, severity, title, message, tagName, value, threshold } = body;

    const alarm = await prisma.alarm.create({
      data: {
        assetId,
        severity,
        title,
        message,
        tagName,
        value,
        threshold,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({
      success: true,
      data: alarm,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');

    const where: any = {};
    if (status) where.status = status;
    if (severity) where.severity = severity;

    const alarms = await prisma.alarm.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      data: alarms,
      count: alarms.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
