/**
 * Settings Context
 * Global settings and configuration management
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../services/ApiService';
import { DEFAULT_SETTINGS } from '../utils/Constants';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

const STORAGE_KEY = '@battery_monitor_settings';

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load settings from storage
   */
  const loadSettings = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });

        // Update API service with loaded endpoints
        ApiService.updateEndpoints(
          parsed.apiEndpoint || DEFAULT_SETTINGS.apiEndpoint,
          parsed.flaskEndpoint || DEFAULT_SETTINGS.flaskEndpoint
        );
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Save settings to storage
   */
  const saveSettings = useCallback(async (newSettings) => {
    try {
      const updated = { ...settings, ...newSettings };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSettings(updated);

      // Update API service if endpoints changed
      if (newSettings.apiEndpoint || newSettings.flaskEndpoint) {
        ApiService.updateEndpoints(
          newSettings.apiEndpoint || settings.apiEndpoint,
          newSettings.flaskEndpoint || settings.flaskEndpoint
        );
      }

      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }, [settings]);

  /**
   * Update individual setting
   */
  const updateSetting = useCallback(async (key, value) => {
    return await saveSettings({ [key]: value });
  }, [saveSettings]);

  /**
   * Reset to default settings
   */
  const resetSettings = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      setSettings(DEFAULT_SETTINGS);

      ApiService.updateEndpoints(
        DEFAULT_SETTINGS.apiEndpoint,
        DEFAULT_SETTINGS.flaskEndpoint
      );

      return true;
    } catch (error) {
      console.error('Error resetting settings:', error);
      return false;
    }
  }, []);

  /**
   * Get setting value
   */
  const getSetting = useCallback((key) => {
    return settings[key];
  }, [settings]);

  /**
   * Load settings on mount
   */
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const value = {
    settings,
    isLoading,
    saveSettings,
    updateSetting,
    resetSettings,
    getSetting,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
