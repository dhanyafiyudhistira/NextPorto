import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// Modbus TCP reader simulation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assetId, address, functionCode, registerAddress, count } = body;

    // Simulate Modbus TCP read
    // In production, use modbus-serial library to read from actual devices
    const mockData = {
      registers: Array.from({ length: count || 1 }, () =>
        Math.floor(Math.random() * 65535)
      ),
      timestamp: new Date().toISOString(),
      quality: "GOOD"
    };

    // Store telemetry data
    if (assetId) {
      await prisma.telemetry.create({
        data: {
          assetId,
          type: "VOLTAGE",
          value: mockData.registers[0] / 10, // Scale factor
          unit: "V",
          quality: "GOOD",
          source: "MODBUS",
          metadata: {
            address,
            functionCode,
            registerAddress
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: mockData,
      message: "Modbus data read successfully"
    });
  } catch (error) {
    console.error("Modbus read error:", error);
    return NextResponse.json(
      { success: false, error: "Modbus read failed" },
      { status: 500 }
    );
  }
}

// GET Modbus configuration
export async function GET(request: NextRequest) {
  try {
    const modbusAssets = await prisma.asset.findMany({
      where: {
        protocol: "MODBUS_TCP"
      },
      select: {
        id: true,
        name: true,
        ipAddress: true,
        port: true,
        modbusAddress: true,
        status: true
      }
    });

    return NextResponse.json({ success: true, data: modbusAssets });
  } catch (error) {
    console.error("Error fetching Modbus assets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch Modbus configuration" },
      { status: 500 }
    );
  }
}
