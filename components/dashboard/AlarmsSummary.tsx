"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getSeverityColor } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export default function AlarmsSummary() {
  const [alarms, setAlarms] = useState<any[]>([]);

  useEffect(() => {
    fetchAlarms();
  }, []);

  const fetchAlarms = async () => {
    try {
      const response = await fetch("/api/alarm?status=ACTIVE&limit=5");
      const result = await response.json();

      if (result.success) {
        setAlarms(result.data);
      }
    } catch (error) {
      console.error("Error fetching alarms:", error);
    }
  };

  const severityVariants: Record<string, any> = {
    INFO: "info",
    WARNING: "warning",
    CRITICAL: "destructive",
    EMERGENCY: "destructive",
  };

  return (
    <div className="space-y-3">
      {alarms.length > 0 ? (
        alarms.map((alarm) => (
          <div key={alarm.id} className={`alarm-row p-3 rounded alarm-${alarm.severity.toLowerCase()}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${getSeverityColor(alarm.severity)}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{alarm.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(alarm.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <Badge variant={severityVariants[alarm.severity] || "secondary"} className="ml-2">
                {alarm.severity}
              </Badge>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-32 text-gray-500">
          <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
          <p>No active alarms</p>
        </div>
      )}
    </div>
  );
}
