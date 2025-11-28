'use client';

import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  status?: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

export default function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  status = 'normal',
  trend,
  trendValue,
}: MetricCardProps) {
  const statusColors = {
    normal: 'border-scada-green',
    warning: 'border-scada-yellow',
    critical: 'border-scada-red',
  };

  const trendColors = {
    up: 'text-scada-green',
    down: 'text-scada-red',
    stable: 'text-scada-blue',
  };

  return (
    <div className={`scada-panel border-l-4 ${statusColors[status]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="scada-label">{title}</div>
        {Icon && <Icon className="w-5 h-5 text-scada-blue/50" />}
      </div>

      <div className="flex items-baseline space-x-2">
        <div className="scada-value">
          {value}
        </div>
        {unit && <div className="text-sm text-scada-blue/70">{unit}</div>}
      </div>

      {trend && trendValue && (
        <div className={`text-xs mt-2 ${trendColors[trend]}`}>
          {trend === 'up' && '↑ '}
          {trend === 'down' && '↓ '}
          {trend === 'stable' && '→ '}
          {trendValue}
        </div>
      )}
    </div>
  );
}
