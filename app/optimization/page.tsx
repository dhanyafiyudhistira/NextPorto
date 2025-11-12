"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Play, CheckCircle, AlertCircle } from "lucide-react";

export default function OptimizationPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [optimizationType, setOptimizationType] = useState("LINEAR_PROGRAMMING");

  const runOptimization = async () => {
    setLoading(true);
    try {
      // Step 1: Preprocess data
      const preprocessResponse = await fetch("/api/ai/preprocess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ derIds: null, timeRange: null }),
      });
      const preprocessData = await preprocessResponse.json();

      if (!preprocessData.success) {
        throw new Error("Preprocessing failed");
      }

      // Step 2: Run optimization
      const optimizeResponse = await fetch("/api/ai/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optimizationType,
          inputData: preprocessData.data,
          constraints: {
            maxVoltage: 1.05,
            minVoltage: 0.95,
            maxLoading: 100,
          },
          objective: "MINIMIZE_CURTAILMENT",
        }),
      });
      const optimizeData = await optimizeResponse.json();

      if (optimizeData.success) {
        setResult(optimizeData.data);
      } else {
        throw new Error("Optimization failed");
      }
    } catch (error) {
      console.error("Optimization error:", error);
      alert("Optimization failed");
    } finally {
      setLoading(false);
    }
  };

  const applyOptimization = async () => {
    if (!result || !result.recommendations) return;

    setLoading(true);
    try {
      for (const rec of result.recommendations) {
        await fetch("/api/command/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "INVERTER_SET_CURTAILMENT",
            derId: rec.derId,
            value: rec.recommendedCurtailment,
          }),
        });
      }
      alert("Optimization applied successfully");
    } catch (error) {
      console.error("Error applying optimization:", error);
      alert("Failed to apply optimization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">AI Optimization Engine</h1>
        <p className="text-gray-400 mt-1">
          Compute optimal curtailment using advanced algorithms
        </p>
      </div>

      {/* Optimization Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-neon-blue" />
            Run Optimization
          </CardTitle>
          <CardDescription>
            Select algorithm and run optimization to compute optimal DER curtailment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {[
              "LINEAR_PROGRAMMING",
              "DYNAMIC_PROGRAMMING",
              "GENETIC_ALGORITHM",
              "DEEP_REINFORCEMENT_LEARNING",
              "MIXED_INTEGER_PROGRAMMING",
            ].map((type) => (
              <Button
                key={type}
                variant={optimizationType === type ? "default" : "outline"}
                onClick={() => setOptimizationType(type)}
                size="sm"
              >
                {type.replace("_", " ")}
              </Button>
            ))}
          </div>

          <Button
            onClick={runOptimization}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            {loading ? "Running Optimization..." : "Run Optimization"}
          </Button>
        </CardContent>
      </Card>

      {/* Optimization Results */}
      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Optimization Results</CardTitle>
              <CardDescription>
                Algorithm: {optimizationType} • Converged in {result.convergenceTime?.toFixed(2)}s
                • Iterations: {result.iterations}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="scada-panel p-4">
                  <p className="text-sm text-gray-400">Objective Value</p>
                  <p className="text-2xl font-bold text-neon-blue">
                    {result.objectiveValue?.toFixed(2)}
                  </p>
                </div>
                <div className="scada-panel p-4">
                  <p className="text-sm text-gray-400">DERs Affected</p>
                  <p className="text-2xl font-bold text-white">
                    {result.recommendations?.length || 0}
                  </p>
                </div>
                <div className="scada-panel p-4">
                  <p className="text-sm text-gray-400">Status</p>
                  <Badge variant="success">Completed</Badge>
                </div>
              </div>

              <Button onClick={applyOptimization} disabled={loading} className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Apply to Field
              </Button>
            </CardContent>
          </Card>

          {/* Recommendations Table */}
          <Card>
            <CardHeader>
              <CardTitle>DER Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.recommendations?.map((rec: any, index: number) => (
                  <div
                    key={index}
                    className="scada-panel p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-white">{rec.derName}</p>
                      <p className="text-sm text-gray-400">{rec.reason}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-400">Current</p>
                        <p className="text-sm font-bold text-white">
                          {rec.currentCurtailment?.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Recommended</p>
                        <p className="text-sm font-bold text-neon-blue">
                          {rec.recommendedCurtailment?.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Power</p>
                        <p className="text-sm font-bold text-white">
                          {rec.recommendedPower?.toFixed(1)} kW
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!result && (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Run optimization to see results</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
