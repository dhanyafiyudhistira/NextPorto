'use client';

import { useState } from 'react';
import { Save, RefreshCw, Users, Settings as SettingsIcon, Database, Wifi } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'scada' | 'protocols' | 'users'>('scada');

  // SCADA settings
  const [scadaConfig, setScadaConfig] = useState({
    serverUrl: 'scada.local',
    port: 502,
    scanRate: 1000,
    timeout: 5000,
    retryAttempts: 3,
  });

  // Protocol settings
  const [modbusConfig, setModbusConfig] = useState({
    enabled: true,
    host: '192.168.1.100',
    port: 502,
    unitId: 1,
  });

  const [mqttConfig, setMqttConfig] = useState({
    enabled: true,
    broker: 'mqtt://localhost:1883',
    username: 'scada',
    password: '',
    topics: ['telemetry/#', 'alarms/#'],
  });

  const [opcuaConfig, setOpcuaConfig] = useState({
    enabled: false,
    endpoint: 'opc.tcp://localhost:4840',
    securityMode: 'None',
  });

  // Users
  const [users, setUsers] = useState([
    { id: '1', username: 'admin', email: 'admin@scada.local', role: 'ADMIN', isActive: true },
    { id: '2', username: 'engineer', email: 'engineer@scada.local', role: 'ENGINEER', isActive: true },
    { id: '3', username: 'operator', email: 'operator@scada.local', role: 'OPERATOR', isActive: true },
  ]);

  const saveSettings = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-scada-cyan neon-text">Settings</h1>
          <p className="text-scada-blue/70 mt-1">
            Configure SCADA server, protocols, and user management
          </p>
        </div>

        <button onClick={saveSettings} className="scada-button-success flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-scada-blue/30">
        <button
          onClick={() => setActiveTab('scada')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium transition-colors ${
            activeTab === 'scada'
              ? 'text-scada-cyan border-b-2 border-scada-cyan'
              : 'text-scada-blue/70 hover:text-scada-blue'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>SCADA Server</span>
        </button>
        <button
          onClick={() => setActiveTab('protocols')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium transition-colors ${
            activeTab === 'protocols'
              ? 'text-scada-cyan border-b-2 border-scada-cyan'
              : 'text-scada-blue/70 hover:text-scada-blue'
          }`}
        >
          <Wifi className="w-4 h-4" />
          <span>Communication Protocols</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center space-x-2 px-4 py-2 font-medium transition-colors ${
            activeTab === 'users'
              ? 'text-scada-cyan border-b-2 border-scada-cyan'
              : 'text-scada-blue/70 hover:text-scada-blue'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Management</span>
        </button>
      </div>

      {/* SCADA Server Settings */}
      {activeTab === 'scada' && (
        <div className="space-y-6">
          <div className="scada-panel">
            <h2 className="text-lg font-bold text-scada-cyan mb-4 flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>SCADA Server Configuration</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="scada-label block mb-2">Server URL</label>
                <input
                  type="text"
                  value={scadaConfig.serverUrl}
                  onChange={(e) =>
                    setScadaConfig({ ...scadaConfig, serverUrl: e.target.value })
                  }
                  className="scada-input w-full"
                />
              </div>

              <div>
                <label className="scada-label block mb-2">Port</label>
                <input
                  type="number"
                  value={scadaConfig.port}
                  onChange={(e) =>
                    setScadaConfig({ ...scadaConfig, port: Number(e.target.value) })
                  }
                  className="scada-input w-full"
                />
              </div>

              <div>
                <label className="scada-label block mb-2">Scan Rate (ms)</label>
                <input
                  type="number"
                  value={scadaConfig.scanRate}
                  onChange={(e) =>
                    setScadaConfig({ ...scadaConfig, scanRate: Number(e.target.value) })
                  }
                  className="scada-input w-full"
                />
                <p className="text-xs text-scada-blue/50 mt-1">
                  How often to poll RTU/PLC devices
                </p>
              </div>

              <div>
                <label className="scada-label block mb-2">Timeout (ms)</label>
                <input
                  type="number"
                  value={scadaConfig.timeout}
                  onChange={(e) =>
                    setScadaConfig({ ...scadaConfig, timeout: Number(e.target.value) })
                  }
                  className="scada-input w-full"
                />
              </div>

              <div>
                <label className="scada-label block mb-2">Retry Attempts</label>
                <input
                  type="number"
                  value={scadaConfig.retryAttempts}
                  onChange={(e) =>
                    setScadaConfig({ ...scadaConfig, retryAttempts: Number(e.target.value) })
                  }
                  className="scada-input w-full"
                />
              </div>
            </div>
          </div>

          <div className="scada-panel">
            <h2 className="text-lg font-bold text-scada-cyan mb-4">Database Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="scada-label block mb-2">PostgreSQL URL</label>
                <input
                  type="text"
                  defaultValue="postgresql://scada:***@localhost:5432/scada_der"
                  className="scada-input w-full"
                />
              </div>
              <div>
                <label className="scada-label block mb-2">Historian Retention (days)</label>
                <input type="number" defaultValue={90} className="scada-input w-full" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Protocol Settings */}
      {activeTab === 'protocols' && (
        <div className="space-y-6">
          {/* Modbus */}
          <div className="scada-panel">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-scada-cyan">Modbus TCP</h2>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={modbusConfig.enabled}
                  onChange={(e) =>
                    setModbusConfig({ ...modbusConfig, enabled: e.target.checked })
                  }
                  className="form-checkbox"
                />
                <span className="text-sm text-scada-blue">Enabled</span>
              </label>
            </div>

            {modbusConfig.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="scada-label block mb-2">Host</label>
                  <input
                    type="text"
                    value={modbusConfig.host}
                    onChange={(e) =>
                      setModbusConfig({ ...modbusConfig, host: e.target.value })
                    }
                    className="scada-input w-full"
                  />
                </div>
                <div>
                  <label className="scada-label block mb-2">Port</label>
                  <input
                    type="number"
                    value={modbusConfig.port}
                    onChange={(e) =>
                      setModbusConfig({ ...modbusConfig, port: Number(e.target.value) })
                    }
                    className="scada-input w-full"
                  />
                </div>
                <div>
                  <label className="scada-label block mb-2">Unit ID</label>
                  <input
                    type="number"
                    value={modbusConfig.unitId}
                    onChange={(e) =>
                      setModbusConfig({ ...modbusConfig, unitId: Number(e.target.value) })
                    }
                    className="scada-input w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* MQTT */}
          <div className="scada-panel">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-scada-cyan">MQTT</h2>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={mqttConfig.enabled}
                  onChange={(e) =>
                    setMqttConfig({ ...mqttConfig, enabled: e.target.checked })
                  }
                  className="form-checkbox"
                />
                <span className="text-sm text-scada-blue">Enabled</span>
              </label>
            </div>

            {mqttConfig.enabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="scada-label block mb-2">Broker URL</label>
                    <input
                      type="text"
                      value={mqttConfig.broker}
                      onChange={(e) =>
                        setMqttConfig({ ...mqttConfig, broker: e.target.value })
                      }
                      className="scada-input w-full"
                    />
                  </div>
                  <div>
                    <label className="scada-label block mb-2">Username</label>
                    <input
                      type="text"
                      value={mqttConfig.username}
                      onChange={(e) =>
                        setMqttConfig({ ...mqttConfig, username: e.target.value })
                      }
                      className="scada-input w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="scada-label block mb-2">Subscribed Topics</label>
                  <div className="flex flex-wrap gap-2">
                    {mqttConfig.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-scada-blue/20 border border-scada-blue rounded text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* OPC UA */}
          <div className="scada-panel">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-scada-cyan">OPC UA</h2>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={opcuaConfig.enabled}
                  onChange={(e) =>
                    setOpcuaConfig({ ...opcuaConfig, enabled: e.target.checked })
                  }
                  className="form-checkbox"
                />
                <span className="text-sm text-scada-blue">Enabled</span>
              </label>
            </div>

            {opcuaConfig.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="scada-label block mb-2">Endpoint URL</label>
                  <input
                    type="text"
                    value={opcuaConfig.endpoint}
                    onChange={(e) =>
                      setOpcuaConfig({ ...opcuaConfig, endpoint: e.target.value })
                    }
                    className="scada-input w-full"
                  />
                </div>
                <div>
                  <label className="scada-label block mb-2">Security Mode</label>
                  <select
                    value={opcuaConfig.securityMode}
                    onChange={(e) =>
                      setOpcuaConfig({ ...opcuaConfig, securityMode: e.target.value })
                    }
                    className="scada-input w-full"
                  >
                    <option value="None">None</option>
                    <option value="Sign">Sign</option>
                    <option value="SignAndEncrypt">Sign & Encrypt</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Management */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="scada-panel">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-scada-cyan">System Users</h2>
              <button className="scada-button">Add New User</button>
            </div>

            <table className="scada-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="font-medium text-scada-cyan">{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.role === 'ADMIN'
                            ? 'bg-scada-red/20 text-scada-red border border-scada-red'
                            : user.role === 'ENGINEER'
                            ? 'bg-scada-yellow/20 text-scada-yellow border border-scada-yellow'
                            : 'bg-scada-blue/20 text-scada-blue border border-scada-blue'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          user.isActive ? 'text-scada-green' : 'text-gray-500'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button className="text-scada-blue hover:text-scada-cyan text-sm">
                          Edit
                        </button>
                        <button className="text-scada-red hover:text-scada-red/80 text-sm">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="scada-panel">
            <h3 className="font-bold text-scada-cyan mb-3">Role Permissions</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-3">
                <span className="px-2 py-1 bg-scada-red/20 text-scada-red rounded text-xs font-semibold min-w-[80px]">
                  ADMIN
                </span>
                <p className="text-scada-blue/70">
                  Full system access including user management, configuration, and all control
                  operations
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="px-2 py-1 bg-scada-yellow/20 text-scada-yellow rounded text-xs font-semibold min-w-[80px]">
                  ENGINEER
                </span>
                <p className="text-scada-blue/70">
                  Control operations, DER management, optimization, and configuration (no user
                  management)
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="px-2 py-1 bg-scada-blue/20 text-scada-blue rounded text-xs font-semibold min-w-[80px]">
                  OPERATOR
                </span>
                <p className="text-scada-blue/70">
                  View-only access with basic control operations and alarm acknowledgment
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
