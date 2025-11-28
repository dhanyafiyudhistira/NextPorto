// OPC UA Client for Industrial Automation
import {
  OPCUAClient,
  MessageSecurityMode,
  SecurityPolicy,
  AttributeIds,
  ClientSession,
} from 'node-opcua';

export class OpcUaClient {
  private client: OPCUAClient | null = null;
  private session: ClientSession | null = null;
  private endpointUrl: string;

  constructor(endpointUrl: string = 'opc.tcp://localhost:4840') {
    this.endpointUrl = endpointUrl;
  }

  async connect(): Promise<void> {
    try {
      this.client = OPCUAClient.create({
        applicationName: 'SCADA_DER_Client',
        connectionStrategy: {
          initialDelay: 1000,
          maxRetry: 1,
        },
        securityMode: MessageSecurityMode.None,
        securityPolicy: SecurityPolicy.None,
        endpointMustExist: false,
      });

      await this.client.connect(this.endpointUrl);
      console.log('OPC UA connected to', this.endpointUrl);

      this.session = await this.client.createSession();
      console.log('OPC UA session created');
    } catch (error) {
      console.error('OPC UA connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.session) {
      await this.session.close();
      this.session = null;
    }

    if (this.client) {
      await this.client.disconnect();
      this.client = null;
      console.log('OPC UA disconnected');
    }
  }

  async readNode(nodeId: string): Promise<any> {
    if (!this.session) {
      throw new Error('OPC UA session not established');
    }

    try {
      const dataValue = await this.session.read({
        nodeId,
        attributeId: AttributeIds.Value,
      });

      return dataValue.value.value;
    } catch (error) {
      console.error('OPC UA read error:', error);
      throw error;
    }
  }

  async writeNode(nodeId: string, value: any): Promise<void> {
    if (!this.session) {
      throw new Error('OPC UA session not established');
    }

    try {
      await this.session.write({
        nodeId,
        attributeId: AttributeIds.Value,
        value: {
          value: {
            dataType: 'Double',
            value,
          },
        },
      });

      console.log(`OPC UA write: ${nodeId} = ${value}`);
    } catch (error) {
      console.error('OPC UA write error:', error);
      throw error;
    }
  }

  async readTelemetry(): Promise<any> {
    // Example: Read multiple nodes
    const voltage = await this.readNode('ns=2;s=Voltage');
    const current = await this.readNode('ns=2;s=Current');
    const power = await this.readNode('ns=2;s=ActivePower');

    return {
      voltage,
      current,
      activePower: power,
    };
  }

  isConnected(): boolean {
    return this.client !== null && this.session !== null;
  }
}

// Export singleton instance
let opcuaInstance: OpcUaClient | null = null;

export function getOpcUaClient(endpointUrl?: string): OpcUaClient {
  if (!opcuaInstance) {
    opcuaInstance = new OpcUaClient(
      endpointUrl || process.env.OPC_UA_ENDPOINT || 'opc.tcp://localhost:4840'
    );
  }
  return opcuaInstance;
}
