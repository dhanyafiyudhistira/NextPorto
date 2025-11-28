'use client';

import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Download, RefreshCw } from 'lucide-react';

// Mock historical data
const generateHistoricalData = (points: number) => {
  const data = [];
  const now = Date.now();
  for (let i = points; i >= 0; i--) {
    const timestamp = new Date(now - i * 60000); // 1-minute intervals
    data.push({
      time: timestamp.toLocaleTimeString(),
      fullTime: timestamp,
      voltage: 230 + Math.sin(i / 10) * 5 + Math.random() * 2,
      current: 100 + Math.cos(i / 15) * 20 + Math.random() * 5,
      power: 4000 + Math.sin(i / 8) * 500 + Math.random() * 200,
      loading: 70 + Math.sin(i / 12) * 15 + Math.random() * 5,
      curtailment: Math.max(0, 10 + Math.sin(i / 20) * 10 + Math.random() * 5),
    });
  }
  return data;
};

export default function HistorianPage() {
  const [timeRange, setTimeRange] = useState('1h');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [data, setData] = useState(generateHistoricalData(60));
  const [compareMode, setCompareMode] = useState(false);

  const refreshData = () => {
    const points = timeRange === '15m' ? 15 : timeRange === '1h' ? 60 : timeRange === '6h' ? 360 : 1440;
    setData(generateHistoricalData(points));
  };

  const exportData = () => {
    const csv = [
      ['Time', 'Voltage (V)', 'Current (A)', 'Power (kW)', 'Loading (%)', 'Curtailment (%)'],
      ...data.map((d) => [
        d.fullTime.toISOString(),
        d.voltage.toFixed(2),
        d.current.toFixed(2),
        d.power.toFixed(2),
        d.loading.toFixed(2),
        d.curtailment.toFixed(2),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historian-data-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-scada-cyan neon-text">Historian</h1>
          <p className="text-scada-blue/70 mt-1">
            Time-series data trends and before/after analysis
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={refreshData} className="scada-button flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button onClick={exportData} className="scada-button flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="scada-panel">
        <div className="flex flex-wrap items-center gap-4">
          {/* Time Range */}
          <div>
            <label className="scada-label block mb-2">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => {
                setTimeRange(e.target.value);
                refreshData();
              }}
              className="scada-input"
            >
              <option value="15m">Last 15 Minutes</option>
              <option value="1h">Last 1 Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
            </select>
          </div>

          {/* Metric Selection */}
          <div>
            <label className="scada-label block mb-2">Display Metrics</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="scada-input"
            >
              <option value="all">All Metrics</option>
              <option value="electrical">Electrical (V, I)</option>
              <option value="power">Power & Loading</option>
              <option value="curtailment">Curtailment</option>
            </select>
          </div>

          {/* Compare Mode */}
          <div>
            <label className="scada-label block mb-2">Compare Mode</label>
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-4 py-2 rounded border transition-colors ${
                compareMode
                  ? 'bg-scada-green/20 border-scada-green text-scada-green'
                  : 'bg-scada-blue/10 border-scada-blue/30 text-scada-blue'
              }`}
            >
              {compareMode ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Date Picker */}
          <div className="flex-1"></div>
          <div>
            <label className="scada-label block mb-2">Custom Date</label>
            <div className="flex items-center space-x-2 scada-input">
              <Calendar className="w-4 h-4 text-scada-blue/50" />
              <input
                type="date"
                className="bg-transparent outline-none text-scada-blue"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Voltage & Current */}
        {(selectedMetric === 'all' || selectedMetric === 'electrical') && (
          <div className="scada-panel">
            <h2 className="text-lg font-bold text-scada-cyan mb-4">
              Voltage & Current Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
                <XAxis dataKey="time" stroke="#00d4ff" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="left" stroke="#00ffff" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#00ff88" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#060918',
                    border: '1px solid #00d4ff',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="voltage"
                  stroke="#00ffff"
                  strokeWidth={2}
                  dot={false}
                  name="Voltage (V)"
                />
                <Line
                  yAxisId="right"
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
        )}

        {/* Power & Loading */}
        {(selectedMetric === 'all' || selectedMetric === 'power') && (
          <div className="scada-panel">
            <h2 className="text-lg font-bold text-scada-cyan mb-4">
              Power Output & Line Loading
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLoading" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffdd00" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ffdd00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
                <XAxis dataKey="time" stroke="#00d4ff" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="left" stroke="#00d4ff" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#ffdd00" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#060918',
                    border: '1px solid #00d4ff',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="power"
                  stroke="#00d4ff"
                  fillOpacity={1}
                  fill="url(#colorPower)"
                  name="Power (kW)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="loading"
                  stroke="#ffdd00"
                  fillOpacity={1}
                  fill="url(#colorLoading)"
                  name="Loading (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Curtailment */}
        {(selectedMetric === 'all' || selectedMetric === 'curtailment') && (
          <div className="scada-panel">
            <h2 className="text-lg font-bold text-scada-cyan mb-4">
              Curtailment History
              {compareMode && (
                <span className="ml-2 text-sm text-scada-green">(Before/After Comparison)</span>
              )}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCurtailment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff3366" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff3366" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
                <XAxis dataKey="time" stroke="#00d4ff" style={{ fontSize: '12px' }} />
                <YAxis stroke="#ff3366" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#060918',
                    border: '1px solid #00d4ff',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="curtailment"
                  stroke="#ff3366"
                  fillOpacity={1}
                  fill="url(#colorCurtailment)"
                  name="Curtailment (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="scada-panel">
          <div className="scada-label mb-2">Avg Voltage</div>
          <div className="scada-value">
            {(data.reduce((sum, d) => sum + d.voltage, 0) / data.length).toFixed(2)}
            <span className="text-lg ml-1">V</span>
          </div>
        </div>
        <div className="scada-panel">
          <div className="scada-label mb-2">Avg Current</div>
          <div className="scada-value">
            {(data.reduce((sum, d) => sum + d.current, 0) / data.length).toFixed(2)}
            <span className="text-lg ml-1">A</span>
          </div>
        </div>
        <div className="scada-panel">
          <div className="scada-label mb-2">Avg Power</div>
          <div className="scada-value">
            {(data.reduce((sum, d) => sum + d.power, 0) / data.length).toFixed(0)}
            <span className="text-lg ml-1">kW</span>
          </div>
        </div>
        <div className="scada-panel">
          <div className="scada-label mb-2">Avg Curtailment</div>
          <div className="scada-value text-scada-yellow">
            {(data.reduce((sum, d) => sum + d.curtailment, 0) / data.length).toFixed(1)}
            <span className="text-lg ml-1">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
