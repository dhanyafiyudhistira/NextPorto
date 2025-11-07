/**
 * Activity Log Component
 * Displays scrollable activity log with timestamped events
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { formatTime } from '../utils/Helpers';
import { COLORS, LOG_TYPES } from '../utils/Constants';

const getLogColor = (type) => {
  switch (type) {
    case LOG_TYPES.SUCCESS:
      return COLORS.success;
    case LOG_TYPES.ERROR:
      return COLORS.error;
    case LOG_TYPES.WARNING:
      return COLORS.warning;
    case LOG_TYPES.SYSTEM:
      return COLORS.primary;
    default:
      return COLORS.textSecondary;
  }
};

const getLogIcon = (type) => {
  switch (type) {
    case LOG_TYPES.SUCCESS:
      return '✓';
    case LOG_TYPES.ERROR:
      return '✗';
    case LOG_TYPES.WARNING:
      return '⚠';
    case LOG_TYPES.SYSTEM:
      return 'ℹ';
    default:
      return '•';
  }
};

const LogEntry = ({ entry }) => {
  const color = getLogColor(entry.type);
  const icon = getLogIcon(entry.type);

  return (
    <View style={styles.logEntry}>
      <Text style={[styles.logIcon, { color }]}>{icon}</Text>
      <View style={styles.logContent}>
        <Text style={styles.logMessage}>{entry.message}</Text>
        <Text style={styles.logTime}>{formatTime(entry.timestamp)}</Text>
      </View>
    </View>
  );
};

const ActivityLog = ({ activityLog, maxHeight = 300 }) => {
  if (!activityLog || activityLog.length === 0) {
    return (
      <View style={[styles.container, { maxHeight }]}>
        <Text style={styles.title}>Activity Log</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No activity yet</Text>
        </View>
      </View>
    );
  }

  // Reverse to show newest first
  const reversedLog = [...activityLog].reverse();

  return (
    <View style={[styles.container, { maxHeight }]}>
      <Text style={styles.title}>Activity Log</Text>
      <FlatList
        data={reversedLog}
        renderItem={({ item }) => <LogEntry entry={item} />}
        keyExtractor={(item) => item.id}
        style={styles.logList}
        showsVerticalScrollIndicator={true}
        inverted={false}
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
  logList: {
    flex: 1,
  },
  logEntry: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  logContent: {
    flex: 1,
  },
  logMessage: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
  },
  logTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});

export default ActivityLog;
