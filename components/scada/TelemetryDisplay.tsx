'use client';

import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface TelemetryPoint {
  tagName: string;
  label: string;
  value: number;
  unit: string;
  quality: 'GOOD' | 'BAD' | 'UNCERTAIN';
  min?: number;
  max?: number;
  warning?: number;
  critical?: number;
}

interface TelemetryDisplayProps {
  points: TelemetryPoint[];
  title?: string;
}

export default function TelemetryDisplay({ points, title }: TelemetryDisplayProps) {
  const getValueColor = (point: TelemetryPoint) => {
    if (point.quality !== 'GOOD') return 'text-gray-500';

    if (point.critical && (point.value >= point.critical || point.value <= -point.critical)) {
      return 'text-scada-red';
    }

    if (point.warning && (point.value >= point.warning || point.value <= -point.warning)) {
      return 'text-scada-yellow';
    }

    return 'text-scada-cyan';
  };

  const getQualityIndicator = (quality: string) => {
    switch (quality) {
      case 'GOOD':
        return <div className="w-2 h-2 bg-scada-green rounded-full" />;
      case 'BAD':
        return <div className="w-2 h-2 bg-scada-red rounded-full animate-pulse" />;
      case 'UNCERTAIN':
        return <div className="w-2 h-2 bg-scada-yellow rounded-full" />;
      default:
        return null;
    }
  };

  return (
    <div className="scada-panel">
      {title && (
        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-scada-blue/30">
          <Activity className="w-5 h-5 text-scada-cyan" />
          <h3 className="font-bold text-scada-cyan">{title}</h3>
        </div>
      )}

      <div className="space-y-3">
        {points.map((point, index) => (
          <motion.div
            key={point.tagName}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between py-2 border-b border-scada-blue/10 last:border-0"
          >
            <div className="flex items-center space-x-3">
              {getQualityIndicator(point.quality)}
              <div>
                <div className="text-sm font-medium text-scada-blue">
                  {point.label}
                </div>
                <div className="text-xs text-scada-blue/50">
                  {point.tagName}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-lg font-bold ${getValueColor(point)}`}>
                {point.value.toFixed(2)} <span className="text-sm">{point.unit}</span>
              </div>
              {point.min !== undefined && point.max !== undefined && (
                <div className="text-xs text-scada-blue/50">
                  Range: {point.min}–{point.max}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
