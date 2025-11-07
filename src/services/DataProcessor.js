/**
 * Data Processor
 * Processes and validates battery and SOC data
 */

import { validateBatteryData, validateSOCPrediction, generateId } from '../utils/Helpers';

class DataProcessor {
  /**
   * Process raw battery data from API
   */
  processBatteryData(rawData) {
    if (!rawData) {
      return null;
    }

    try {
      const processed = {
        id: generateId(),
        timestamp: rawData.timestamp || new Date().toISOString(),
        voltage: parseFloat(rawData.voltage) || 0,
        current: parseFloat(rawData.current) || 0,
        temperature: parseFloat(rawData.temperature) || 25,
        lstm_inputs: rawData.lstm_inputs || {},
      };

      // Validate processed data
      if (!validateBatteryData(processed)) {
        console.warn('Invalid battery data:', processed);
        return null;
      }

      return processed;
    } catch (error) {
      console.error('Error processing battery data:', error);
      return null;
    }
  }

  /**
   * Process raw SOC prediction data from API
   */
  processSOCData(rawData) {
    if (!rawData) {
      return null;
    }

    try {
      const processed = {
        id: generateId(),
        timestamp: rawData.timestamp || new Date().toISOString(),
        soc: parseFloat(rawData.soc) || 0,
        soc_percentage: parseFloat(rawData.soc_percentage) || 0,
        prediction_time_ms: parseFloat(rawData.prediction_time_ms) || 0,
        buffer_size: parseInt(rawData.buffer_size) || 0,
        mode: rawData.mode || 'unknown',
      };

      // Validate processed data
      if (!validateSOCPrediction(processed)) {
        console.warn('Invalid SOC data:', processed);
        return null;
      }

      return processed;
    } catch (error) {
      console.error('Error processing SOC data:', error);
      return null;
    }
  }

  /**
   * Process batch of battery data
   */
  processBatteryDataBatch(rawBatch) {
    if (!Array.isArray(rawBatch)) {
      return [];
    }

    return rawBatch
      .map(item => this.processBatteryData(item))
      .filter(item => item !== null);
  }

  /**
   * Extract chart data from battery history
   */
  extractChartData(batteryHistory, maxPoints = 50) {
    if (!batteryHistory || batteryHistory.length === 0) {
      return {
        labels: [],
        voltage: [],
        current: [],
        temperature: [],
      };
    }

    // Take last N points for performance
    const data = batteryHistory.slice(-maxPoints);

    return {
      labels: data.map(item => {
        const date = new Date(item.timestamp);
        return date.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }),
      voltage: data.map(item => item.voltage),
      current: data.map(item => item.current),
      temperature: data.map(item => item.temperature),
    };
  }

  /**
   * Extract SOC chart data from prediction history
   */
  extractSOCChartData(socHistory, maxPoints = 50) {
    if (!socHistory || socHistory.length === 0) {
      return {
        labels: [],
        soc: [],
      };
    }

    // Take last N points for performance
    const data = socHistory.slice(-maxPoints);

    return {
      labels: data.map(item => {
        const date = new Date(item.timestamp);
        return date.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }),
      soc: data.map(item => item.soc_percentage),
    };
  }

  /**
   * Calculate statistics from battery data
   */
  calculateBatteryStats(batteryHistory) {
    if (!batteryHistory || batteryHistory.length === 0) {
      return {
        voltage: { min: 0, max: 0, avg: 0 },
        current: { min: 0, max: 0, avg: 0 },
        temperature: { min: 0, max: 0, avg: 0 },
      };
    }

    const voltages = batteryHistory.map(d => d.voltage);
    const currents = batteryHistory.map(d => d.current);
    const temperatures = batteryHistory.map(d => d.temperature);

    return {
      voltage: {
        min: Math.min(...voltages),
        max: Math.max(...voltages),
        avg: voltages.reduce((a, b) => a + b, 0) / voltages.length,
      },
      current: {
        min: Math.min(...currents),
        max: Math.max(...currents),
        avg: currents.reduce((a, b) => a + b, 0) / currents.length,
      },
      temperature: {
        min: Math.min(...temperatures),
        max: Math.max(...temperatures),
        avg: temperatures.reduce((a, b) => a + b, 0) / temperatures.length,
      },
    };
  }

  /**
   * Calculate SOC statistics
   */
  calculateSOCStats(socHistory) {
    if (!socHistory || socHistory.length === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        current: 0,
      };
    }

    const socValues = socHistory.map(d => d.soc_percentage);
    const current = socHistory[socHistory.length - 1].soc_percentage;

    return {
      min: Math.min(...socValues),
      max: Math.max(...socValues),
      avg: socValues.reduce((a, b) => a + b, 0) / socValues.length,
      current,
    };
  }
}

// Export singleton instance
export default new DataProcessor();
