/**
 * Analytics Screen
 * Historical data visualization and statistics
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useData } from '../context/DataContext';
import DataProcessor from '../services/DataProcessor';
import SOCChart from '../components/ChartComponents/SOCChart';
import BatteryParamsChart from '../components/ChartComponents/BatteryParamsChart';
import { formatNumber, formatDateTime } from '../utils/Helpers';
import { COLORS } from '../utils/Constants';

const StatCard = ({ title, value, unit, color = COLORS.text }) => (
  <View style={styles.statCard}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={[styles.statValue, { color }]}>
      {formatNumber(value, 2)} {unit}
    </Text>
  </View>
);

const StatRow = ({ label, min, max, avg, unit }) => (
  <View style={styles.statRow}>
    <Text style={styles.statRowLabel}>{label}</Text>
    <View style={styles.statRowValues}>
      <View style={styles.statRowItem}>
        <Text style={styles.statRowItemLabel}>Min</Text>
        <Text style={styles.statRowItemValue}>{formatNumber(min, 2)}</Text>
      </View>
      <View style={styles.statRowItem}>
        <Text style={styles.statRowItemLabel}>Avg</Text>
        <Text style={styles.statRowItemValue}>{formatNumber(avg, 2)}</Text>
      </View>
      <View style={styles.statRowItem}>
        <Text style={styles.statRowItemLabel}>Max</Text>
        <Text style={styles.statRowItemValue}>{formatNumber(max, 2)}</Text>
      </View>
    </View>
  </View>
);

const AnalyticsScreen = () => {
  const {
    batteryHistory,
    socHistory,
    currentBatteryData,
    currentSOC,
    predictionCount,
  } = useData();

  const batteryStats = DataProcessor.calculateBatteryStats(batteryHistory);
  const socStats = DataProcessor.calculateSOCStats(socHistory);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>Statistical Analysis & Trends</Text>
        </View>

        {/* Overview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Samples"
              value={batteryHistory.length}
              unit="samples"
              color={COLORS.primary}
            />
            <StatCard
              title="Predictions"
              value={predictionCount}
              unit="count"
              color={COLORS.success}
            />
          </View>
          {currentBatteryData && (
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>
                {formatDateTime(currentBatteryData.timestamp)}
              </Text>
            </View>
          )}
        </View>

        {/* SOC Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SOC Statistics</Text>
          {socHistory.length > 0 ? (
            <>
              <View style={styles.statsGrid}>
                <StatCard
                  title="Current SOC"
                  value={socStats.current}
                  unit="%"
                  color={COLORS.accent}
                />
                <StatCard
                  title="Average SOC"
                  value={socStats.avg}
                  unit="%"
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.rangeBar}>
                <View style={styles.rangeInfo}>
                  <Text style={styles.rangeLabel}>Range</Text>
                  <Text style={styles.rangeValue}>
                    {formatNumber(socStats.min, 1)}% - {formatNumber(socStats.max, 1)}%
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>No SOC data available</Text>
          )}
        </View>

        {/* SOC Chart */}
        <SOCChart socHistory={socHistory} />

        {/* Battery Parameters Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Battery Parameters</Text>
          {batteryHistory.length > 0 ? (
            <>
              <StatRow
                label="Voltage (V)"
                min={batteryStats.voltage.min}
                avg={batteryStats.voltage.avg}
                max={batteryStats.voltage.max}
                unit="V"
              />
              <StatRow
                label="Current (A)"
                min={batteryStats.current.min}
                avg={batteryStats.current.avg}
                max={batteryStats.current.max}
                unit="A"
              />
              <StatRow
                label="Temperature (°C)"
                min={batteryStats.temperature.min}
                avg={batteryStats.temperature.avg}
                max={batteryStats.temperature.max}
                unit="°C"
              />
            </>
          ) : (
            <Text style={styles.emptyText}>No battery data available</Text>
          )}
        </View>

        {/* Battery Parameters Chart */}
        <BatteryParamsChart batteryHistory={batteryHistory} />

        {/* Performance Metrics */}
        {currentSOC && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Metrics</Text>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Prediction Time</Text>
              <Text style={styles.metricValue}>
                {formatNumber(currentSOC.prediction_time_ms, 2)} ms
              </Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Buffer Size</Text>
              <Text style={styles.metricValue}>{currentSOC.buffer_size}</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Prediction Mode</Text>
              <Text style={styles.metricValue}>{currentSOC.mode}</Text>
            </View>
          </View>
        )}

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
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statRow: {
    marginBottom: 16,
  },
  statRowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  statRowValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
  },
  statRowItem: {
    alignItems: 'center',
  },
  statRowItemLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statRowItemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  rangeBar: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  rangeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rangeLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  rangeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  metricLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  infoBox: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
  bottomPadding: {
    height: 20,
  },
});

export default AnalyticsScreen;
