/**
 * SOC Chart Component
 * Line chart displaying SOC percentage over time
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import DataProcessor from '../../services/DataProcessor';
import { COLORS, CHART_CONFIG } from '../../utils/Constants';

const screenWidth = Dimensions.get('window').width;

const SOCChart = ({ socHistory }) => {
  const chartData = DataProcessor.extractSOCChartData(socHistory, CHART_CONFIG.MAX_DATA_POINTS);

  // If no data, show empty state
  if (!chartData.soc || chartData.soc.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>SOC History</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      </View>
    );
  }

  const data = {
    labels: chartData.labels.length > 10
      ? chartData.labels.filter((_, i) => i % Math.ceil(chartData.labels.length / 10) === 0)
      : chartData.labels,
    datasets: [
      {
        data: chartData.soc,
        color: (opacity = 1) => CHART_CONFIG.COLORS.soc,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: COLORS.card,
    backgroundGradientFrom: COLORS.card,
    backgroundGradientTo: COLORS.card,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
    labelColor: (opacity = 1) => COLORS.textSecondary,
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: '3',
      strokeWidth: '2',
      stroke: CHART_CONFIG.COLORS.soc,
    },
    propsForBackgroundLines: {
      stroke: CHART_CONFIG.COLORS.grid,
      strokeWidth: 1,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOC History</Text>
      <LineChart
        data={data}
        width={screenWidth - 48}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        fromZero={true}
        segments={5}
      />
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: CHART_CONFIG.COLORS.soc }]} />
          <Text style={styles.legendText}>SOC %</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyState: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});

export default SOCChart;
