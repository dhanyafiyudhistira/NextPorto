'use client';

import { Sun, Wind, Battery, Power } from 'lucide-react';
import { motion } from 'framer-motion';

interface DerCardProps {
  id: string;
  name: string;
  type: 'PV' | 'WIND' | 'BESS' | 'GENSET';
  status: 'ONLINE' | 'OFFLINE' | 'FAULT' | 'CURTAILED';
  pMax: number;
  pActual: number;
  curtailmentPercent: number;
  onControl?: (id: string, action: string) => void;
}

const derIcons = {
  PV: Sun,
  WIND: Wind,
  BESS: Battery,
  GENSET: Power,
};

const statusStyles = {
  ONLINE: 'status-online border-scada-green',
  OFFLINE: 'status-offline border-gray-500',
  FAULT: 'status-fault border-scada-red',
  CURTAILED: 'status-curtailed border-scada-yellow',
};

export default function DerCard({
  id,
  name,
  type,
  status,
  pMax,
  pActual,
  curtailmentPercent,
  onControl,
}: DerCardProps) {
  const Icon = derIcons[type];
  const loadingPercent = (pActual / pMax) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`scada-panel border-l-4 ${statusStyles[status]}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon className={`w-8 h-8 ${statusStyles[status].split(' ')[0]}`} />
          <div>
            <h3 className="font-bold text-scada-cyan">{name}</h3>
            <p className="text-xs text-scada-blue/70">{type}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-semibold ${statusStyles[status]}`}>
          {status}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="scada-label">Power Output</div>
          <div className="text-xl font-bold text-scada-cyan">
            {pActual.toFixed(1)} kW
          </div>
          <div className="text-xs text-scada-blue/70">
            Max: {pMax.toFixed(1)} kW
          </div>
        </div>

        <div>
          <div className="scada-label">Curtailment</div>
          <div className={`text-xl font-bold ${curtailmentPercent > 0 ? 'text-scada-yellow' : 'text-scada-green'}`}>
            {curtailmentPercent.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Loading bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-scada-blue/70 mb-1">
          <span>Loading</span>
          <span>{loadingPercent.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-scada-darker rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${loadingPercent}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full ${
              loadingPercent > 90 ? 'bg-scada-red' :
              loadingPercent > 70 ? 'bg-scada-yellow' :
              'bg-scada-green'
            }`}
          />
        </div>
      </div>

      {/* Controls */}
      {onControl && status === 'ONLINE' && (
        <div className="flex space-x-2">
          <button
            onClick={() => onControl(id, 'curtail')}
            className="flex-1 scada-button text-xs"
          >
            Set Curtailment
          </button>
          <button
            onClick={() => onControl(id, 'disable')}
            className="flex-1 scada-button-danger text-xs"
          >
            Disable
          </button>
        </div>
      )}
    </motion.div>
  );
}
