import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// MQTT message handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, payload, assetId } = body;

    // Parse MQTT payload
    let parsedPayload;
    try {
      parsedPayload = typeof payload === "string" ? JSON.parse(payload) : payload;
    } catch {
      parsedPayload = { value: payload };
    }

    // Store telemetry data
    if (assetId && parsedPayload.value !== undefined) {
      await prisma.telemetry.create({
        data: {
          assetId,
          type: parsedPayload.type || "ACTIVE_POWER",
          value: parseFloat(parsedPayload.value),
          unit: parsedPayload.unit || "kW",
          quality: "GOOD",
          source: "MQTT",
          metadata: {
            topic,
            raw: parsedPayload
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "MQTT data processed successfully"
    });
  } catch (error) {
    console.error("MQTT processing error:", error);
    return NextResponse.json(
      { success: false, error: "MQTT data processing failed" },
      { status: 500 }
    );
  }
}

// GET MQTT configuration
export async function GET(request: NextRequest) {
  try {
    const mqttAssets = await prisma.asset.findMany({
      where: {
        protocol: "MQTT"
      },
      select: {
        id: true,
        name: true,
        mqttTopic: true,
        status: true
      }
    });

    return NextResponse.json({ success: true, data: mqttAssets });
  } catch (error) {
    console.error("Error fetching MQTT assets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch MQTT configuration" },
      { status: 500 }
    );
  }
}
