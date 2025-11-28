import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getModbusClient } from '@/lib/protocols/modbus';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { derId, type, parameters, issuedBy } = body;

    // Get DER details
    const der = await prisma.der.findUnique({
      where: { id: derId },
    });

    if (!der) {
      return NextResponse.json(
        { success: false, error: 'DER not found' },
        { status: 404 }
      );
    }

    // Create command record
    const command = await prisma.command.create({
      data: {
        derId,
        type,
        parameters: parameters || {},
        status: 'QUEUED',
        issuedBy: issuedBy || 'System',
      },
    });

    // Execute command based on type
    try {
      const modbus = getModbusClient();

      switch (type) {
        case 'INVERTER_SET_CURTAILMENT':
          if (der.inverterAddress) {
            const curtailment = parameters.curtailmentPercent || 0;
            await modbus.setCurtailment(parseInt(der.inverterAddress), curtailment);

            // Update DER in database
            await prisma.der.update({
              where: { id: derId },
              data: {
                curtailmentPercent: curtailment,
                isCurtailed: curtailment > 0,
                pActual: der.pMax * (1 - curtailment / 100),
              },
            });
          }
          break;

        case 'DER_ENABLE':
          await prisma.der.update({
            where: { id: derId },
            data: { isEnabled: true, status: 'ONLINE' },
          });
          break;

        case 'DER_DISABLE':
          await prisma.der.update({
            where: { id: derId },
            data: { isEnabled: false, status: 'OFFLINE', pActual: 0 },
          });
          break;
      }

      // Update command status
      await prisma.command.update({
        where: { id: command.id },
        data: {
          status: 'EXECUTED',
          executedAt: new Date(),
        },
      });

      // Log event
      await prisma.event.create({
        data: {
          eventType: 'COMMAND_EXECUTED',
          description: `Command ${type} executed on ${der.name}`,
          assetId: der.assetId,
          userId: issuedBy,
        },
      });

      return NextResponse.json({
        success: true,
        commandId: command.id,
        message: 'Command executed successfully',
      });
    } catch (error: any) {
      // Update command as failed
      await prisma.command.update({
        where: { id: command.id },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
        },
      });

      throw error;
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
