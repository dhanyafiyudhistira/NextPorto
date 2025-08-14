import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useGameStore } from '@store/useGameStore';

export const Timer: React.FC<{ side: 'white' | 'black' }> = ({ side }) => {
  const time = useGameStore((s) => s.clock[side]);
  const tick = useGameStore((s) => s.tick);
  useEffect(() => {
    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = Math.floor(time / 60)
    .toString()
    .padStart(2, '0');
  const ss = (time % 60).toString().padStart(2, '0');
  return <Text style={styles.text}>{mm}:{ss}</Text>;
};

const styles = StyleSheet.create({
  text: { color: '#fff', fontSize: 20, fontFamily: 'monospace' },
});
