/**
 * Data Context
 * Global state management for battery data and SOC predictions
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import ApiService from '../services/ApiService';
import DataProcessor from '../services/DataProcessor';
import ConnectionManager from '../services/ConnectionManager';
import { trimArray, generateId } from '../utils/Helpers';
import { API_CONFIG, CHART_CONFIG, LOG_TYPES } from '../utils/Constants';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Connection state
  const [connectionState, setConnectionState] = useState({
    isConnected: false,
    nodeConnected: false,
    flaskConnected: false,
    lastCheck: null,
  });

  // Data streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);

  // Real-time data
  const [currentBatteryData, setCurrentBatteryData] = useState(null);
  const [currentSOC, setCurrentSOC] = useState(null);

  // History data
  const [batteryHistory, setBatteryHistory] = useState([]);
  const [socHistory, setSOCHistory] = useState([]);

  // System status
  const [bufferStatus, setBufferStatus] = useState(0);
  const [predictionCount, setPredictionCount] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Activity log
  const [activityLog, setActivityLog] = useState([]);

  // Settings
  const [dataSource, setDataSource] = useState(API_CONFIG.dataSource);

  // Polling intervals
  const pollingInterval = useRef(null);
  const predictionInterval = useRef(null);

  /**
   * Add log entry
   */
  const addLog = useCallback((message, type = LOG_TYPES.INFO) => {
    const logEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      message,
      type,
    };

    setActivityLog(prev => trimArray([...prev, logEntry], 100));
  }, []);

  /**
   * Update connection state
   */
  const handleConnectionChange = useCallback((state) => {
    setConnectionState(state);

    // Log connection changes
    if (state.nodeConnected && state.flaskConnected) {
      addLog('All services connected', LOG_TYPES.SUCCESS);
    } else if (!state.isConnected) {
      addLog('No internet connection', LOG_TYPES.ERROR);
    } else if (!state.nodeConnected) {
      addLog('Node.js service unavailable', LOG_TYPES.WARNING);
    } else if (!state.flaskConnected) {
      addLog('Flask service unavailable', LOG_TYPES.WARNING);
    }
  }, [addLog]);

  /**
   * Initialize connection manager
   */
  useEffect(() => {
    ConnectionManager.initialize();
    const unsubscribe = ConnectionManager.addListener(handleConnectionChange);

    return () => {
      unsubscribe();
      ConnectionManager.cleanup();
    };
  }, [handleConnectionChange]);

  /**
   * Fetch battery data
   */
  const fetchBatteryData = useCallback(async () => {
    if (!connectionState.nodeConnected) {
      return null;
    }

    try {
      const rawData = await ApiService.getBatteryData(dataSource);
      const processed = DataProcessor.processBatteryData(rawData);

      if (processed) {
        setCurrentBatteryData(processed);
        setBatteryHistory(prev =>
          trimArray([...prev, processed], CHART_CONFIG.MAX_DATA_POINTS)
        );
        return processed;
      }
    } catch (error) {
      addLog(`Error fetching battery data: ${error.message}`, LOG_TYPES.ERROR);
      return null;
    }
  }, [connectionState.nodeConnected, dataSource, addLog]);

  /**
   * Fetch SOC prediction
   */
  const fetchSOCPrediction = useCallback(async () => {
    if (!connectionState.flaskConnected) {
      return null;
    }

    try {
      const rawData = await ApiService.getSOCPrediction();
      const processed = DataProcessor.processSOCData(rawData);

      if (processed) {
        setCurrentSOC(processed);
        setSOCHistory(prev =>
          trimArray([...prev, processed], CHART_CONFIG.MAX_DATA_POINTS)
        );
        setBufferStatus(processed.buffer_size);
        setPredictionCount(prev => prev + 1);

        if (!modelLoaded) {
          setModelLoaded(true);
          addLog('LSTM model loaded successfully', LOG_TYPES.SUCCESS);
        }

        return processed;
      }
    } catch (error) {
      addLog(`Error fetching SOC prediction: ${error.message}`, LOG_TYPES.ERROR);
      return null;
    }
  }, [connectionState.flaskConnected, modelLoaded, addLog]);

  /**
   * Start data streaming
   */
  const startStreaming = useCallback(async () => {
    if (isStreaming) {
      return;
    }

    if (!connectionState.nodeConnected) {
      addLog('Cannot start streaming: Node.js service unavailable', LOG_TYPES.ERROR);
      return;
    }

    setIsStreaming(true);
    addLog('Started data streaming', LOG_TYPES.SUCCESS);

    // Initial fetch
    await fetchBatteryData();

    // Start polling
    pollingInterval.current = setInterval(() => {
      fetchBatteryData();
    }, API_CONFIG.pollInterval);
  }, [isStreaming, connectionState.nodeConnected, fetchBatteryData, addLog]);

  /**
   * Stop data streaming
   */
  const stopStreaming = useCallback(() => {
    if (!isStreaming) {
      return;
    }

    setIsStreaming(false);
    addLog('Stopped data streaming', LOG_TYPES.INFO);

    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  }, [isStreaming, addLog]);

  /**
   * Start SOC predictions
   */
  const startPredicting = useCallback(async () => {
    if (isPredicting) {
      return;
    }

    if (!connectionState.flaskConnected) {
      addLog('Cannot start predictions: Flask service unavailable', LOG_TYPES.ERROR);
      return;
    }

    setIsPredicting(true);
    addLog('Started SOC predictions', LOG_TYPES.SUCCESS);

    // Try to start auto-polling on server
    try {
      await ApiService.startAutoPolling();
    } catch (error) {
      console.warn('Auto-polling not started:', error);
    }

    // Initial fetch
    await fetchSOCPrediction();

    // Start polling
    predictionInterval.current = setInterval(() => {
      fetchSOCPrediction();
    }, API_CONFIG.pollInterval);
  }, [isPredicting, connectionState.flaskConnected, fetchSOCPrediction, addLog]);

  /**
   * Stop SOC predictions
   */
  const stopPredicting = useCallback(() => {
    if (!isPredicting) {
      return;
    }

    setIsPredicting(false);
    addLog('Stopped SOC predictions', LOG_TYPES.INFO);

    if (predictionInterval.current) {
      clearInterval(predictionInterval.current);
      predictionInterval.current = null;
    }
  }, [isPredicting, addLog]);

  /**
   * Clear all data and buffers
   */
  const clearData = useCallback(async () => {
    setBatteryHistory([]);
    setSOCHistory([]);
    setCurrentBatteryData(null);
    setCurrentSOC(null);
    setPredictionCount(0);
    setBufferStatus(0);

    addLog('Cleared all data', LOG_TYPES.INFO);

    // Clear buffer on server
    if (connectionState.flaskConnected) {
      try {
        await ApiService.clearBuffer();
        addLog('Cleared server buffer', LOG_TYPES.SUCCESS);
      } catch (error) {
        addLog(`Error clearing server buffer: ${error.message}`, LOG_TYPES.ERROR);
      }
    }
  }, [connectionState.flaskConnected, addLog]);

  /**
   * Change data source
   */
  const changeDataSource = useCallback((source) => {
    setDataSource(source);
    addLog(`Data source changed to: ${source}`, LOG_TYPES.INFO);
  }, [addLog]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopStreaming();
      stopPredicting();
    };
  }, [stopStreaming, stopPredicting]);

  const value = {
    // Connection state
    connectionState,

    // Data streaming
    isStreaming,
    isPredicting,
    startStreaming,
    stopStreaming,
    startPredicting,
    stopPredicting,

    // Real-time data
    currentBatteryData,
    currentSOC,

    // History data
    batteryHistory,
    socHistory,

    // System status
    bufferStatus,
    predictionCount,
    modelLoaded,

    // Activity log
    activityLog,

    // Settings
    dataSource,
    changeDataSource,

    // Actions
    clearData,
    addLog,
    fetchBatteryData,
    fetchSOCPrediction,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataContext;
