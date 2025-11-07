/**
 * Battery Parameters Chart Component
 * Multi-line chart for voltage, current, and temperature
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import DataProcessor from '../../services/DataProcessor';
import { COLORS, CHART_CONFIG } from '../../utils/Constants';

const screenWidth = Dimensions.get('window').width;

const BatteryParamsChart = ({ batteryHistory }) => {
  const [selectedParam, setSelectedParam] = useState('voltage');

  const chartData = DataProcessor.extractChartData(batteryHistory, CHART_CONFIG.MAX_DATA_POINTS);

  // If no data, show empty state
  if (!chartData.voltage || chartData.voltage.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Battery Parameters</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      </View>
    );
  }

  const getChartData = () => {
    let dataValues = [];
    let color = CHART_CONFIG.COLORS.voltage;
    let label = 'Voltage (V)';

    switch (selectedParam) {
      case 'voltage':
        dataValues = chartData.voltage;
        color = CHART_CONFIG.COLORS.voltage;
        label = 'Voltage (V)';
        break;
      case 'current':
        dataValues = chartData.current;
        color = CHART_CONFIG.COLORS.current;
        label = 'Current (A)';
        break;
      case 'temperature':
        dataValues = chartData.temperature;
        color = CHART_CONFIG.COLORS.temperature;
        label = 'Temperature (°C)';
        break;
    }

    return {
      labels: chartData.labels.length > 10
        ? chartData.labels.filter((_, i) => i % Math.ceil(chartData.labels.length / 10) === 0)
        : chartData.labels,
      datasets: [
        {
          data: dataValues,
          color: (opacity = 1) => color,
          strokeWidth: 2,
        },
      ],
      legend: [label],
    };
  };

  const data = getChartData();

  const chartConfig = {
    backgroundColor: COLORS.card,
    backgroundGradientFrom: COLORS.card,
    backgroundGradientTo: COLORS.card,
    decimalPlaces: 2,
    color: (opacity = 1) => data.datasets[0].color(opacity),
    labelColor: (opacity = 1) => COLORS.textSecondary,
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: '3',
      strokeWidth: '2',
      stroke: data.datasets[0].color(1),
    },
    propsForBackgroundLines: {
      stroke: CHART_CONFIG.COLORS.grid,
      strokeWidth: 1,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Battery Parameters</Text>

      {/* Parameter selector */}
      <View style={styles.selector}>
        <TouchableOpacity
          style={[styles.selectorButton, selectedParam === 'voltage' && styles.selectedButton]}
          onPress={() => setSelectedParam('voltage')}
        >
          <Text style={[styles.selectorText, selectedParam === 'voltage' && styles.selectedText]}>
            Voltage
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.selectorButton, selectedParam === 'current' && styles.selectedButton]}
          onPress={() => setSelectedParam('current')}
        >
          <Text style={[styles.selectorText, selectedParam === 'current' && styles.selectedText]}>
            Current
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.selectorButton, selectedParam === 'temperature' && styles.selectedButton]}
          onPress={() => setSelectedParam('temperature')}
        >
          <Text style={[styles.selectorText, selectedParam === 'temperature' && styles.selectedText]}>
            Temp
          </Text>
        </TouchableOpacity>
      </View>

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
        segments={5}
      />
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
  selector: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 4,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
  },
  selectorText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  selectedText: {
    color: COLORS.text,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
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

export default BatteryParamsChart;
