"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function LoadingChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Mock data - in production, fetch from API
    const mockData = [
      { name: "Feeder A", loading: 78 },
      { name: "Feeder B", loading: 92 },
      { name: "Feeder C", loading: 65 },
      { name: "Feeder D", loading: 88 },
      { name: "Feeder E", loading: 54 },
    ];
    setData(mockData);
  }, []);

  const getColor = (loading: number) => {
    if (loading >= 90) return "#EF4444"; // Red
    if (loading >= 75) return "#F59E0B"; // Orange
    return "#10B981"; // Green
  };

  return (
    <div className="h-64">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
                color: "#fff",
              }}
            />
            <Bar dataKey="loading" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.loading)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          No loading data available
        </div>
      )}
    </div>
  );
}
