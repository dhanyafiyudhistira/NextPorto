/**
 * Battery SOC Monitor - Main App Component
 * React Native mobile application for real-time battery monitoring
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DataProvider } from './src/context/DataContext';
import { SettingsProvider } from './src/context/SettingsContext';
import DashboardScreen from './src/screens/DashboardScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { COLORS } from './src/utils/Constants';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <SettingsProvider>
      <DataProvider>
        <NavigationContainer>
          <StatusBar
            barStyle="light-content"
            backgroundColor={COLORS.background}
          />
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: COLORS.surface,
                borderTopColor: COLORS.border,
                borderTopWidth: 1,
                paddingBottom: 5,
                paddingTop: 5,
                height: 60,
              },
              tabBarActiveTintColor: COLORS.primary,
              tabBarInactiveTintColor: COLORS.textSecondary,
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
              },
            }}
          >
            <Tab.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                tabBarLabel: 'Dashboard',
                tabBarIcon: ({ color, size }) => (
                  <TabIcon icon="📊" color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Analytics"
              component={AnalyticsScreen}
              options={{
                tabBarLabel: 'Analytics',
                tabBarIcon: ({ color, size }) => (
                  <TabIcon icon="📈" color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                tabBarLabel: 'Settings',
                tabBarIcon: ({ color, size }) => (
                  <TabIcon icon="⚙️" color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </DataProvider>
    </SettingsProvider>
  );
};

// Simple emoji icon component for tabs
const TabIcon = ({ icon, color }) => {
  return (
    <Text style={{ fontSize: 24, opacity: color === COLORS.primary ? 1 : 0.6 }}>
      {icon}
    </Text>
  );
};

// Fix: Import Text component
import { Text } from 'react-native';

export default App;
