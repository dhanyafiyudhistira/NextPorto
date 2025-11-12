import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// Acknowledge alarm
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { alarmId, userId, comment } = body;

    // Update alarm status
    const alarm = await prisma.alarm.update({
      where: { id: alarmId },
      data: {
        status: "ACKNOWLEDGED",
        acknowledgedAt: new Date()
      }
    });

    // Create acknowledgment record
    await prisma.alarmAck.create({
      data: {
        alarmId,
        userId,
        comment
      }
    });

    // Log event
    await prisma.event.create({
      data: {
        type: "ALARM_CLEARED",
        message: `Alarm acknowledged: ${alarm.message}`,
        details: comment,
        metadata: { alarmId, userId }
      }
    });

    return NextResponse.json({
      success: true,
      data: alarm,
      message: "Alarm acknowledged successfully"
    });
  } catch (error) {
    console.error("Error acknowledging alarm:", error);
    return NextResponse.json(
      { success: false, error: "Failed to acknowledge alarm" },
      { status: 500 }
    );
  }
}
