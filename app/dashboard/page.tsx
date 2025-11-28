'use client';

import { useEffect, useState } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import DerCard from '@/components/scada/DerCard';
import AlarmPanel from '@/components/scada/AlarmPanel';
import { Zap, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DashboardPage() {
  const [telemetryData, setTelemetryData] = useState<any[]>([]);
  const [ders, setDers] = useState<any[]>([
    {
      id: '1',
      name: 'Solar Farm A',
      type: 'PV',
      status: 'ONLINE',
      pMax: 5000,
      pActual: 4250,
      curtailmentPercent: 15,
    },
    {
      id: '2',
      name: 'Wind Turbine 1',
      type: 'WIND',
      status: 'ONLINE',
      pMax: 3000,
      pActual: 2800,
      curtailmentPercent: 0,
    },
    {
      id: '3',
      name: 'BESS Unit 1',
      type: 'BESS',
      status: 'CURTAILED',
      pMax: 2000,
      pActual: 1000,
      curtailmentPercent: 50,
    },
  ]);

  const [alarms, setAlarms] = useState<any[]>([
    {
      id: '1',
      timestamp: new Date(),
      severity: 'CRITICAL',
      title: 'High Line Loading',
      message: 'Feeder F-123 loading at 95% - curtailment recommended',
      asset: 'Feeder F-123',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 300000),
      severity: 'WARNING',
      title: 'Voltage Deviation',
      message: 'Bus voltage at 1.05 p.u. - approaching upper limit',
      asset: 'Bus B-456',
    },
  ]);

  // Simulate real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      const newDataPoint = {
        time: new Date().toLocaleTimeString(),
        voltage: 230 + Math.random() * 10,
        current: 100 + Math.random() * 20,
        loading: 75 + Math.random() * 15,
        curtailment: 10 + Math.random() * 10,
      };

      setTelemetryData((prev) => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-20); // Keep last 20 points
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const totalGeneration = ders.reduce((sum, der) => sum + der.pActual, 0);
  const totalCapacity = ders.reduce((sum, der) => sum + der.pMax, 0);
  const avgCurtailment = ders.reduce((sum, der) => sum + der.curtailmentPercent, 0) / ders.length;
  const activeAlarms = alarms.filter((a) => a.severity === 'CRITICAL' || a.severity === 'ALARM').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-scada-cyan neon-text">Dashboard</h1>
        <p className="text-scada-blue/70 mt-1">Real-time system overview and monitoring</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Generation"
          value={totalGeneration.toFixed(0)}
          unit="kW"
          icon={Zap}
          status="normal"
          trend="up"
          trendValue="+5.2%"
        />
        <MetricCard
          title="System Capacity"
          value={`${((totalGeneration / totalCapacity) * 100).toFixed(1)}`}
          unit="%"
          icon={TrendingUp}
          status="normal"
        />
        <MetricCard
          title="Avg Curtailment"
          value={avgCurtailment.toFixed(1)}
          unit="%"
          icon={Activity}
          status={avgCurtailment > 20 ? 'warning' : 'normal'}
        />
        <MetricCard
          title="Active Alarms"
          value={activeAlarms}
          unit="alarms"
          icon={AlertTriangle}
          status={activeAlarms > 0 ? 'critical' : 'normal'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Telemetry Chart */}
        <div className="scada-panel">
          <h2 className="text-lg font-bold text-scada-cyan mb-4">Real-Time Telemetry</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={telemetryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
              <XAxis
                dataKey="time"
                stroke="#00d4ff"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#00d4ff" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#060918',
                  border: '1px solid #00d4ff',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="voltage"
                stroke="#00ffff"
                strokeWidth={2}
                dot={false}
                name="Voltage (V)"
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#00ff88"
                strokeWidth={2}
                dot={false}
                name="Current (A)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Loading & Curtailment Chart */}
        <div className="scada-panel">
          <h2 className="text-lg font-bold text-scada-cyan mb-4">Loading & Curtailment</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={telemetryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
              <XAxis
                dataKey="time"
                stroke="#00d4ff"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#00d4ff" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#060918',
                  border: '1px solid #00d4ff',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="loading"
                stroke="#ffdd00"
                strokeWidth={2}
                dot={false}
                name="Loading (%)"
              />
              <Line
                type="monotone"
                dataKey="curtailment"
                stroke="#ff3366"
                strokeWidth={2}
                dot={false}
                name="Curtailment (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DER Status */}
      <div>
        <h2 className="text-xl font-bold text-scada-cyan mb-4">DER Status Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ders.map((der) => (
            <DerCard key={der.id} {...der} />
          ))}
        </div>
      </div>

      {/* Active Alarms */}
      <div>
        <h2 className="text-xl font-bold text-scada-cyan mb-4">Active Alarms</h2>
        <AlarmPanel
          alarms={alarms}
          onAcknowledge={(id) => {
            setAlarms((prev) => prev.filter((a) => a.id !== id));
          }}
        />
      </div>
    </div>
  );
}
