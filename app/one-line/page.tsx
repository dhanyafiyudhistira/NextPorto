'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import TelemetryDisplay from '@/components/scada/TelemetryDisplay';

interface SystemNode {
  id: string;
  type: 'sensor' | 'rtu' | 'scada' | 'historian' | 'ai' | 'command' | 'der';
  name: string;
  x: number;
  y: number;
  status: 'online' | 'offline' | 'fault';
  telemetry?: any[];
}

export default function OneLinePage() {
  const [selectedNode, setSelectedNode] = useState<SystemNode | null>(null);

  // Define system architecture nodes matching the diagram
  const nodes: SystemNode[] = [
    // Sensors Layer
    { id: 'ct1', type: 'sensor', name: 'CT/VT Sensor 1', x: 50, y: 100, status: 'online' },
    { id: 'meter1', type: 'sensor', name: 'Power Meter 1', x: 150, y: 100, status: 'online' },
    { id: 'pmu1', type: 'sensor', name: 'PMU', x: 250, y: 100, status: 'online' },

    // RTU/PLC Layer
    { id: 'rtu1', type: 'rtu', name: 'RTU-01 (Modbus)', x: 50, y: 250, status: 'online' },
    { id: 'plc1', type: 'rtu', name: 'PLC-01 (OPC UA)', x: 150, y: 250, status: 'online' },
    { id: 'gateway1', type: 'rtu', name: 'Edge Gateway (MQTT)', x: 250, y: 250, status: 'online' },

    // SCADA Server
    { id: 'scada', type: 'scada', name: 'SCADA Server', x: 150, y: 400, status: 'online' },

    // Historian
    { id: 'historian', type: 'historian', name: 'Historian (TimescaleDB)', x: 50, y: 550, status: 'online' },

    // AI Engine
    { id: 'ai', type: 'ai', name: 'AI Optimization Engine', x: 150, y: 550, status: 'online' },

    // Command Execution
    { id: 'command', type: 'command', name: 'Command Executor', x: 250, y: 550, status: 'online' },

    // DERs
    { id: 'pv1', type: 'der', name: 'Solar Farm A (5MW)', x: 350, y: 400, status: 'online' },
    { id: 'wind1', type: 'der', name: 'Wind Turbine (3MW)', x: 450, y: 400, status: 'online' },
    { id: 'bess1', type: 'der', name: 'BESS (2MW)', x: 550, y: 400, status: 'online' },
  ];

  // Define connections
  const connections = [
    // Sensors to RTU/PLC
    { from: 'ct1', to: 'rtu1' },
    { from: 'meter1', to: 'plc1' },
    { from: 'pmu1', to: 'gateway1' },

    // RTU/PLC to SCADA
    { from: 'rtu1', to: 'scada' },
    { from: 'plc1', to: 'scada' },
    { from: 'gateway1', to: 'scada' },

    // SCADA to downstream
    { from: 'scada', to: 'historian' },
    { from: 'scada', to: 'ai' },

    // AI to Command
    { from: 'ai', to: 'command' },

    // Command to DERs
    { from: 'command', to: 'pv1' },
    { from: 'command', to: 'wind1' },
    { from: 'command', to: 'bess1' },
  ];

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#00ff88';
      case 'offline':
        return '#666';
      case 'fault':
        return '#ff3366';
      default:
        return '#00d4ff';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'sensor':
        return '📡';
      case 'rtu':
        return '🔌';
      case 'scada':
        return '🖥️';
      case 'historian':
        return '💾';
      case 'ai':
        return '🧠';
      case 'command':
        return '⚡';
      case 'der':
        return '⚙️';
      default:
        return '●';
    }
  };

  const mockTelemetry = [
    { tagName: 'VOLTAGE_L1', label: 'Voltage L1', value: 230.5, unit: 'V', quality: 'GOOD' as const, min: 220, max: 240 },
    { tagName: 'CURRENT_L1', label: 'Current L1', value: 125.3, unit: 'A', quality: 'GOOD' as const, min: 0, max: 200 },
    { tagName: 'POWER_ACTIVE', label: 'Active Power', value: 4250, unit: 'kW', quality: 'GOOD' as const, min: 0, max: 5000 },
    { tagName: 'FREQUENCY', label: 'Frequency', value: 50.02, unit: 'Hz', quality: 'GOOD' as const, min: 49.5, max: 50.5 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-scada-cyan neon-text">One-Line Diagram</h1>
        <p className="text-scada-blue/70 mt-1">
          Interactive system architecture - Click any component for details
        </p>
      </div>

      {/* Main Diagram */}
      <div className="scada-panel relative" style={{ height: '700px' }}>
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Draw connections first (so they're behind nodes) */}
          {connections.map((conn, idx) => {
            const fromNode = nodes.find((n) => n.id === conn.from);
            const toNode = nodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            return (
              <motion.line
                key={idx}
                x1={fromNode.x + 50}
                y1={fromNode.y + 25}
                x2={toNode.x + 50}
                y2={toNode.y + 25}
                stroke="#00d4ff"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: idx * 0.1 }}
              />
            );
          })}

          {/* Draw nodes */}
          {nodes.map((node, idx) => (
            <g key={node.id}>
              <motion.circle
                cx={node.x + 50}
                cy={node.y + 25}
                r="25"
                fill="rgba(6, 9, 24, 0.9)"
                stroke={getNodeColor(node.status)}
                strokeWidth="3"
                className="cursor-pointer"
                onClick={() => setSelectedNode(node)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.1 }}
              />

              {/* Icon */}
              <text
                x={node.x + 50}
                y={node.y + 25}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="20"
                className="pointer-events-none"
              >
                {getNodeIcon(node.type)}
              </text>

              {/* Label */}
              <text
                x={node.x + 50}
                y={node.y + 60}
                textAnchor="middle"
                fill="#00d4ff"
                fontSize="12"
                fontWeight="bold"
                className="pointer-events-none"
              >
                {node.name}
              </text>

              {/* Status indicator */}
              <circle
                cx={node.x + 70}
                cy={node.y + 10}
                r="5"
                fill={getNodeColor(node.status)}
                className={node.status === 'online' ? 'animate-pulse' : ''}
              />
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-scada-darker border border-scada-blue/30 rounded-lg p-4">
          <h3 className="text-sm font-bold text-scada-cyan mb-2">Legend</h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-scada-green"></div>
              <span className="text-scada-blue/70">Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-scada-blue/70">Offline</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-scada-red"></div>
              <span className="text-scada-blue/70">Fault</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel for Node Details */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed right-0 top-0 h-full w-96 bg-scada-darker border-l border-scada-blue/30 shadow-2xl p-6 overflow-y-auto z-50"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 p-2 hover:bg-scada-red/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-scada-red" />
            </button>

            {/* Node details */}
            <div className="space-y-6">
              <div>
                <div className="text-4xl mb-2">{getNodeIcon(selectedNode.type)}</div>
                <h2 className="text-2xl font-bold text-scada-cyan">{selectedNode.name}</h2>
                <p className="text-sm text-scada-blue/70 uppercase mt-1">
                  {selectedNode.type}
                </p>
              </div>

              {/* Status */}
              <div className="scada-panel">
                <div className="scada-label mb-2">Status</div>
                <div className={`text-lg font-bold capitalize ${
                  selectedNode.status === 'online' ? 'text-scada-green' :
                  selectedNode.status === 'fault' ? 'text-scada-red' :
                  'text-gray-500'
                }`}>
                  {selectedNode.status}
                </div>
              </div>

              {/* Telemetry */}
              <TelemetryDisplay
                title="Real-Time Telemetry"
                points={mockTelemetry}
              />

              {/* Controls */}
              <div className="scada-panel">
                <h3 className="font-bold text-scada-cyan mb-3">Controls</h3>
                <div className="space-y-2">
                  <button className="w-full scada-button">View Detailed Logs</button>
                  <button className="w-full scada-button">Configure Parameters</button>
                  {selectedNode.type === 'der' && (
                    <button className="w-full scada-button-danger">Emergency Shutdown</button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
