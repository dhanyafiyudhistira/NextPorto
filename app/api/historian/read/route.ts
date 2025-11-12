import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// Read time-series data from historian
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tagName = searchParams.get("tagName");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");
    const limit = parseInt(searchParams.get("limit") || "1000");
    const aggregate = searchParams.get("aggregate"); // "avg", "min", "max", "sum"

    const where: any = {};
    if (tagName) where.tagName = tagName;
    if (startTime || endTime) {
      where.timestamp = {};
      if (startTime) where.timestamp.gte = new Date(startTime);
      if (endTime) where.timestamp.lte = new Date(endTime);
    }

    // Simple query (no aggregation)
    if (!aggregate) {
      const data = await prisma.historianData.findMany({
        where,
        orderBy: { timestamp: "desc" },
        take: limit
      });

      return NextResponse.json({ success: true, data });
    }

    // Aggregation query
    const aggregateResult = await prisma.historianData.aggregate({
      where,
      _avg: aggregate === "avg" ? { value: true } : undefined,
      _min: aggregate === "min" ? { value: true } : undefined,
      _max: aggregate === "max" ? { value: true } : undefined,
      _sum: aggregate === "sum" ? { value: true } : undefined,
      _count: true
    });

    return NextResponse.json({
      success: true,
      data: aggregateResult,
      aggregate
    });
  } catch (error) {
    console.error("Historian read error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to read from historian" },
      { status: 500 }
    );
  }
}
