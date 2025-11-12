"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = {
  PV: "#FBBF24",
  WIND: "#10B981",
  BESS: "#3B82F6",
  DIESEL_GEN: "#EF4444",
  GAS_TURBINE: "#8B5CF6",
};

export default function DerMixChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchDerMix();
  }, []);

  const fetchDerMix = async () => {
    try {
      const response = await fetch("/api/der");
      const result = await response.json();

      if (result.success) {
        const ders = result.data;

        // Group by type and sum actual power
        const mixMap = ders.reduce((acc: any, der: any) => {
          if (!acc[der.type]) {
            acc[der.type] = 0;
          }
          acc[der.type] += der.pActual;
          return acc;
        }, {});

        const chartData = Object.entries(mixMap).map(([type, value]) => ({
          name: type,
          value: value as number,
        }));

        setData(chartData);
      }
    } catch (error) {
      console.error("Error fetching DER mix:", error);
    }
  };

  return (
    <div className="h-64">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#888"} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
                color: "#fff",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          No DER data available
        </div>
      )}
    </div>
  );
}
