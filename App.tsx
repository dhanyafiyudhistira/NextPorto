import React, { useState } from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';
import { Board } from '@components/Board';
import { MoveList } from '@components/MoveList';
import { Timer } from '@components/Timer';
import { ControlsBar } from '@components/ControlsBar';
import { QRInvite } from '@components/QRInvite';
import { QRScanner } from '@components/QRScanner';

export default function App() {
  const [screen, setScreen] = useState<'home' | 'game' | 'invite' | 'scan'>(
    'home'
  );
  const [link, setLink] = useState('');

  const createRoom = () => {
    const roomId = Math.random().toString(36).slice(2, 8);
    const l = `retro-chess://room/${roomId}`;
    setLink(l);
    setScreen('invite');
  };

  const joinRoom = (data: string) => {
    setLink(data);
    setScreen('game');
  };

  if (screen === 'invite')
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center' }}
      >
        <QRInvite link={link} />
        <Button title="Start Game" onPress={() => setScreen('game')} />
      </SafeAreaView>
    );

  if (screen === 'scan')
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <QRScanner onResult={joinRoom} />
      </SafeAreaView>
    );

  if (screen === 'game')
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#000',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Timer side="black" />
          <Text style={{ color: '#fff', marginHorizontal: 10 }}>vs</Text>
          <Timer side="white" />
        </View>
        <Board />
        <MoveList />
        <ControlsBar />
      </SafeAreaView>
    );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
      }}
    >
      <Text style={{ color: '#0ff', fontSize: 24, marginBottom: 20 }}>
        Retro Chess
      </Text>
      <Button title="Create Room" onPress={createRoom} />
      <Button title="Join via QR" onPress={() => setScreen('scan')} />
      <Button title="Local Game" onPress={() => setScreen('game')} />
    </SafeAreaView>
  );
}
