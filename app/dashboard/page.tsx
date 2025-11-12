"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Wind, Battery, Activity, AlertTriangle, TrendingUp } from "lucide-react";
import RealTimeChart from "@/components/dashboard/RealTimeChart";
import DerMixChart from "@/components/dashboard/DerMixChart";
import LoadingChart from "@/components/dashboard/LoadingChart";
import AlarmsSummary from "@/components/dashboard/AlarmsSummary";
import MetricCard from "@/components/dashboard/MetricCard";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalGeneration: 0,
    totalCapacity: 0,
    netLoad: 0,
    congestionLevel: 0,
    activeCurtailment: 0,
    activeAlarms: 0
  });

  const [wsConnected, setWsConnected] = useState(false);
  const [telemetryData, setTelemetryData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch initial metrics
    fetchMetrics();

    // Setup WebSocket connection
    const ws = new WebSocket("ws://localhost:3000/api/ws");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setWsConnected(true);
      ws.send(JSON.stringify({ type: "subscribe" }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "telemetry") {
          setTelemetryData((prev) => [...prev.slice(-50), data.payload]);
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setWsConnected(false);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setWsConnected(false);
    };

    // Cleanup
    return () => {
      ws.close();
    };
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/der");
      const data = await response.json();

      if (data.success) {
        const ders = data.data;
        const totalGeneration = ders.reduce((sum: number, der: any) => sum + der.pActual, 0);
        const totalCapacity = ders.reduce((sum: number, der: any) => sum + der.pMax, 0);
        const activeCurtailment = ders.filter((der: any) => der.curtailmentPercent > 0).length;

        setMetrics({
          totalGeneration,
          totalCapacity,
          netLoad: totalGeneration * 0.85, // Mock calculation
          congestionLevel: ((totalGeneration / totalCapacity) * 100) || 0,
          activeCurtailment,
          activeAlarms: 0 // Will be fetched separately
        });
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time SCADA monitoring and control</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`status-indicator ${wsConnected ? "status-online" : "status-offline"}`}></div>
          <span className="text-sm text-gray-400">
            {wsConnected ? "Live Data" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Total Generation"
          value={`${metrics.totalGeneration.toFixed(1)} kW`}
          icon={Zap}
          trend="+5.2%"
          color="neon-blue"
        />
        <MetricCard
          title="Total Capacity"
          value={`${metrics.totalCapacity.toFixed(1)} kW`}
          icon={TrendingUp}
          color="neon-cyan"
        />
        <MetricCard
          title="Net Load"
          value={`${metrics.netLoad.toFixed(1)} kW`}
          icon={Activity}
          trend="-2.1%"
          color="green"
        />
        <MetricCard
          title="Congestion"
          value={`${metrics.congestionLevel.toFixed(0)}%`}
          icon={AlertTriangle}
          color={metrics.congestionLevel > 85 ? "red" : "yellow"}
        />
        <MetricCard
          title="Active Curtailment"
          value={`${metrics.activeCurtailment}`}
          icon={Wind}
          color="orange"
        />
        <MetricCard
          title="Active Alarms"
          value={`${metrics.activeAlarms}`}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Real-Time Power Generation</CardTitle>
            <CardDescription>Active power output from all DERs</CardDescription>
          </CardHeader>
          <CardContent>
            <RealTimeChart data={telemetryData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DER Mix</CardTitle>
            <CardDescription>Generation by resource type</CardDescription>
          </CardHeader>
          <CardContent>
            <DerMixChart />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Line Loading</CardTitle>
            <CardDescription>Real-time feeder loading percentages</CardDescription>
          </CardHeader>
          <CardContent>
            <LoadingChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Alarms</CardTitle>
            <CardDescription>Recent system alarms and events</CardDescription>
          </CardHeader>
          <CardContent>
            <AlarmsSummary />
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current operational status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-400">SCADA Server</p>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Historian</p>
              <Badge variant="success">Running</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">AI Engine</p>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Command Execution</p>
              <Badge variant="success">Ready</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
