'use client';

import React, { useState, useEffect, useCallback } from 'react';
import BarChart from './BarChart';
import { nilmApi, trainingApi, logsApi } from '@/lib/api';
import type { TimeSeriesSample, ApplianceEstimate, TrainingStatus, ModelStatus } from '@/types';
import styles from './BarChartDashboard.module.css';

const BarChartDashboard: React.FC = () => {
  // State for current sensor readings
  const [currentSample, setCurrentSample] = useState<TimeSeriesSample | null>(null);
  const [currentEstimate, setCurrentEstimate] = useState<ApplianceEstimate | null>(null);

  // State for model and training
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  /**
   * Fetch latest sample from backend
   */
  const fetchSample = useCallback(async () => {
    try {
      const sample = await nilmApi.getSample();
      setCurrentSample(sample);
      setError(null);
    } catch (err) {
      console.error('Error fetching sample:', err);
      setError('Failed to fetch sensor data');
    }
  }, []);

  /**
   * Fetch latest estimate
   */
  const fetchEstimate = useCallback(async () => {
    try {
      const estimate = await nilmApi.getLatestEstimate();
      setCurrentEstimate(estimate);
    } catch (err) {
      console.log('No estimates available yet');
    }
  }, []);

  /**
   * Fetch model status
   */
  const fetchModelStatus = useCallback(async () => {
    try {
      const status = await trainingApi.getModelStatus();
      setModelStatus(status);
    } catch (err) {
      console.error('Error fetching model status:', err);
    }
  }, []);

  /**
   * Fetch training status
   */
  const fetchTrainingStatus = useCallback(async () => {
    try {
      const status = await trainingApi.getTrainingStatus();
      setTrainingStatus(status);
    } catch (err) {
      console.error('Error fetching training status:', err);
    }
  }, []);

  /**
   * Run NILM inference
   */
  const handleRunInference = async () => {
    try {
      setError(null);
      const estimate = await nilmApi.runInference(50);
      setCurrentEstimate(estimate);
    } catch (err: any) {
      console.error('Error running inference:', err);
      setError(err.response?.data?.message || 'Failed to run inference');
    }
  };

  /**
   * Start federated training
   */
  const handleStartTraining = async () => {
    try {
      setError(null);
      const status = await trainingApi.startTraining();
      setTrainingStatus(status);
    } catch (err: any) {
      console.error('Error starting training:', err);
      setError(err.response?.data?.message || 'Failed to start training');
    }
  };

  /**
   * Download CSV export
   */
  const handleDownloadCSV = (type: 'samples' | 'estimates' | 'updates' | 'models') => {
    const url = logsApi.getExportUrl(type);
    window.open(url, '_blank');
  };

  /**
   * Initial data fetch
   */
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchSample(),
        fetchEstimate(),
        fetchModelStatus(),
        fetchTrainingStatus(),
      ]);
      setIsLoading(false);
    };

    initializeData();
  }, [fetchSample, fetchEstimate, fetchModelStatus, fetchTrainingStatus]);

  /**
   * Auto-refresh sensor data
   */
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchSample();
    }, 2000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchSample]);

  /**
   * Poll training status while training is running
   */
  useEffect(() => {
    if (trainingStatus?.status !== 'running') return;

    const interval = setInterval(() => {
      fetchTrainingStatus();
      fetchModelStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, [trainingStatus?.status, fetchTrainingStatus, fetchModelStatus]);

  if (isLoading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  // Prepare data for bar charts
  const applianceData = currentSample
    ? [
        { label: 'Fridge', value: currentSample.fridge, color: '#444' },
        { label: 'Dish Washer', value: currentSample.dishWasher, color: '#555' },
        { label: 'Heater', value: currentSample.electricSpaceHeater, color: '#666' },
        { label: 'Stove', value: currentSample.electricStove, color: '#777' },
        { label: 'Microwave', value: currentSample.microwave, color: '#888' },
        { label: 'Washer/Dryer', value: currentSample.washerDryer, color: '#999' },
      ]
    : [];

  const estimateData = currentEstimate
    ? [
        { label: 'Fridge', value: currentEstimate.fridgePower, color: '#444' },
        { label: 'Dish Washer', value: currentEstimate.dishWasherPower, color: '#555' },
        { label: 'Heater', value: currentEstimate.spaceHeaterPower, color: '#666' },
        { label: 'Stove', value: currentEstimate.stovePower, color: '#777' },
        { label: 'Microwave', value: currentEstimate.microwavePower, color: '#888' },
        { label: 'Washer/Dryer', value: currentEstimate.washerDryerPower, color: '#999' },
      ]
    : [];

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Bar Chart View</h1>
        <p className={styles.subtitle}>Real-time Power Consumption Visualization</p>
      </div>

      {/* Error message */}
      {error && (
        <div className={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Real-time Telemetry Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Current Sensor Readings</h2>

        <div className={styles.chartGrid}>
          {currentSample && (
            <>
              <div className={styles.fullWidth}>
                <BarChart
                  title="All Appliances - Current Power Consumption"
                  data={applianceData}
                  max={3500}
                  unit="W"
                  showTotal={false}
                />
              </div>

              <div className={styles.comparisonChart}>
                <div className={styles.comparisonTitle}>Main Power</div>
                <BarChart
                  title="Aggregate Power Reading"
                  data={[{ label: 'Main', value: currentSample.main, color: '#000' }]}
                  max={5000}
                  unit="W"
                  showTotal={true}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* NILM Estimates Section */}
      {currentEstimate && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>NILM Disaggregation (Estimated)</h2>

          <div className={styles.chartGrid}>
            <div className={styles.fullWidth}>
              <BarChart
                title="Estimated Appliance Power Consumption"
                data={estimateData}
                max={3500}
                unit="W"
                showTotal={false}
              />
            </div>
          </div>

          <div className={styles.statusCard}>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Total Estimated:</span>
              <span className={styles.statusValue}>
                {Math.round(currentEstimate.totalEstimated)} W
              </span>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Actual Main:</span>
              <span className={styles.statusValue}>
                {Math.round(currentEstimate.actualMain)} W
              </span>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Error:</span>
              <span className={styles.statusValue}>
                {Math.abs(
                  Math.round(currentEstimate.totalEstimated - currentEstimate.actualMain)
                )}{' '}
                W (
                {Math.abs(
                  ((currentEstimate.totalEstimated - currentEstimate.actualMain) /
                    currentEstimate.actualMain) *
                    100
                ).toFixed(1)}
                %)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Controls</h2>

        <div className={styles.controls}>
          <button
            className={styles.button}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? '⏸ Pause' : '▶ Resume'} Auto-refresh
          </button>

          <button className={styles.button} onClick={handleRunInference}>
            🔍 Run NILM Inference
          </button>

          <button
            className={styles.button}
            onClick={handleStartTraining}
            disabled={trainingStatus?.status === 'running'}
          >
            {trainingStatus?.status === 'running' ? '⏳ Training...' : '🚀 Start Local Training'}
          </button>
        </div>
      </div>

      {/* Training Status */}
      {trainingStatus && trainingStatus.status !== 'idle' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Training Status</h2>

          <div className={styles.statusCard}>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Status:</span>
              <span className={styles.statusValue}>{trainingStatus.status}</span>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Round:</span>
              <span className={styles.statusValue}>{trainingStatus.roundId}</span>
            </div>
            {trainingStatus.message && (
              <div className={styles.statusRow}>
                <span className={styles.statusLabel}>Message:</span>
                <span className={styles.statusValue}>{trainingStatus.message}</span>
              </div>
            )}

            {trainingStatus.status === 'running' && (
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${trainingStatus.progress}%` }}
                >
                  {trainingStatus.progress}%
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Model Status */}
      {modelStatus && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Global Model Status</h2>

          <div className={styles.statusCard}>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Model Version:</span>
              <span className={styles.statusValue}>v{modelStatus.model.version}</span>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Model Type:</span>
              <span className={styles.statusValue}>{modelStatus.model.type}</span>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Federated Round:</span>
              <span className={styles.statusValue}>{modelStatus.model.roundId}</span>
            </div>
            {modelStatus.model.accuracy && (
              <div className={styles.statusRow}>
                <span className={styles.statusLabel}>Accuracy:</span>
                <span className={styles.statusValue}>
                  {(modelStatus.model.accuracy * 100).toFixed(2)}%
                </span>
              </div>
            )}
            {modelStatus.model.loss && (
              <div className={styles.statusRow}>
                <span className={styles.statusLabel}>Loss:</span>
                <span className={styles.statusValue}>
                  {modelStatus.model.loss.toFixed(4)}
                </span>
              </div>
            )}
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Last Updated:</span>
              <span className={styles.statusValue}>
                {new Date(modelStatus.lastUpdate).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Data Export */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Data Export</h2>

        <div className={styles.controls}>
          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={() => handleDownloadCSV('samples')}
          >
            📥 Export Samples CSV
          </button>

          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={() => handleDownloadCSV('estimates')}
          >
            📥 Export Estimates CSV
          </button>

          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={() => handleDownloadCSV('updates')}
          >
            📥 Export Updates CSV
          </button>

          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={() => handleDownloadCSV('models')}
          >
            📥 Export Models CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarChartDashboard;
