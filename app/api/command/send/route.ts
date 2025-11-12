import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// Send command to field device
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, assetId, derId, value, parameters } = body;

    // Get before state
    let beforeState: any = {};
    if (derId) {
      const der = await prisma.der.findUnique({ where: { id: derId } });
      beforeState = {
        pActual: der?.pActual,
        curtailmentPercent: der?.curtailmentPercent,
        status: der?.status
      };
    }

    // Create command record
    const command = await prisma.command.create({
      data: {
        type,
        status: "PENDING",
        assetId,
        derId,
        value,
        parameters: parameters || {},
        beforeState
      }
    });

    // Simulate command execution
    setTimeout(async () => {
      try {
        // Simulate command sending to PLC/inverter
        const success = Math.random() > 0.1; // 90% success rate

        if (success) {
          // Update command status
          await prisma.command.update({
            where: { id: command.id },
            data: {
              status: "SUCCESS",
              sentAt: new Date(),
              acknowledgedAt: new Date(),
              completedAt: new Date(),
              response: "Command executed successfully"
            }
          });

          // Apply command to DER
          if (derId && type === "INVERTER_SET_CURTAILMENT" && value !== undefined) {
            await prisma.der.update({
              where: { id: derId },
              data: {
                curtailmentPercent: value,
                pActual: 0 // Will be updated by telemetry
              }
            });

            // Get after state
            const der = await prisma.der.findUnique({ where: { id: derId } });
            const afterState = {
              pActual: der?.pActual,
              curtailmentPercent: der?.curtailmentPercent,
              status: der?.status
            };

            await prisma.command.update({
              where: { id: command.id },
              data: { afterState }
            });

            // Log event
            await prisma.event.create({
              data: {
                type: "COMMAND_SUCCESS",
                message: `Curtailment set to ${value}% for ${der?.name}`,
                details: JSON.stringify({ commandId: command.id, derId, value }),
                metadata: { beforeState, afterState }
              }
            });
          }
        } else {
          // Command failed
          await prisma.command.update({
            where: { id: command.id },
            data: {
              status: "FAILED",
              sentAt: new Date(),
              errorMessage: "Communication timeout"
            }
          });

          // Log event
          await prisma.event.create({
            data: {
              type: "COMMAND_FAILED",
              message: `Failed to execute command ${type}`,
              details: JSON.stringify({ commandId: command.id, error: "Communication timeout" })
            }
          });
        }
      } catch (error) {
        console.error("Command execution error:", error);
      }
    }, 1000);

    return NextResponse.json({
      success: true,
      data: { commandId: command.id },
      message: "Command sent successfully"
    });
  } catch (error) {
    console.error("Command send error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send command" },
      { status: 500 }
    );
  }
}

// GET command history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status");

    const where: any = {};
    if (status) where.status = status;

    const commands = await prisma.command.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: limit,
      include: {
        asset: { select: { name: true, type: true } },
        der: { select: { name: true, type: true } }
      }
    });

    return NextResponse.json({ success: true, data: commands });
  } catch (error) {
    console.error("Error fetching commands:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch commands" },
      { status: 500 }
    );
  }
}
