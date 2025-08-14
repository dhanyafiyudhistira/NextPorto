import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { useGameStore } from '@store/useGameStore';

export const MoveList: React.FC = () => {
  const moves = useGameStore((s) => s.moves);
  return (
    <ScrollView style={styles.container}>
      {moves.map((m, i) => (
        <Text key={i} style={styles.text}>
          {i + 1}. {m}
        </Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { height: 100 },
  text: { color: '#fff', fontFamily: 'monospace', fontSize: 14 },
});
