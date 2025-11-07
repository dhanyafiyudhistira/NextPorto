/**
 * Connection Status Component
 * Displays service connection indicators
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/Constants';

const StatusIndicator = ({ label, connected, showDot = true }) => {
  return (
    <View style={styles.indicator}>
      {showDot && (
        <View
          style={[
            styles.dot,
            { backgroundColor: connected ? COLORS.success : COLORS.error }
          ]}
        />
      )}
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.status, { color: connected ? COLORS.success : COLORS.error }]}>
        {connected ? 'Connected' : 'Offline'}
      </Text>
    </View>
  );
};

const ConnectionStatus = ({ connectionState }) => {
  const { isConnected, nodeConnected, flaskConnected } = connectionState;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Connection Status</Text>
        <View
          style={[
            styles.overallDot,
            {
              backgroundColor:
                isConnected && nodeConnected && flaskConnected
                  ? COLORS.success
                  : isConnected
                  ? COLORS.warning
                  : COLORS.error
            }
          ]}
        />
      </View>

      <View style={styles.statusList}>
        <StatusIndicator label="Internet" connected={isConnected} />
        <StatusIndicator label="Node.js Server" connected={nodeConnected} />
        <StatusIndicator label="Flask LSTM Engine" connected={flaskConnected} />
      </View>

      {!isConnected && (
        <Text style={styles.message}>
          No internet connection. Please check your network settings.
        </Text>
      )}

      {isConnected && !nodeConnected && !flaskConnected && (
        <Text style={styles.message}>
          Both services are unavailable. Please check server configuration.
        </Text>
      )}

      {isConnected && !nodeConnected && flaskConnected && (
        <Text style={styles.message}>
          Node.js service unavailable. Cannot fetch battery data.
        </Text>
      )}

      {isConnected && nodeConnected && !flaskConnected && (
        <Text style={styles.message}>
          Flask service unavailable. Cannot get SOC predictions.
        </Text>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  overallDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  statusList: {
    marginTop: 8,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  message: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default ConnectionStatus;
