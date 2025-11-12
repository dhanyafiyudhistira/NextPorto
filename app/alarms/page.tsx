"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function AlarmsPage() {
  const [alarms, setAlarms] = useState<any[]>([]);
  const [filter, setFilter] = useState("ACTIVE");

  useEffect(() => {
    fetchAlarms();
  }, [filter]);

  const fetchAlarms = async () => {
    try {
      const response = await fetch(`/api/alarm?status=${filter}&limit=50`);
      const result = await response.json();
      if (result.success) {
        setAlarms(result.data);
      }
    } catch (error) {
      console.error("Error fetching alarms:", error);
    }
  };

  const acknowledgeAlarm = async (alarmId: string) => {
    try {
      const response = await fetch("/api/alarm/acknowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alarmId,
          userId: "mock-user-id",
          comment: "Acknowledged from HMI",
        }),
      });

      if (response.ok) {
        fetchAlarms();
      }
    } catch (error) {
      console.error("Error acknowledging alarm:", error);
    }
  };

  const severityVariants: Record<string, any> = {
    INFO: "info",
    WARNING: "warning",
    CRITICAL: "destructive",
    EMERGENCY: "destructive",
  };

  const statusVariants: Record<string, any> = {
    ACTIVE: "destructive",
    ACKNOWLEDGED: "warning",
    CLEARED: "success",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Alarms & Events</h1>
        <p className="text-gray-400 mt-1">Monitor system alarms and audit trail</p>
      </div>

      {/* Filter Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            {["ACTIVE", "ACKNOWLEDGED", "CLEARED"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                onClick={() => setFilter(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alarms List */}
      <Card>
        <CardHeader>
          <CardTitle>Alarms ({alarms.length})</CardTitle>
          <CardDescription>
            Showing {filter.toLowerCase()} alarms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`alarm-row p-4 rounded alarm-${alarm.severity.toLowerCase()}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-white">{alarm.message}</p>
                        <Badge variant={severityVariants[alarm.severity]}>
                          {alarm.severity}
                        </Badge>
                        <Badge variant={statusVariants[alarm.status]}>
                          {alarm.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        {alarm.description || "No description"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Asset: {alarm.asset?.name || "N/A"}</span>
                        <span>Time: {formatDateTime(alarm.timestamp)}</span>
                        {alarm.alarmCode && <span>Code: {alarm.alarmCode}</span>}
                      </div>
                    </div>
                  </div>
                  {alarm.status === "ACTIVE" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => acknowledgeAlarm(alarm.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {alarms.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No {filter.toLowerCase()} alarms</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
