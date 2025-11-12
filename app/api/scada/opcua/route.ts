import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// OPC UA reader simulation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assetId, nodeId } = body;

    // Simulate OPC UA read
    // In production, use node-opcua library to read from actual OPC UA servers
    const mockData = {
      value: Math.random() * 1000,
      statusCode: "Good",
      sourceTimestamp: new Date().toISOString(),
      serverTimestamp: new Date().toISOString()
    };

    // Store telemetry data
    if (assetId) {
      await prisma.telemetry.create({
        data: {
          assetId,
          type: "ACTIVE_POWER",
          value: mockData.value,
          unit: "kW",
          quality: "GOOD",
          source: "OPC_UA",
          metadata: {
            nodeId,
            statusCode: mockData.statusCode
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: mockData,
      message: "OPC UA data read successfully"
    });
  } catch (error) {
    console.error("OPC UA read error:", error);
    return NextResponse.json(
      { success: false, error: "OPC UA read failed" },
      { status: 500 }
    );
  }
}

// GET OPC UA configuration
export async function GET(request: NextRequest) {
  try {
    const opcuaAssets = await prisma.asset.findMany({
      where: {
        protocol: "OPC_UA"
      },
      select: {
        id: true,
        name: true,
        ipAddress: true,
        port: true,
        opcuaNodeId: true,
        status: true
      }
    });

    return NextResponse.json({ success: true, data: opcuaAssets });
  } catch (error) {
    console.error("Error fetching OPC UA assets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch OPC UA configuration" },
      { status: 500 }
    );
  }
}
