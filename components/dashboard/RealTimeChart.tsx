"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RealTimeChartProps {
  data: any[];
}

export default function RealTimeChart({ data }: RealTimeChartProps) {
  // Format data for chart
  const chartData = data.slice(-20).map((item, index) => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    value: item.value || 0,
  }));

  return (
    <div className="h-64">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#00f0ff"
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Waiting for real-time data...
        </div>
      )}
    </div>
  );
}
