import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// Preprocess data for AI optimization
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { derIds, timeRange } = body;

    // Fetch DER states
    const ders = await prisma.der.findMany({
      where: derIds ? { id: { in: derIds } } : {},
      select: {
        id: true,
        name: true,
        type: true,
        pMax: true,
        pMin: true,
        pActual: true,
        qActual: true,
        status: true,
        curtailmentPercent: true,
        isControllable: true,
        isEnabled: true
      }
    });

    // Fetch recent telemetry for line loading, voltage, etc.
    const startTime = timeRange?.start
      ? new Date(timeRange.start)
      : new Date(Date.now() - 15 * 60 * 1000); // Last 15 minutes

    const telemetry = await prisma.telemetry.findMany({
      where: {
        timestamp: { gte: startTime },
        type: { in: ["VOLTAGE", "CURRENT", "LOADING_PERCENT", "ACTIVE_POWER"] }
      },
      orderBy: { timestamp: "desc" },
      take: 500
    });

    // Group telemetry by type
    const telemetryByType = telemetry.reduce((acc: any, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    }, {});

    // Calculate average loading
    const avgLoading =
      telemetryByType.LOADING_PERCENT?.reduce((sum: number, t: any) => sum + t.value, 0) /
        (telemetryByType.LOADING_PERCENT?.length || 1) || 0;

    // Calculate average voltage
    const avgVoltage =
      telemetryByType.VOLTAGE?.reduce((sum: number, t: any) => sum + t.value, 0) /
        (telemetryByType.VOLTAGE?.length || 1) || 0;

    // Prepare preprocessed data
    const preprocessedData = {
      ders: ders.map((der) => ({
        id: der.id,
        name: der.name,
        type: der.type,
        pMax: der.pMax,
        pMin: der.pMin,
        pActual: der.pActual,
        qActual: der.qActual,
        status: der.status,
        currentCurtailment: der.curtailmentPercent,
        isControllable: der.isControllable,
        isEnabled: der.isEnabled,
        availablePower: der.pMax * (1 - der.curtailmentPercent / 100)
      })),
      systemState: {
        avgLoading,
        avgVoltage,
        totalGeneration: ders.reduce((sum, der) => sum + der.pActual, 0),
        totalCapacity: ders.reduce((sum, der) => sum + der.pMax, 0)
      },
      telemetrySummary: {
        loadingCount: telemetryByType.LOADING_PERCENT?.length || 0,
        voltageCount: telemetryByType.VOLTAGE?.length || 0,
        powerCount: telemetryByType.ACTIVE_POWER?.length || 0
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: preprocessedData,
      message: "Data preprocessed successfully"
    });
  } catch (error) {
    console.error("AI preprocessing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to preprocess data" },
      { status: 500 }
    );
  }
}
