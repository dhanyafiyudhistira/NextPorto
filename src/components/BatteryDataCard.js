/**
 * Battery Data Card Component
 * Displays real-time battery parameters in a card format
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatNumber } from '../utils/Helpers';
import { COLORS } from '../utils/Constants';

const BatteryDataCard = ({ title, value, unit, icon, color = COLORS.primary }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon && <Text style={styles.icon}>{icon}</Text>}
      </View>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color }]}>
          {value !== null && value !== undefined ? formatNumber(value, 2) : '--'}
        </Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
};

const BatteryDataCards = ({ batteryData }) => {
  if (!batteryData) {
    return (
      <View style={styles.container}>
        <BatteryDataCard title="Voltage" value={null} unit="V" icon="⚡" color={COLORS.success} />
        <BatteryDataCard title="Current" value={null} unit="A" icon="🔌" color={COLORS.primary} />
        <BatteryDataCard title="Temperature" value={null} unit="°C" icon="🌡️" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BatteryDataCard
        title="Voltage"
        value={batteryData.voltage}
        unit="V"
        icon="⚡"
        color={COLORS.success}
      />
      <BatteryDataCard
        title="Current"
        value={batteryData.current}
        unit="A"
        icon="🔌"
        color={COLORS.primary}
      />
      <BatteryDataCard
        title="Temperature"
        value={batteryData.temperature}
        unit="°C"
        icon="🌡️"
        color={COLORS.accent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  icon: {
    fontSize: 16,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
});

export { BatteryDataCard };
export default BatteryDataCards;
