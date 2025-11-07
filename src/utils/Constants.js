/**
 * Application Constants
 * Central configuration for API endpoints, intervals, and app settings
 */

// API Configuration - UPDATE THESE WITH YOUR ACTUAL IP ADDRESS
export const API_CONFIG = {
  nodeJs: 'http://192.168.1.100:3000',
  flask: 'http://192.168.1.100:5001',
  dataSource: 'dataset', // 'dataset' or 'realistic'
  pollInterval: 1000, // 1 second
  connectionCheckInterval: 5000, // 5 seconds
  requestTimeout: 5000, // 5 seconds
};

// Data Source Endpoints
export const NODE_ENDPOINTS = {
  SIMPLE: '/simple', // Dataset distribution (V=12.76V, I=19.99A)
  DATA: '/data', // Realistic battery physics (V=3.7V, I=-2A)
  BATCH: '/batch', // Batch data samples
  HEALTH: '/health', // Service health check
};

export const FLASK_ENDPOINTS = {
  PREDICT: '/predict', // LSTM SOC prediction
  STATUS: '/status', // Engine status & statistics
  HISTORY: '/predict/history', // Prediction history
  POLL_START: '/data/poll/start', // Start auto-polling
  BUFFER_CLEAR: '/buffer/clear', // Clear data buffer
  HEALTH: '/health', // Service health check
};

// Chart Configuration
export const CHART_CONFIG = {
  MAX_DATA_POINTS: 50, // Maximum points to display for performance
  UPDATE_INTERVAL: 1000, // Chart update interval (ms)
  COLORS: {
    voltage: '#4CAF50',
    current: '#2196F3',
    temperature: '#FF9800',
    soc: '#9C27B0',
    grid: '#444',
    text: '#FFF',
    background: '#1a1a1a',
  },
};

// SOC Color Ranges
export const SOC_COLORS = {
  CRITICAL: '#F44336', // < 20%
  LOW: '#FF9800', // 20-40%
  MEDIUM: '#FFC107', // 40-60%
  GOOD: '#8BC34A', // 60-80%
  EXCELLENT: '#4CAF50', // > 80%
};

// Battery Parameter Ranges
export const BATTERY_RANGES = {
  voltage: { min: 0, max: 15, unit: 'V' },
  current: { min: -30, max: 30, unit: 'A' },
  temperature: { min: -20, max: 60, unit: '°C' },
  soc: { min: 0, max: 100, unit: '%' },
};

// Activity Log Types
export const LOG_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  SYSTEM: 'system',
};

// Theme Colors
export const COLORS = {
  primary: '#2196F3',
  secondary: '#4CAF50',
  accent: '#FF9800',
  background: '#121212',
  surface: '#1E1E1E',
  card: '#2a2a2a',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  border: '#333',
  shadow: '#000',
};

// App Settings Defaults
export const DEFAULT_SETTINGS = {
  apiEndpoint: API_CONFIG.nodeJs,
  flaskEndpoint: API_CONFIG.flask,
  dataSource: 'dataset',
  pollInterval: 1000,
  chartMaxPoints: 50,
  enableNotifications: true,
  theme: 'dark',
};

export default {
  API_CONFIG,
  NODE_ENDPOINTS,
  FLASK_ENDPOINTS,
  CHART_CONFIG,
  SOC_COLORS,
  BATTERY_RANGES,
  LOG_TYPES,
  COLORS,
  DEFAULT_SETTINGS,
};
