import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// Write time-series data to historian
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tagName, value, unit, quality, source, metadata } = body;

    const historianData = await prisma.historianData.create({
      data: {
        tagName,
        value: parseFloat(value),
        unit,
        quality: quality || "GOOD",
        source,
        metadata: metadata || {}
      }
    });

    return NextResponse.json({
      success: true,
      data: historianData,
      message: "Data written to historian"
    });
  } catch (error) {
    console.error("Historian write error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to write to historian" },
      { status: 500 }
    );
  }
}

// Batch write
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body;

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { success: false, error: "Data must be an array" },
        { status: 400 }
      );
    }

    const historianData = await prisma.historianData.createMany({
      data: data.map((item) => ({
        tagName: item.tagName,
        value: parseFloat(item.value),
        unit: item.unit,
        quality: item.quality || "GOOD",
        source: item.source,
        metadata: item.metadata || {}
      }))
    });

    return NextResponse.json({
      success: true,
      count: historianData.count,
      message: "Batch data written to historian"
    });
  } catch (error) {
    console.error("Historian batch write error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to write batch data to historian" },
      { status: 500 }
    );
  }
}
