import { WebSocketServer, WebSocket } from "ws";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function startWebSocketServer(port: number = 3001) {
  const wss = new WebSocketServer({ port });

  console.log(`WebSocket server started on port ${port}`);

  const clients = new Set<WebSocket>();

  wss.on("connection", (ws: WebSocket) => {
    console.log("New WebSocket client connected");
    clients.add(ws);

    ws.on("message", async (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("Received message:", data);

        // Handle different message types
        if (data.type === "subscribe") {
          // Client wants to subscribe to telemetry updates
          ws.send(
            JSON.stringify({
              type: "subscribed",
              message: "Successfully subscribed to telemetry updates"
            })
          );
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      clients.delete(ws);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  // Broadcast telemetry updates to all connected clients
  const broadcastTelemetry = (data: any) => {
    const message = JSON.stringify({
      type: "telemetry",
      payload: data
    });

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // Broadcast alarm updates to all connected clients
  const broadcastAlarm = (data: any) => {
    const message = JSON.stringify({
      type: "alarm",
      payload: data
    });

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // Simulate telemetry data generation
  setInterval(async () => {
    try {
      // Get random DER
      const ders = await prisma.der.findMany({ take: 10 });

      if (ders.length > 0) {
        const randomDer = ders[Math.floor(Math.random() * ders.length)];

        // Generate mock telemetry
        const telemetry = {
          assetId: randomDer.assetId || randomDer.id,
          timestamp: new Date().toISOString(),
          type: "ACTIVE_POWER",
          value: randomDer.pActual + (Math.random() - 0.5) * 10,
          unit: "kW",
          quality: "GOOD"
        };

        // Broadcast to all clients
        broadcastTelemetry(telemetry);
      }
    } catch (error) {
      console.error("Error generating telemetry:", error);
    }
  }, 2000); // Every 2 seconds

  return { wss, broadcastTelemetry, broadcastAlarm };
}

// Start the WebSocket server if this file is run directly
if (require.main === module) {
  const port = parseInt(process.env.SCADA_WEBSOCKET_PORT || "3001");
  startWebSocketServer(port);
}
