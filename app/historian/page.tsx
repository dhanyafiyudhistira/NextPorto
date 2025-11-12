"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Database, Search } from "lucide-react";

export default function HistorianPage() {
  const [tagName, setTagName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (tagName) params.append("tagName", tagName);
      if (startTime) params.append("startTime", new Date(startTime).toISOString());
      if (endTime) params.append("endTime", new Date(endTime).toISOString());
      params.append("limit", "100");

      const response = await fetch(`/api/historian/read?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching historian data:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = data.map((item) => ({
    timestamp: new Date(item.timestamp).toLocaleTimeString(),
    value: item.value,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Historian</h1>
        <p className="text-gray-400 mt-1">
          Time-series data trends and historical analysis
        </p>
      </div>

      {/* Query Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-neon-blue" />
            Query Historian
          </CardTitle>
          <CardDescription>
            Search time-series data by tag name and time range
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tagName">Tag Name</Label>
              <Input
                id="tagName"
                placeholder="e.g., DER_PV1_P"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={fetchData} disabled={loading} className="w-full">
            <Search className="w-4 h-4 mr-2" />
            {loading ? "Searching..." : "Search"}
          </Button>
        </CardContent>
      </Card>

      {/* Chart */}
      {data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Time-Series Trend</CardTitle>
            <CardDescription>{data.length} data points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="timestamp" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "0.5rem",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#00f0ff"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {data.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No data found. Use the query panel above to search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
