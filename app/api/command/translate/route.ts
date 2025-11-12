import { NextRequest, NextResponse } from "next/server";

// Translate high-level commands to PLC/inverter-specific control commands
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { commandType, targetType, targetId, value, parameters } = body;

    // Command translation logic
    const translatedCommand = translateCommand(
      commandType,
      targetType,
      targetId,
      value,
      parameters
    );

    return NextResponse.json({
      success: true,
      data: translatedCommand,
      message: "Command translated successfully"
    });
  } catch (error) {
    console.error("Command translation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to translate command" },
      { status: 500 }
    );
  }
}

function translateCommand(
  commandType: string,
  targetType: string,
  targetId: string,
  value?: number,
  parameters?: any
) {
  const translations: any = {
    INVERTER_SET_CURTAILMENT: {
      modbus: {
        functionCode: 16, // Write Multiple Registers
        registerAddress: 40100,
        dataType: "UINT16",
        scaleFactor: 10
      },
      opcua: {
        nodeId: "ns=2;s=Inverter.Curtailment.Setpoint",
        dataType: "Double"
      },
      iec61850: {
        logicalNode: "MMXU1",
        dataObject: "WMaxLimPct",
        attribute: "setVal"
      }
    },
    BREAKER_OPEN: {
      modbus: {
        functionCode: 5, // Write Single Coil
        registerAddress: 10001,
        value: true
      },
      opcua: {
        nodeId: "ns=2;s=Breaker.Command.Open",
        dataType: "Boolean"
      }
    },
    BREAKER_CLOSE: {
      modbus: {
        functionCode: 5,
        registerAddress: 10001,
        value: false
      },
      opcua: {
        nodeId: "ns=2;s=Breaker.Command.Close",
        dataType: "Boolean"
      }
    },
    SET_ACTIVE_POWER: {
      modbus: {
        functionCode: 16,
        registerAddress: 40200,
        dataType: "FLOAT32",
        scaleFactor: 1
      },
      opcua: {
        nodeId: "ns=2;s=DER.ActivePower.Setpoint",
        dataType: "Float"
      }
    }
  };

  const translation = translations[commandType]?.[targetType.toLowerCase()] || {};

  return {
    commandType,
    targetType,
    targetId,
    value,
    parameters,
    protocol: translation,
    timestamp: new Date().toISOString()
  };
}
