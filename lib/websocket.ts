// WebSocket client utilities

export interface TelemetryData {
  assetId: string;
  timestamp: string;
  type: string;
  value: number;
  unit?: string;
  quality?: string;
}

export interface AlarmData {
  id: string;
  assetId?: string;
  timestamp: string;
  severity: string;
  status: string;
  message: string;
}

export class ScadaWebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectInterval: number = 5000;
  private url: string;
  private onTelemetryCallback?: (data: TelemetryData) => void;
  private onAlarmCallback?: (data: AlarmData) => void;
  private onStatusCallback?: (connected: boolean) => void;

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.onStatusCallback?.(true);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "telemetry") {
            this.onTelemetryCallback?.(data.payload);
          } else if (data.type === "alarm") {
            this.onAlarmCallback?.(data.payload);
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected, attempting to reconnect...");
        this.onStatusCallback?.(false);
        setTimeout(() => this.connect(), this.reconnectInterval);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  onTelemetry(callback: (data: TelemetryData) => void) {
    this.onTelemetryCallback = callback;
  }

  onAlarm(callback: (data: AlarmData) => void) {
    this.onAlarmCallback = callback;
  }

  onStatus(callback: (connected: boolean) => void) {
    this.onStatusCallback = callback;
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}
