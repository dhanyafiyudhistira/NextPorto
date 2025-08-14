import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useGameStore } from '@store/useGameStore';

export const ControlsBar: React.FC = () => {
  const reset = useGameStore((s) => s.reset);
  const undo = useGameStore((s) => s.undo);
  return (
    <View style={styles.container}>
      <Button title="Undo" onPress={() => undo()} />
      <Button title="Reset" onPress={() => reset()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
  },
});
