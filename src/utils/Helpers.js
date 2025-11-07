/**
 * Utility Helper Functions
 */

import { SOC_COLORS, BATTERY_RANGES } from './Constants';

/**
 * Get color based on SOC percentage
 * @param {number} socPercentage - SOC value (0-100)
 * @returns {string} - Color hex code
 */
export const getSOCColor = (socPercentage) => {
  if (socPercentage === null || socPercentage === undefined) {
    return SOC_COLORS.MEDIUM;
  }

  if (socPercentage < 20) return SOC_COLORS.CRITICAL;
  if (socPercentage < 40) return SOC_COLORS.LOW;
  if (socPercentage < 60) return SOC_COLORS.MEDIUM;
  if (socPercentage < 80) return SOC_COLORS.GOOD;
  return SOC_COLORS.EXCELLENT;
};

/**
 * Format timestamp to readable time
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} - Formatted time (HH:MM:SS)
 */
export const formatTime = (timestamp) => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Format timestamp to full date and time
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} - Formatted date and time
 */
export const formatDateTime = (timestamp) => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

/**
 * Format number to fixed decimal places
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted number
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return Number(value).toFixed(decimals);
};

/**
 * Validate battery data object
 * @param {object} data - Battery data to validate
 * @returns {boolean} - True if valid
 */
export const validateBatteryData = (data) => {
  if (!data) return false;

  const hasRequiredFields =
    data.hasOwnProperty('voltage') &&
    data.hasOwnProperty('current') &&
    data.hasOwnProperty('temperature');

  if (!hasRequiredFields) return false;

  // Check if values are within reasonable ranges
  const { voltage, current, temperature } = data;
  const vRange = BATTERY_RANGES.voltage;
  const cRange = BATTERY_RANGES.current;
  const tRange = BATTERY_RANGES.temperature;

  return (
    voltage >= vRange.min && voltage <= vRange.max &&
    current >= cRange.min && current <= cRange.max &&
    temperature >= tRange.min && temperature <= tRange.max
  );
};

/**
 * Validate SOC prediction object
 * @param {object} data - SOC prediction data
 * @returns {boolean} - True if valid
 */
export const validateSOCPrediction = (data) => {
  if (!data) return false;

  return (
    data.hasOwnProperty('soc_percentage') &&
    typeof data.soc_percentage === 'number' &&
    data.soc_percentage >= 0 &&
    data.soc_percentage <= 100
  );
};

/**
 * Trim array to maximum length (FIFO)
 * @param {Array} array - Array to trim
 * @param {number} maxLength - Maximum length
 * @returns {Array} - Trimmed array
 */
export const trimArray = (array, maxLength) => {
  if (array.length <= maxLength) {
    return array;
  }
  return array.slice(array.length - maxLength);
};

/**
 * Calculate average of array values
 * @param {Array} values - Array of numbers
 * @returns {number} - Average value
 */
export const calculateAverage = (values) => {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
};

/**
 * Generate unique ID
 * @returns {string} - Unique identifier
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Check if error is network error
 * @param {Error} error - Error object
 * @returns {boolean} - True if network error
 */
export const isNetworkError = (error) => {
  return (
    error.message.includes('Network') ||
    error.message.includes('timeout') ||
    error.message.includes('Failed to fetch')
  );
};

export default {
  getSOCColor,
  formatTime,
  formatDateTime,
  formatNumber,
  validateBatteryData,
  validateSOCPrediction,
  trimArray,
  calculateAverage,
  generateId,
  debounce,
  isNetworkError,
};
