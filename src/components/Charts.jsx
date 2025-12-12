import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

/**
 * FlowTimeseriesChart - Shows flow over time
 */
export const FlowTimeseriesChart = ({ timeseries }) => {
  const data = timeseries.slice(-20).map((item, idx) => ({
    index: idx,
    flow: item.detectors.total_flow,
    timestamp: new Date(item.timestamp_actual).toLocaleTimeString()
  }));

  return (
    <div className="border-2 border-steel-600 bg-steel-800 p-4">
      <h3 className="text-steel-300 font-mono text-sm uppercase mb-4">
        Flow Timeseries
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#495057" />
          <XAxis
            dataKey="timestamp"
            stroke="#6c757d"
            style={{ fontSize: '10px', fontFamily: 'monospace' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke="#6c757d"
            style={{ fontSize: '10px', fontFamily: 'monospace' }}
            label={{ value: 'veh/min', angle: -90, position: 'insideLeft', style: { fill: '#6c757d', fontSize: 10 } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#212529',
              border: '1px solid #495057',
              borderRadius: 0,
              fontFamily: 'monospace',
              fontSize: 12
            }}
            labelStyle={{ color: '#adb5bd' }}
          />
          <Line
            type="monotone"
            dataKey="flow"
            stroke="#adb5bd"
            strokeWidth={2}
            dot={{ fill: '#adb5bd', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * OccupancyGauge - Circular gauge for occupancy percentage
 */
export const OccupancyGauge = ({ occupancy, threshold = 85 }) => {
  const isHigh = occupancy > threshold;
  const percentage = Math.min(100, Math.max(0, occupancy));

  // Calculate arc path
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="border-2 border-steel-600 bg-steel-800 p-4">
      <h3 className="text-steel-300 font-mono text-sm uppercase mb-4">
        Occupancy Gauge
      </h3>
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="transform -rotate-90 w-48 h-48">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="#343a40"
              strokeWidth="16"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke={isHigh ? '#ef4444' : '#adb5bd'}
              strokeWidth="16"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-4xl font-bold font-mono ${isHigh ? 'text-alert-red' : 'text-steel-100'}`}>
              {percentage.toFixed(0)}%
            </div>
            <div className="text-steel-400 text-xs font-mono mt-1">OCCUPANCY</div>
            {isHigh && (
              <div className="text-alert-red text-xs font-mono mt-2">⚠ HIGH</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * QueueBarChart - Bar chart of queue lengths by lane
 */
export const QueueBarChart = ({ lanes }) => {
  const data = lanes.map(lane => ({
    lane: lane.id.replace(/_/g, ' '),
    queue: lane.queue
  }));

  return (
    <div className="border-2 border-steel-600 bg-steel-800 p-4">
      <h3 className="text-steel-300 font-mono text-sm uppercase mb-4">
        Queue Lengths
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#495057" />
          <XAxis
            dataKey="lane"
            stroke="#6c757d"
            style={{ fontSize: '10px', fontFamily: 'monospace' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke="#6c757d"
            style={{ fontSize: '10px', fontFamily: 'monospace' }}
            label={{ value: 'vehicles', angle: -90, position: 'insideLeft', style: { fill: '#6c757d', fontSize: 10 } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#212529',
              border: '1px solid #495057',
              borderRadius: 0,
              fontFamily: 'monospace',
              fontSize: 12
            }}
            labelStyle={{ color: '#adb5bd' }}
          />
          <Bar dataKey="queue">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.queue > 15 ? '#ef4444' : entry.queue > 8 ? '#fbbf24' : '#adb5bd'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * CameraPlaceholder - Placeholder for camera/map snapshot
 */
export const CameraPlaceholder = ({ intersectionId }) => {
  return (
    <div className="border-2 border-steel-600 bg-steel-800 p-4">
      <h3 className="text-steel-300 font-mono text-sm uppercase mb-4">
        Camera View / Map
      </h3>
      <div className="aspect-video bg-steel-900 border border-steel-700 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-steel-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <div className="text-steel-500 font-mono text-sm">{intersectionId}</div>
          <div className="text-steel-600 font-mono text-xs mt-1">Camera feed unavailable</div>
        </div>
      </div>
    </div>
  );
};
