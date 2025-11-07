/**
 * Connection Manager
 * Monitors network connectivity and service availability
 */

import NetInfo from '@react-native-community/netinfo';
import ApiService from './ApiService';
import { API_CONFIG } from '../utils/Constants';

class ConnectionManager {
  constructor() {
    this.listeners = [];
    this.connectionState = {
      isConnected: false,
      nodeConnected: false,
      flaskConnected: false,
      lastCheck: null,
    };
    this.checkInterval = null;
    this.netInfoUnsubscribe = null;
  }

  /**
   * Initialize connection monitoring
   */
  initialize() {
    // Monitor device network connectivity
    this.netInfoUnsubscribe = NetInfo.addEventListener(state => {
      const wasConnected = this.connectionState.isConnected;
      this.connectionState.isConnected = state.isConnected;

      // Notify listeners of connection change
      if (wasConnected !== state.isConnected) {
        this.notifyListeners();

        // If reconnected, check services immediately
        if (state.isConnected) {
          this.checkServices();
        } else {
          // If disconnected, mark services as unavailable
          this.connectionState.nodeConnected = false;
          this.connectionState.flaskConnected = false;
          this.notifyListeners();
        }
      }
    });

    // Start periodic service checks
    this.startPeriodicChecks();
  }

  /**
   * Start periodic service health checks
   */
  startPeriodicChecks() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      this.checkServices();
    }, API_CONFIG.connectionCheckInterval);

    // Initial check
    this.checkServices();
  }

  /**
   * Stop periodic service checks
   */
  stopPeriodicChecks() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Check service availability
   */
  async checkServices() {
    if (!this.connectionState.isConnected) {
      return;
    }

    try {
      const results = await ApiService.checkAllServices();

      const nodeChanged = this.connectionState.nodeConnected !== results.node.connected;
      const flaskChanged = this.connectionState.flaskConnected !== results.flask.connected;

      this.connectionState.nodeConnected = results.node.connected;
      this.connectionState.flaskConnected = results.flask.connected;
      this.connectionState.lastCheck = new Date();

      // Notify listeners if status changed
      if (nodeChanged || flaskChanged) {
        this.notifyListeners();
      }

      return results;
    } catch (error) {
      console.error('Service check error:', error);
      return null;
    }
  }

  /**
   * Get current connection state
   */
  getConnectionState() {
    return { ...this.connectionState };
  }

  /**
   * Add connection state listener
   */
  addListener(callback) {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners of state change
   */
  notifyListeners() {
    const state = this.getConnectionState();
    this.listeners.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }

  /**
   * Check if all services are connected
   */
  isFullyConnected() {
    return (
      this.connectionState.isConnected &&
      this.connectionState.nodeConnected &&
      this.connectionState.flaskConnected
    );
  }

  /**
   * Check if any service is connected
   */
  isPartiallyConnected() {
    return (
      this.connectionState.isConnected &&
      (this.connectionState.nodeConnected || this.connectionState.flaskConnected)
    );
  }

  /**
   * Get connection status message
   */
  getStatusMessage() {
    if (!this.connectionState.isConnected) {
      return 'No internet connection';
    }

    if (this.isFullyConnected()) {
      return 'All services connected';
    }

    if (this.connectionState.nodeConnected && !this.connectionState.flaskConnected) {
      return 'Flask service unavailable';
    }

    if (!this.connectionState.nodeConnected && this.connectionState.flaskConnected) {
      return 'Node.js service unavailable';
    }

    return 'Services unavailable';
  }

  /**
   * Cleanup and stop monitoring
   */
  cleanup() {
    this.stopPeriodicChecks();

    if (this.netInfoUnsubscribe) {
      this.netInfoUnsubscribe();
      this.netInfoUnsubscribe = null;
    }

    this.listeners = [];
  }
}

// Export singleton instance
export default new ConnectionManager();
