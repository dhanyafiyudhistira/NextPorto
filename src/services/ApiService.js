/**
 * API Service
 * Handles all HTTP requests to Node.js and Flask backends
 */

import { API_CONFIG, NODE_ENDPOINTS, FLASK_ENDPOINTS } from '../utils/Constants';

class ApiService {
  constructor() {
    this.nodeBaseUrl = API_CONFIG.nodeJs;
    this.flaskBaseUrl = API_CONFIG.flask;
    this.timeout = API_CONFIG.requestTimeout;
  }

  /**
   * Generic fetch with timeout
   */
  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Update API endpoints
   */
  updateEndpoints(nodeUrl, flaskUrl) {
    this.nodeBaseUrl = nodeUrl;
    this.flaskBaseUrl = flaskUrl;
  }

  // ==================== Node.js API Methods ====================

  /**
   * Get battery data from dataset distribution
   */
  async getBatteryDataSimple() {
    const url = `${this.nodeBaseUrl}${NODE_ENDPOINTS.SIMPLE}`;
    return await this.fetchWithTimeout(url);
  }

  /**
   * Get battery data from realistic physics simulation
   */
  async getBatteryDataRealistic() {
    const url = `${this.nodeBaseUrl}${NODE_ENDPOINTS.DATA}`;
    return await this.fetchWithTimeout(url);
  }

  /**
   * Get battery data based on configured source
   */
  async getBatteryData(dataSource = 'dataset') {
    if (dataSource === 'realistic') {
      return await this.getBatteryDataRealistic();
    }
    return await this.getBatteryDataSimple();
  }

  /**
   * Get batch of battery data samples
   */
  async getBatteryDataBatch(count = 10) {
    const url = `${this.nodeBaseUrl}${NODE_ENDPOINTS.BATCH}?n=${count}`;
    return await this.fetchWithTimeout(url);
  }

  /**
   * Check Node.js service health
   */
  async checkNodeHealth() {
    const url = `${this.nodeBaseUrl}${NODE_ENDPOINTS.HEALTH}`;
    return await this.fetchWithTimeout(url);
  }

  // ==================== Flask API Methods ====================

  /**
   * Get SOC prediction from LSTM model
   */
  async getSOCPrediction() {
    const url = `${this.flaskBaseUrl}${FLASK_ENDPOINTS.PREDICT}`;
    return await this.fetchWithTimeout(url);
  }

  /**
   * Get LSTM engine status and statistics
   */
  async getFlaskStatus() {
    const url = `${this.flaskBaseUrl}${FLASK_ENDPOINTS.STATUS}`;
    return await this.fetchWithTimeout(url);
  }

  /**
   * Get prediction history
   */
  async getPredictionHistory() {
    const url = `${this.flaskBaseUrl}${FLASK_ENDPOINTS.HISTORY}`;
    return await this.fetchWithTimeout(url);
  }

  /**
   * Start auto-polling on Flask server
   */
  async startAutoPolling() {
    const url = `${this.flaskBaseUrl}${FLASK_ENDPOINTS.POLL_START}`;
    return await this.fetchWithTimeout(url, { method: 'POST' });
  }

  /**
   * Clear data buffer on Flask server
   */
  async clearBuffer() {
    const url = `${this.flaskBaseUrl}${FLASK_ENDPOINTS.BUFFER_CLEAR}`;
    return await this.fetchWithTimeout(url, { method: 'POST' });
  }

  /**
   * Check Flask service health
   */
  async checkFlaskHealth() {
    const url = `${this.flaskBaseUrl}${FLASK_ENDPOINTS.HEALTH}`;
    return await this.fetchWithTimeout(url);
  }

  // ==================== Combined Operations ====================

  /**
   * Check health of both services
   */
  async checkAllServices() {
    const results = {
      node: { connected: false, error: null },
      flask: { connected: false, error: null },
    };

    // Check Node.js
    try {
      await this.checkNodeHealth();
      results.node.connected = true;
    } catch (error) {
      results.node.error = error.message;
    }

    // Check Flask
    try {
      await this.checkFlaskHealth();
      results.flask.connected = true;
    } catch (error) {
      results.flask.error = error.message;
    }

    return results;
  }

  /**
   * Fetch battery data and SOC prediction together
   */
  async fetchAllData(dataSource = 'dataset') {
    try {
      const [batteryData, socData] = await Promise.all([
        this.getBatteryData(dataSource),
        this.getSOCPrediction(),
      ]);

      return {
        success: true,
        batteryData,
        socData,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Export singleton instance
export default new ApiService();
