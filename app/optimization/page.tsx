'use client';

import { useState } from 'react';
import { Brain, Play, CheckCircle, AlertCircle, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface OptimizationResult {
  derId: string;
  derName: string;
  currentCurtailment: number;
  recommendedCurtailment: number;
  expectedReduction: number;
}

export default function OptimizationPage() {
  const [selectedMethod, setSelectedMethod] = useState('LINEAR_PROGRAMMING');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<OptimizationResult[] | null>(null);
  const [metrics, setMetrics] = useState({
    executionTime: 0,
    iterations: 0,
    convergence: 0,
    objective: '',
  });

  const runOptimization = async () => {
    setIsRunning(true);
    setResults(null);

    // Simulate optimization process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock results
    const mockResults: OptimizationResult[] = [
      {
        derId: '1',
        derName: 'Solar Farm A',
        currentCurtailment: 15,
        recommendedCurtailment: 20,
        expectedReduction: 250,
      },
      {
        derId: '2',
        derName: 'Wind Turbine 1',
        currentCurtailment: 0,
        recommendedCurtailment: 5,
        expectedReduction: 150,
      },
      {
        derId: '3',
        derName: 'BESS Unit 1',
        currentCurtailment: 50,
        recommendedCurtailment: 30,
        expectedReduction: -400,
      },
      {
        derId: '4',
        derName: 'Solar Farm B',
        currentCurtailment: 5,
        recommendedCurtailment: 10,
        expectedReduction: 200,
      },
      {
        derId: '6',
        derName: 'BESS Unit 2',
        currentCurtailment: 0,
        recommendedCurtailment: 5,
        expectedReduction: 125,
      },
    ];

    setResults(mockResults);
    setMetrics({
      executionTime: 1847,
      iterations: 42,
      convergence: 0.9987,
      objective: 'Minimize total curtailment while maintaining grid stability',
    });
    setIsRunning(false);
  };

  const applyRecommendations = () => {
    alert('Recommendations would be sent to Command Execution module');
  };

  const totalReduction = results
    ? results.reduce((sum, r) => sum + r.expectedReduction, 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-scada-cyan neon-text flex items-center space-x-3">
          <Brain className="w-8 h-8" />
          <span>AI Optimization Engine</span>
        </h1>
        <p className="text-scada-blue/70 mt-1">
          Compute optimal curtailment using advanced algorithms
        </p>
      </div>

      {/* Configuration */}
      <div className="scada-panel">
        <h2 className="text-lg font-bold text-scada-cyan mb-4">
          Optimization Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Method Selection */}
          <div>
            <label className="scada-label block mb-3">Optimization Method</label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="scada-input w-full"
              disabled={isRunning}
            >
              <option value="LINEAR_PROGRAMMING">Linear Programming (LP)</option>
              <option value="DYNAMIC_PROGRAMMING">Dynamic Programming (DP)</option>
              <option value="GENETIC_ALGORITHM">Genetic Algorithm (GA)</option>
              <option value="DEEP_RL">Deep Reinforcement Learning (DRL)</option>
              <option value="GRADIENT_DESCENT">Gradient Descent</option>
            </select>
            <p className="text-xs text-scada-blue/50 mt-2">
              {selectedMethod === 'LINEAR_PROGRAMMING' &&
                'Fast, deterministic optimization for linear constraints'}
              {selectedMethod === 'DYNAMIC_PROGRAMMING' &&
                'Optimal for multi-stage decision problems'}
              {selectedMethod === 'GENETIC_ALGORITHM' &&
                'Evolutionary approach for complex non-linear problems'}
              {selectedMethod === 'DEEP_RL' &&
                'Neural network-based learning for adaptive control'}
              {selectedMethod === 'GRADIENT_DESCENT' &&
                'Iterative optimization for differentiable objectives'}
            </p>
          </div>

          {/* Constraints */}
          <div>
            <label className="scada-label block mb-3">Constraints</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm text-scada-blue">
                <input
                  type="checkbox"
                  defaultChecked
                  className="form-checkbox rounded bg-scada-darker border-scada-blue"
                  disabled={isRunning}
                />
                <span>Voltage limits (0.95 - 1.05 p.u.)</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-scada-blue">
                <input
                  type="checkbox"
                  defaultChecked
                  className="form-checkbox rounded bg-scada-darker border-scada-blue"
                  disabled={isRunning}
                />
                <span>Thermal limits (max 100% loading)</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-scada-blue">
                <input
                  type="checkbox"
                  defaultChecked
                  className="form-checkbox rounded bg-scada-darker border-scada-blue"
                  disabled={isRunning}
                />
                <span>Minimize total curtailment</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-scada-blue">
                <input
                  type="checkbox"
                  className="form-checkbox rounded bg-scada-darker border-scada-blue"
                  disabled={isRunning}
                />
                <span>Maintain N-1 contingency</span>
              </label>
            </div>
          </div>
        </div>

        {/* Run Button */}
        <div className="mt-6">
          <button
            onClick={runOptimization}
            disabled={isRunning}
            className="scada-button-success flex items-center space-x-2"
          >
            {isRunning ? (
              <>
                <div className="loading-spinner"></div>
                <span>Running Optimization...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Run Optimization</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="scada-panel">
              <div className="scada-label mb-2">Execution Time</div>
              <div className="text-2xl font-bold text-scada-cyan">
                {metrics.executionTime} <span className="text-sm">ms</span>
              </div>
            </div>
            <div className="scada-panel">
              <div className="scada-label mb-2">Iterations</div>
              <div className="text-2xl font-bold text-scada-cyan">{metrics.iterations}</div>
            </div>
            <div className="scada-panel">
              <div className="scada-label mb-2">Convergence</div>
              <div className="text-2xl font-bold text-scada-green">
                {(metrics.convergence * 100).toFixed(2)}%
              </div>
            </div>
            <div className="scada-panel">
              <div className="scada-label mb-2">Expected Improvement</div>
              <div
                className={`text-2xl font-bold ${
                  totalReduction > 0 ? 'text-scada-red' : 'text-scada-green'
                }`}
              >
                {totalReduction > 0 ? '+' : ''}
                {totalReduction.toFixed(0)} <span className="text-sm">kW</span>
              </div>
            </div>
          </div>

          {/* Objective */}
          <div className="scada-panel">
            <div className="scada-label mb-2">Optimization Objective</div>
            <p className="text-scada-blue">{metrics.objective}</p>
          </div>

          {/* Recommendations Table */}
          <div className="scada-panel">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-scada-cyan">
                Recommended Curtailment
              </h2>
              <button onClick={applyRecommendations} className="scada-button-success">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Apply to Field
              </button>
            </div>

            <table className="scada-table">
              <thead>
                <tr>
                  <th>DER Name</th>
                  <th>Current</th>
                  <th>Recommended</th>
                  <th>Change</th>
                  <th>Impact</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => {
                  const change = result.recommendedCurtailment - result.currentCurtailment;
                  return (
                    <tr key={result.derId}>
                      <td className="font-medium text-scada-cyan">{result.derName}</td>
                      <td>{result.currentCurtailment.toFixed(1)}%</td>
                      <td className="font-bold text-scada-yellow">
                        {result.recommendedCurtailment.toFixed(1)}%
                      </td>
                      <td>
                        <span
                          className={`font-semibold ${
                            change > 0 ? 'text-scada-red' : change < 0 ? 'text-scada-green' : ''
                          }`}
                        >
                          {change > 0 ? '+' : ''}
                          {change.toFixed(1)}%
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          {result.expectedReduction > 0 ? (
                            <TrendingDown className="w-4 h-4 text-scada-red" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-scada-green rotate-180" />
                          )}
                          <span
                            className={
                              result.expectedReduction > 0
                                ? 'text-scada-red'
                                : 'text-scada-green'
                            }
                          >
                            {result.expectedReduction > 0 ? '+' : ''}
                            {result.expectedReduction.toFixed(0)} kW
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Help */}
      {!results && !isRunning && (
        <div className="scada-panel">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-scada-blue flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-scada-cyan mb-2">How it works</h3>
              <ul className="text-sm text-scada-blue/70 space-y-1 list-disc list-inside">
                <li>Select an optimization method based on your requirements</li>
                <li>Configure constraints to match grid operating limits</li>
                <li>Run optimization to compute optimal DER curtailment</li>
                <li>Review recommendations and expected improvements</li>
                <li>Apply to field to send commands to DER inverters</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
