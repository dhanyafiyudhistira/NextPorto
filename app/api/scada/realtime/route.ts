import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET real-time telemetry data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get("assetId");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};
    if (assetId) where.assetId = assetId;
    if (type) where.type = type;

    const telemetry = await prisma.telemetry.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: limit,
      include: {
        asset: {
          select: { name: true, type: true, status: true }
        }
      }
    });

    return NextResponse.json({ success: true, data: telemetry });
  } catch (error) {
    console.error("Error fetching real-time data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch telemetry data" },
      { status: 500 }
    );
  }
}
