// Modbus TCP Client for RTU/PLC Communication
import ModbusRTU from 'modbus-serial';

export class ModbusClient {
  private client: ModbusRTU;
  private host: string;
  private port: number;
  private connected: boolean = false;

  constructor(host: string = '192.168.1.100', port: number = 502) {
    this.client = new ModbusRTU();
    this.host = host;
    this.port = port;
  }

  async connect(): Promise<void> {
    try {
      await this.client.connectTCP(this.host, { port: this.port });
      this.client.setID(1);
      this.client.setTimeout(5000);
      this.connected = true;
      console.log(`Modbus connected to ${this.host}:${this.port}`);
    } catch (error) {
      console.error('Modbus connection error:', error);
      this.connected = false;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      this.client.close(() => {
        this.connected = false;
        console.log('Modbus disconnected');
      });
    }
  }

  async readHoldingRegisters(address: number, length: number): Promise<number[]> {
    if (!this.connected) {
      await this.connect();
    }

    try {
      const data = await this.client.readHoldingRegisters(address, length);
      return data.data;
    } catch (error) {
      console.error('Modbus read error:', error);
      throw error;
    }
  }

  async writeRegister(address: number, value: number): Promise<void> {
    if (!this.connected) {
      await this.connect();
    }

    try {
      await this.client.writeRegister(address, value);
      console.log(`Modbus write: address=${address}, value=${value}`);
    } catch (error) {
      console.error('Modbus write error:', error);
      throw error;
    }
  }

  async readTelemetry(): Promise<any> {
    // Example: Read telemetry from predefined registers
    const data = await this.readHoldingRegisters(0, 10);

    return {
      voltage: data[0] / 10, // Scale by 10
      current: data[1] / 10,
      activePower: data[2],
      reactivePower: data[3],
      frequency: data[4] / 100,
      temperature: data[5],
    };
  }

  async setCurtailment(address: number, curtailmentPercent: number): Promise<void> {
    // Convert curtailment percentage to register value
    const value = Math.round((curtailmentPercent / 100) * 1000);
    await this.writeRegister(address, value);
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Export singleton instance
let modbusInstance: ModbusClient | null = null;

export function getModbusClient(host?: string, port?: number): ModbusClient {
  if (!modbusInstance) {
    modbusInstance = new ModbusClient(
      host || process.env.RTU_HOST || '192.168.1.100',
      port || Number(process.env.RTU_PORT) || 502
    );
  }
  return modbusInstance;
}
