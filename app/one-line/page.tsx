"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OneLinePage() {
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await fetch("/api/assets");
      const result = await response.json();
      if (result.success) {
        setAssets(result.data);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">One-Line Diagram</h1>
        <p className="text-gray-400 mt-1">Interactive SCADA system architecture</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SVG Diagram */}
        <div className="lg:col-span-3">
          <Card className="p-6 bg-gray-950">
            <svg
              width="100%"
              height="600"
              viewBox="0 0 1200 600"
              className="border border-gray-800 rounded-lg"
            >
              {/* Background grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="rgba(75, 85, 99, 0.2)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Title */}
              <text x="600" y="30" textAnchor="middle" fill="#00f0ff" fontSize="24" fontWeight="bold">
                DER SCADA System Architecture
              </text>

              {/* Layer 1: Sensors & Field Devices */}
              <g id="sensors-layer">
                <text x="100" y="90" fill="#9CA3AF" fontSize="14" fontWeight="bold">
                  Sensors & Field Devices
                </text>

                {/* CT/VT */}
                <g onClick={() => setSelectedComponent({ type: "CT/VT", name: "Current/Voltage Transformer" })}>
                  <circle cx="120" cy="140" r="30" fill="#1F2937" stroke="#00f0ff" strokeWidth="2" className="cursor-pointer hover:fill-gray-800" />
                  <text x="120" y="145" textAnchor="middle" fill="#00f0ff" fontSize="12">CT/VT</text>
                </g>

                {/* Power Meter */}
                <g onClick={() => setSelectedComponent({ type: "METER", name: "Power Meter" })}>
                  <rect x="230" y="110" width="60" height="60" fill="#1F2937" stroke="#00f0ff" strokeWidth="2" className="cursor-pointer hover:fill-gray-800" />
                  <text x="260" y="145" textAnchor="middle" fill="#00f0ff" fontSize="11">Meter</text>
                </g>

                {/* PMU */}
                <g onClick={() => setSelectedComponent({ type: "PMU", name: "Phasor Measurement Unit" })}>
                  <circle cx="360" cy="140" r="30" fill="#1F2937" stroke="#00f0ff" strokeWidth="2" className="cursor-pointer hover:fill-gray-800" />
                  <text x="360" y="145" textAnchor="middle" fill="#00f0ff" fontSize="12">PMU</text>
                </g>

                {/* 4-20mA Sensor */}
                <g onClick={() => setSelectedComponent({ type: "SENSOR", name: "4-20mA Sensor" })}>
                  <rect x="440" y="110" width="60" height="60" fill="#1F2937" stroke="#10B981" strokeWidth="2" className="cursor-pointer hover:fill-gray-800" />
                  <text x="470" y="140" textAnchor="middle" fill="#10B981" fontSize="9">4-20mA</text>
                  <text x="470" y="155" textAnchor="middle" fill="#10B981" fontSize="9">Sensor</text>
                </g>
              </g>

              {/* Connection lines to RTU/PLC layer */}
              <line x1="120" y1="170" x2="200" y2="250" stroke="#00f0ff" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="260" y1="170" x2="280" y2="250" stroke="#00f0ff" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="360" y1="170" x2="360" y2="250" stroke="#00f0ff" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="470" y1="170" x2="440" y2="250" stroke="#10B981" strokeWidth="2" strokeDasharray="5,5" />

              {/* Layer 2: RTU / PLC / Edge Gateway */}
              <g id="rtu-layer">
                <text x="100" y="230" fill="#9CA3AF" fontSize="14" fontWeight="bold">
                  RTU / PLC / Edge Gateway
                </text>

                <g onClick={() => setSelectedComponent({ type: "RTU", name: "Remote Terminal Unit" })}>
                  <rect x="180" y="260" width="280" height="80" fill="#1F2937" stroke="#b030ff" strokeWidth="3" className="cursor-pointer hover:fill-gray-800" />
                  <text x="320" y="295" textAnchor="middle" fill="#b030ff" fontSize="16" fontWeight="bold">RTU / PLC</text>
                  <text x="320" y="315" textAnchor="middle" fill="#9CA3AF" fontSize="10">Modbus TCP • MQTT • OPC UA • IEC 61850</text>
                </g>
              </g>

              {/* Connection to SCADA Server */}
              <line x1="320" y1="340" x2="320" y2="400" stroke="#b030ff" strokeWidth="3" />
              <text x="340" y="375" fill="#9CA3AF" fontSize="10">VPN</text>

              {/* Layer 3: SCADA Server */}
              <g id="scada-layer">
                <g onClick={() => setSelectedComponent({ type: "SCADA", name: "SCADA Server" })}>
                  <rect x="180" y="410" width="280" height="80" fill="#1F2937" stroke="#ff10f0" strokeWidth="3" className="cursor-pointer hover:fill-gray-800 animate-pulse-glow" />
                  <text x="320" y="445" textAnchor="middle" fill="#ff10f0" fontSize="18" fontWeight="bold">SCADA SERVER</text>
                  <text x="320" y="465" textAnchor="middle" fill="#9CA3AF" fontSize="10">HMI • Alarms • Commands • Audit</text>
                </g>
              </g>

              {/* Branches from SCADA */}
              <line x1="320" y1="490" x2="200" y2="540" stroke="#ff10f0" strokeWidth="2" />
              <line x1="320" y1="490" x2="440" y2="540" stroke="#ff10f0" strokeWidth="2" />
              <line x1="320" y1="490" x2="680" y2="400" stroke="#00f0ff" strokeWidth="2" />

              {/* Layer 4: Historian */}
              <g id="historian-layer">
                <g onClick={() => setSelectedComponent({ type: "HISTORIAN", name: "Historian Database" })}>
                  <rect x="140" y="540" width="120" height="50" fill="#1F2937" stroke="#F59E0B" strokeWidth="2" className="cursor-pointer hover:fill-gray-800" />
                  <text x="200" y="570" textAnchor="middle" fill="#F59E0B" fontSize="14" fontWeight="bold">Historian</text>
                </g>
              </g>

              {/* Layer 5: AI Engine */}
              <g id="ai-layer">
                <g onClick={() => setSelectedComponent({ type: "AI", name: "AI Optimization Engine" })}>
                  <rect x="380" y="540" width="120" height="50" fill="#1F2937" stroke="#8B5CF6" strokeWidth="2" className="cursor-pointer hover:fill-gray-800" />
                  <text x="440" y="565" textAnchor="middle" fill="#8B5CF6" fontSize="13" fontWeight="bold">AI Engine</text>
                  <text x="440" y="580" textAnchor="middle" fill="#9CA3AF" fontSize="8">LP/DP/GA/DRL</text>
                </g>
              </g>

              {/* Right side: DERs */}
              <g id="der-layer">
                <text x="700" y="230" fill="#9CA3AF" fontSize="14" fontWeight="bold">
                  Distributed Energy Resources
                </text>

                {/* PV */}
                <g onClick={() => setSelectedComponent({ type: "DER_PV", name: "Solar PV Array" })}>
                  <rect x="680" y="260" width="100" height="60" fill="#1F2937" stroke="#FBBF24" strokeWidth="2" className="cursor-pointer hover:fill-gray-800" />
                  <text x="730" y="285" textAnchor="middle" fill="#FBBF24" fontSize="12">PV Array</text>
                  <text x="730" y="305" textAnchor="middle" fill="#9CA3AF" fontSize="9">500 kW</text>
                </g>

                {/* Wind */}
                <g onClick={() => setSelectedComponent({ type: "DER_WIND", name: "Wind Turbine" })}>
                  <circle cx="880" cy="290" r="35" fill="#1F2937" stroke="#10B981" strokeWidth="2" className="cursor-pointer hover:fill-gray-800" />
                  <text x="880" y="295" textAnchor="middle" fill="#10B981" fontSize="12">Wind</text>
                  <text x="880" y="310" textAnchor="middle" fill="#9CA3AF" fontSize="9">300 kW</text>
                </g>

                {/* BESS */}
                <g onClick={() => setSelectedComponent({ type: "DER_BESS", name: "Battery Energy Storage" })}>
                  <rect x="980" y="260" width="100" height="60" fill="#1F2937" stroke="#3B82F6" strokeWidth="2" className="cursor-pointer hover:fill-gray-800" />
                  <text x="1030" y="285" textAnchor="middle" fill="#3B82F6" fontSize="12">BESS</text>
                  <text x="1030" y="305" textAnchor="middle" fill="#9CA3AF" fontSize="9">200 kWh</text>
                </g>
              </g>

              {/* Command Execution path */}
              <line x1="440" y1="565" x2="540" y2="480" stroke="#EF4444" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="540" y1="480" x2="680" y2="450" stroke="#EF4444" strokeWidth="2" strokeDasharray="5,5" />

              {/* Command Execution box */}
              <g onClick={() => setSelectedComponent({ type: "COMMAND", name: "Command Execution" })}>
                <rect x="490" y="460" width="140" height="50" fill="#1F2937" stroke="#EF4444" strokeWidth="2" className="cursor-pointer hover:fill-gray-800" />
                <text x="560" y="485" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="bold">Command</text>
                <text x="560" y="500" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="bold">Execution</text>
              </g>

              {/* DER connections */}
              <line x1="680" y1="450" x2="730" y2="320" stroke="#FBBF24" strokeWidth="2" />
              <line x1="730" y1="450" x2="880" y2="325" stroke="#10B981" strokeWidth="2" />
              <line x1="780" y1="450" x2="1030" y2="320" stroke="#3B82F6" strokeWidth="2" />

              {/* Firewall indication */}
              <rect x="150" y="380" width="340" height="150" fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="10,5" opacity="0.5" />
              <text x="160" y="375" fill="#EF4444" fontSize="10">Firewall Zone</text>
            </svg>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <h3 className="text-lg font-bold text-white mb-4">Component Details</h3>
            {selectedComponent ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Type</p>
                  <p className="text-lg font-bold text-neon-blue">{selectedComponent.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="text-white">{selectedComponent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Status</p>
                  <Badge variant="success">Online</Badge>
                </div>
                <div className="pt-4 border-t border-gray-800">
                  <p className="text-xs text-gray-500">
                    Click any component in the diagram to view details and perform actions.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Click any component in the diagram to view details
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
