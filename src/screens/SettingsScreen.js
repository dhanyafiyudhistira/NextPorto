/**
 * Settings Screen
 * Configuration screen for API endpoints and app settings
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { useData } from '../context/DataContext';
import { COLORS } from '../utils/Constants';

const SettingsScreen = () => {
  const { settings, saveSettings, resetSettings } = useSettings();
  const { dataSource, changeDataSource } = useData();

  const [nodeEndpoint, setNodeEndpoint] = useState(settings.apiEndpoint);
  const [flaskEndpoint, setFlaskEndpoint] = useState(settings.flaskEndpoint);
  const [pollInterval, setPollInterval] = useState(settings.pollInterval.toString());
  const [chartMaxPoints, setChartMaxPoints] = useState(settings.chartMaxPoints.toString());
  const [enableNotifications, setEnableNotifications] = useState(settings.enableNotifications);

  const handleSave = async () => {
    const newSettings = {
      apiEndpoint: nodeEndpoint,
      flaskEndpoint: flaskEndpoint,
      pollInterval: parseInt(pollInterval) || 1000,
      chartMaxPoints: parseInt(chartMaxPoints) || 50,
      enableNotifications,
      dataSource,
    };

    const success = await saveSettings(newSettings);

    if (success) {
      Alert.alert('Success', 'Settings saved successfully!', [{ text: 'OK' }]);
    } else {
      Alert.alert('Error', 'Failed to save settings. Please try again.', [{ text: 'OK' }]);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const success = await resetSettings();
            if (success) {
              setNodeEndpoint(settings.apiEndpoint);
              setFlaskEndpoint(settings.flaskEndpoint);
              setPollInterval(settings.pollInterval.toString());
              setChartMaxPoints(settings.chartMaxPoints.toString());
              setEnableNotifications(settings.enableNotifications);
              Alert.alert('Success', 'Settings reset to default!', [{ text: 'OK' }]);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Configure API endpoints and preferences</Text>
        </View>

        {/* API Endpoints Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Endpoints</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Node.js Server URL</Text>
            <TextInput
              style={styles.input}
              value={nodeEndpoint}
              onChangeText={setNodeEndpoint}
              placeholder="http://192.168.1.100:3000"
              placeholderTextColor={COLORS.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.hint}>Battery data generator endpoint</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Flask LSTM Server URL</Text>
            <TextInput
              style={styles.input}
              value={flaskEndpoint}
              onChangeText={setFlaskEndpoint}
              placeholder="http://192.168.1.100:5001"
              placeholderTextColor={COLORS.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.hint}>LSTM inference engine endpoint</Text>
          </View>
        </View>

        {/* Data Source Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Source</Text>

          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => changeDataSource('dataset')}
            >
              <View style={styles.radio}>
                {dataSource === 'dataset' && <View style={styles.radioSelected} />}
              </View>
              <View style={styles.radioContent}>
                <Text style={styles.radioLabel}>Dataset Distribution</Text>
                <Text style={styles.radioHint}>V=12.76V, I=19.99A (Recommended)</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => changeDataSource('realistic')}
            >
              <View style={styles.radio}>
                {dataSource === 'realistic' && <View style={styles.radioSelected} />}
              </View>
              <View style={styles.radioContent}>
                <Text style={styles.radioLabel}>Realistic Physics</Text>
                <Text style={styles.radioHint}>V=3.7V, I=-2A (Simulated)</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Performance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Polling Interval (ms)</Text>
            <TextInput
              style={styles.input}
              value={pollInterval}
              onChangeText={setPollInterval}
              placeholder="1000"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="numeric"
            />
            <Text style={styles.hint}>Data update frequency (1000ms = 1 second)</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Chart Max Data Points</Text>
            <TextInput
              style={styles.input}
              value={chartMaxPoints}
              onChangeText={setChartMaxPoints}
              placeholder="50"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="numeric"
            />
            <Text style={styles.hint}>Maximum data points to display in charts</Text>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.switchGroup}>
            <View style={styles.switchContent}>
              <Text style={styles.switchLabel}>Enable Notifications</Text>
              <Text style={styles.switchHint}>Receive alerts for low SOC and errors</Text>
            </View>
            <Switch
              value={enableNotifications}
              onValueChange={setEnableNotifications}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.text}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>💾 Save Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.buttonText}>🔄 Reset to Default</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ Important Notes</Text>
          <Text style={styles.infoText}>
            • Make sure your device is on the same network as the servers{'\n'}
            • Replace 192.168.1.100 with your computer's actual IP address{'\n'}
            • Both servers must be running for full functionality{'\n'}
            • Lower polling intervals may increase battery usage
          </Text>
        </View>

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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  radioGroup: {
    marginTop: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  radioContent: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  radioHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchContent: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  switchHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actionButtons: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  saveButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  resetButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 20,
  },
});

export default SettingsScreen;
