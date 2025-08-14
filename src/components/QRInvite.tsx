import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export const QRInvite: React.FC<{ link: string }> = ({ link }) => (
  <View style={{ alignItems: 'center', padding: 16 }}>
    <Text style={{ color: '#fff', marginBottom: 8 }}>Scan to join</Text>
    <QRCode value={link} size={200} />
  </View>
);
