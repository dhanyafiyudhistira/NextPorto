import { NextRequest, NextResponse } from 'next/server';
import { getModbusClient } from '@/lib/protocols/modbus';

export async function GET(request: NextRequest) {
  try {
    const modbus = getModbusClient();

    if (!modbus.isConnected()) {
      await modbus.connect();
    }

    const telemetry = await modbus.readTelemetry();

    return NextResponse.json({
      success: true,
      data: telemetry,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, value } = body;

    const modbus = getModbusClient();
    await modbus.writeRegister(address, value);

    return NextResponse.json({
      success: true,
      message: `Written value ${value} to address ${address}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
