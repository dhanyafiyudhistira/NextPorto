// MQTT Client for Real-Time Telemetry
import mqtt, { MqttClient } from 'mqtt';

export class MqttManager {
  private client: MqttClient | null = null;
  private brokerUrl: string;
  private subscribers: Map<string, (topic: string, payload: any) => void> = new Map();

  constructor(brokerUrl: string = 'mqtt://localhost:1883') {
    this.brokerUrl = brokerUrl;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = mqtt.connect(this.brokerUrl, {
        clientId: `scada_${Math.random().toString(16).slice(3)}`,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
      });

      this.client.on('connect', () => {
        console.log('MQTT connected to', this.brokerUrl);
        resolve();
      });

      this.client.on('error', (error) => {
        console.error('MQTT connection error:', error);
        reject(error);
      });

      this.client.on('message', (topic, message) => {
        try {
          const payload = JSON.parse(message.toString());
          this.subscribers.forEach((callback) => {
            callback(topic, payload);
          });
        } catch (error) {
          console.error('MQTT message parsing error:', error);
        }
      });
    });
  }

  subscribe(topic: string, callback: (topic: string, payload: any) => void): void {
    if (!this.client) {
      throw new Error('MQTT client not connected');
    }

    this.client.subscribe(topic, (error) => {
      if (error) {
        console.error('MQTT subscription error:', error);
      } else {
        console.log('MQTT subscribed to', topic);
        this.subscribers.set(topic, callback);
      }
    });
  }

  publish(topic: string, payload: any): void {
    if (!this.client) {
      throw new Error('MQTT client not connected');
    }

    this.client.publish(topic, JSON.stringify(payload), (error) => {
      if (error) {
        console.error('MQTT publish error:', error);
      }
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.end();
      console.log('MQTT disconnected');
    }
  }
}

// Export singleton instance
let mqttInstance: MqttManager | null = null;

export function getMqttClient(brokerUrl?: string): MqttManager {
  if (!mqttInstance) {
    mqttInstance = new MqttManager(brokerUrl || process.env.MQTT_BROKER || 'mqtt://localhost:1883');
  }
  return mqttInstance;
}
