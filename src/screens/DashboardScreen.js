/**
 * Dashboard Screen
 * Main monitoring screen with real-time data display
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useData } from '../context/DataContext';
import SOCDisplay from '../components/SOCDisplay';
import BatteryDataCards from '../components/BatteryDataCard';
import ConnectionStatus from '../components/ConnectionStatus';
import ActivityLog from '../components/ActivityLog';
import SOCChart from '../components/ChartComponents/SOCChart';
import BatteryParamsChart from '../components/ChartComponents/BatteryParamsChart';
import { COLORS } from '../utils/Constants';

const DashboardScreen = () => {
  const {
    connectionState,
    isStreaming,
    isPredicting,
    currentBatteryData,
    currentSOC,
    batteryHistory,
    socHistory,
    bufferStatus,
    predictionCount,
    modelLoaded,
    activityLog,
    startStreaming,
    stopStreaming,
    startPredicting,
    stopPredicting,
    clearData,
  } = useData();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleToggleStreaming = () => {
    if (isStreaming) {
      stopStreaming();
    } else {
      startStreaming();
    }
  };

  const handleTogglePredicting = () => {
    if (isPredicting) {
      stopPredicting();
    } else {
      startPredicting();
    }
  };

  const canStream = connectionState.nodeConnected;
  const canPredict = connectionState.flaskConnected;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Battery SOC Monitor</Text>
          <Text style={styles.headerSubtitle}>Real-time LSTM Predictions</Text>
        </View>

        {/* Connection Status */}
        <ConnectionStatus connectionState={connectionState} />

        {/* SOC Display */}
        <View style={styles.socContainer}>
          <SOCDisplay socData={currentSOC} size={220} />
        </View>

        {/* Battery Data Cards */}
        <BatteryDataCards batteryData={currentBatteryData} />

        {/* Status Bar */}
        <View style={styles.statusBar}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Buffer</Text>
            <Text style={styles.statusValue}>{bufferStatus}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Predictions</Text>
            <Text style={styles.statusValue}>{predictionCount}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Model</Text>
            <Text style={[styles.statusValue, { color: modelLoaded ? COLORS.success : COLORS.error }]}>
              {modelLoaded ? 'Ready' : 'Loading'}
            </Text>
          </View>
        </View>

        {/* Control Panel */}
        <View style={styles.controlPanel}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              !canStream && styles.disabledButton,
              isStreaming && styles.activeButton,
            ]}
            onPress={handleToggleStreaming}
            disabled={!canStream}
          >
            <Text style={styles.buttonText}>
              {isStreaming ? '⏸ Pause Data' : '▶ Start Data'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              !canPredict && styles.disabledButton,
              isPredicting && styles.activeButton,
            ]}
            onPress={handleTogglePredicting}
            disabled={!canPredict}
          >
            <Text style={styles.buttonText}>
              {isPredicting ? '⏸ Pause SOC' : '▶ Start SOC'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.clearButton]}
            onPress={clearData}
          >
            <Text style={styles.buttonText}>🗑 Clear Data</Text>
          </TouchableOpacity>
        </View>

        {/* Charts */}
        <SOCChart socHistory={socHistory} />
        <BatteryParamsChart batteryHistory={batteryHistory} />

        {/* Activity Log */}
        <ActivityLog activityLog={activityLog} maxHeight={250} />

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  socContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  controlButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: COLORS.success,
  },
  clearButton: {
    backgroundColor: COLORS.error,
  },
  disabledButton: {
    backgroundColor: COLORS.border,
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
});

export default DashboardScreen;
