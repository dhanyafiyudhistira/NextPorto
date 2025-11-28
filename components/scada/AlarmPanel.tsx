'use client';

import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Alarm {
  id: string;
  timestamp: Date;
  severity: 'INFO' | 'WARNING' | 'ALARM' | 'CRITICAL';
  title: string;
  message: string;
  asset?: string;
}

interface AlarmPanelProps {
  alarms: Alarm[];
  onAcknowledge?: (id: string) => void;
  compact?: boolean;
}

const severityConfig = {
  INFO: {
    icon: Info,
    class: 'alarm-info',
  },
  WARNING: {
    icon: AlertTriangle,
    class: 'alarm-warning',
  },
  ALARM: {
    icon: AlertCircle,
    class: 'alarm-warning',
  },
  CRITICAL: {
    icon: AlertCircle,
    class: 'alarm-critical',
  },
};

export default function AlarmPanel({
  alarms,
  onAcknowledge,
  compact = false,
}: AlarmPanelProps) {
  if (alarms.length === 0) {
    return (
      <div className="scada-panel text-center py-8">
        <Info className="w-12 h-12 text-scada-blue/30 mx-auto mb-2" />
        <p className="text-scada-blue/70">No active alarms</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {alarms.map((alarm) => {
          const config = severityConfig[alarm.severity];
          const Icon = config.icon;

          return (
            <motion.div
              key={alarm.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`${config.class} border rounded-lg p-4`}
            >
              <div className="flex items-start space-x-3">
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold">{alarm.title}</h4>
                    {onAcknowledge && (
                      <button
                        onClick={() => onAcknowledge(alarm.id)}
                        className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {!compact && (
                    <>
                      <p className="text-sm opacity-90 mb-2">{alarm.message}</p>

                      <div className="flex items-center space-x-4 text-xs opacity-70">
                        <span>{new Date(alarm.timestamp).toLocaleString()}</span>
                        {alarm.asset && <span>Asset: {alarm.asset}</span>}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
