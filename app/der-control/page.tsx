"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { Zap, Wind, Battery, Power, PowerOff } from "lucide-react";

export default function DerControlPage() {
  const [ders, setDers] = useState<any[]>([]);
  const [selectedDer, setSelectedDer] = useState<any>(null);
  const [curtailmentValue, setCurtailmentValue] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDers();
  }, []);

  const fetchDers = async () => {
    try {
      const response = await fetch("/api/der");
      const result = await response.json();
      if (result.success) {
        setDers(result.data);
      }
    } catch (error) {
      console.error("Error fetching DERs:", error);
    }
  };

  const handleSetCurtailment = async (derId: string, value: number) => {
    setLoading(true);
    try {
      const response = await fetch("/api/command/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "INVERTER_SET_CURTAILMENT",
          derId,
          value,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Curtailment command sent successfully");
        fetchDers();
      }
    } catch (error) {
      console.error("Error sending command:", error);
      alert("Failed to send command");
    } finally {
      setLoading(false);
    }
  };

  const handleEnableDisable = async (derId: string, enable: boolean) => {
    setLoading(true);
    try {
      const response = await fetch("/api/der", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: derId,
          isEnabled: enable,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert(`DER ${enable ? "enabled" : "disabled"} successfully`);
        fetchDers();
      }
    } catch (error) {
      console.error("Error updating DER:", error);
      alert("Failed to update DER");
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "PV":
        return Zap;
      case "WIND":
        return Wind;
      case "BESS":
        return Battery;
      default:
        return Zap;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">DER Control</h1>
        <p className="text-gray-400 mt-1">Monitor and control distributed energy resources</p>
      </div>

      {/* DER List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {ders.map((der) => {
          const Icon = getIconForType(der.type);
          const curtailmentApplied = der.pMax * (1 - der.curtailmentPercent / 100);

          return (
            <Card key={der.id} className="hover:border-neon-blue/50 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-neon-blue" />
                    <CardTitle className="text-lg">{der.name}</CardTitle>
                  </div>
                  <Badge variant={der.isEnabled ? "success" : "secondary"}>
                    {der.isEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <CardDescription>
                  {der.type} • Status:{" "}
                  <span className={getStatusColor(der.status)}>{der.status}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Power Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Actual Power</p>
                    <p className="text-xl font-bold text-white">{der.pActual.toFixed(1)} kW</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Max Capacity</p>
                    <p className="text-xl font-bold text-white">{der.pMax.toFixed(1)} kW</p>
                  </div>
                </div>

                {/* Curtailment Info */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Curtailment</span>
                    <span className="text-white font-medium">{der.curtailmentPercent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${der.curtailmentPercent}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Available: {curtailmentApplied.toFixed(1)} kW
                  </p>
                </div>

                {/* Control Actions */}
                <div className="space-y-3 pt-2 border-t border-gray-800">
                  <div className="space-y-2">
                    <Label htmlFor={`curtailment-${der.id}`}>Set Curtailment (%)</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`curtailment-${der.id}`}
                        type="number"
                        min="0"
                        max="100"
                        defaultValue={der.curtailmentPercent}
                        onChange={(e) => setCurtailmentValue(parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <Button
                        onClick={() =>
                          handleSetCurtailment(
                            der.id,
                            curtailmentValue || der.curtailmentPercent
                          )
                        }
                        disabled={loading || !der.isControllable}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={der.isEnabled ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleEnableDisable(der.id, !der.isEnabled)}
                      disabled={loading}
                      className="flex-1"
                    >
                      {der.isEnabled ? (
                        <>
                          <PowerOff className="w-4 h-4 mr-2" />
                          Disable
                        </>
                      ) : (
                        <>
                          <Power className="w-4 h-4 mr-2" />
                          Enable
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {ders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            No DERs configured. Add DERs in the Settings page.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
