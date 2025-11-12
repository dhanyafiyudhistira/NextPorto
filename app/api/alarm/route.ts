import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET alarms
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");
    const limit = parseInt(searchParams.get("limit") || "100");

    const where: any = {};
    if (status) where.status = status;
    if (severity) where.severity = severity;

    const alarms = await prisma.alarm.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: limit,
      include: {
        asset: { select: { name: true, type: true } },
        acknowledgments: {
          include: {
            user: { select: { username: true, firstName: true, lastName: true } }
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: alarms });
  } catch (error) {
    console.error("Error fetching alarms:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch alarms" },
      { status: 500 }
    );
  }
}

// POST new alarm
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assetId, severity, message, description, alarmCode, category, metadata } = body;

    const alarm = await prisma.alarm.create({
      data: {
        assetId,
        severity,
        status: "ACTIVE",
        message,
        description,
        alarmCode,
        category,
        metadata: metadata || {}
      }
    });

    // Log event
    await prisma.event.create({
      data: {
        type: "ALARM_RAISED",
        message: `${severity} alarm: ${message}`,
        details: description,
        metadata: { alarmId: alarm.id, assetId, severity }
      }
    });

    return NextResponse.json({
      success: true,
      data: alarm,
      message: "Alarm raised successfully"
    });
  } catch (error) {
    console.error("Error raising alarm:", error);
    return NextResponse.json(
      { success: false, error: "Failed to raise alarm" },
      { status: 500 }
    );
  }
}
