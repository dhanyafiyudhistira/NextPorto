import React, { useState, useEffect, useCallback } from 'react';
import trafficAPI from './services/api';
import PhaseIndicator from './components/PhaseIndicator';
import Timeline from './components/Timeline';
import SummaryCards from './components/SummaryCards';
import LaneTable from './components/LaneTable';
import {
  FlowTimeseriesChart,
  OccupancyGauge,
  QueueBarChart,
  CameraPlaceholder
} from './components/Charts';
import Controls from './components/Controls';

const OCCUPANCY_THRESHOLD = 85; // Alert threshold for occupancy

function App() {
  // State
  const [currentData, setCurrentData] = useState(null);
  const [timeseries, setTimeseries] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [leadSeconds, setLeadSeconds] = useState(5);
  const [updateInterval, setUpdateInterval] = useState(2000); // 2 seconds
  const [useMock, setUseMock] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [alarms, setAlarms] = useState([]);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      const sample = await trafficAPI.getSample(leadSeconds);
      setCurrentData(sample);
      setLastUpdate(new Date());

      // Add to timeseries (keep last 50)
      setTimeseries(prev => [...prev, sample].slice(-50));

      // Check for alarms
      const newAlarms = [];
      if (sample.detectors.occupancy_percent > OCCUPANCY_THRESHOLD) {
        newAlarms.push({
          type: 'HIGH_OCCUPANCY',
          message: `High occupancy: ${sample.detectors.occupancy_percent.toFixed(1)}%`,
          severity: 'warning'
        });
      }
      if (sample.actuators.signal_controller_mode === 'FAULT') {
        newAlarms.push({
          type: 'CONTROLLER_FAULT',
          message: 'Signal controller fault detected',
          severity: 'critical'
        });
      }
      setAlarms(newAlarms);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }, [leadSeconds]);

  // Auto-update effect
  useEffect(() => {
    if (isLive) {
      fetchData(); // Initial fetch
      const interval = setInterval(fetchData, updateInterval);
      return () => clearInterval(interval);
    }
  }, [isLive, updateInterval, fetchData]);

  // Update API mock mode
  useEffect(() => {
    trafficAPI.setMockMode(useMock);
  }, [useMock]);

  // Export snapshot
  const handleExportSnapshot = () => {
    const snapshot = {
      timestamp: new Date().toISOString(),
      intersection_id: currentData?.intersection_id,
      current_data: currentData,
      timeseries: timeseries.slice(-10),
      alarms
    };

    const dataStr = JSON.stringify(snapshot, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scada-snapshot-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!currentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-steel-400 font-mono text-xl mb-4">Loading SCADA System...</div>
          <div className="w-12 h-12 border-4 border-steel-600 border-t-steel-100 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-mono text-steel-100">
              TRAFFIC SCADA
            </h1>
            <p className="text-steel-400 font-mono text-sm mt-1">
              Intersection {currentData.intersection_id} • Industrial Monitoring System
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-steel-400 text-xs font-mono">Last Update</div>
              <div className="text-steel-100 font-mono text-sm">
                {lastUpdate?.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Alarms Banner */}
      {alarms.length > 0 && (
        <div className="mb-6 space-y-2">
          {alarms.map((alarm, idx) => (
            <div
              key={idx}
              className={`border-2 p-4 flex items-center gap-3 ${
                alarm.severity === 'critical'
                  ? 'border-alert-red bg-alert-red/10 text-alert-red'
                  : 'border-alert-amber bg-alert-amber/10 text-alert-amber'
              }`}
            >
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1 font-mono">
                <span className="font-bold">{alarm.type}:</span> {alarm.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid */}
      <div className="space-y-6">
        {/* Controls */}
        <Controls
          isLive={isLive}
          onToggleLive={() => setIsLive(!isLive)}
          leadSeconds={leadSeconds}
          onLeadChange={setLeadSeconds}
          updateInterval={updateInterval}
          onIntervalChange={setUpdateInterval}
          useMock={useMock}
          onToggleMock={() => setUseMock(!useMock)}
          onExportSnapshot={handleExportSnapshot}
        />

        {/* Phase Indicator */}
        <PhaseIndicator
          actual={currentData.actual}
          predicted={currentData.predicted}
          mode={currentData.actuators.signal_controller_mode}
        />

        {/* Timeline */}
        <Timeline timeseries={timeseries} />

        {/* Summary Cards */}
        <SummaryCards
          detectors={currentData.detectors}
          occupancyThreshold={OCCUPANCY_THRESHOLD}
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FlowTimeseriesChart timeseries={timeseries} />
          <OccupancyGauge
            occupancy={currentData.detectors.occupancy_percent}
            threshold={OCCUPANCY_THRESHOLD}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QueueBarChart lanes={currentData.detectors.lanes} />
          <CameraPlaceholder intersectionId={currentData.intersection_id} />
        </div>

        {/* Lane Table */}
        <LaneTable lanes={currentData.detectors.lanes} />
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-steel-700 text-center text-steel-500 text-xs font-mono">
        Traffic SCADA System v1.0 • {useMock ? 'Mock Data' : 'Live API'} •
        Occupancy Threshold: {OCCUPANCY_THRESHOLD}%
      </footer>
    </div>
  );
}

export default App;
