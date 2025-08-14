import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export const QRScanner: React.FC<{ onResult: (data: string) => void }> = ({
  onResult,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    BarCodeScanner.requestPermissionsAsync().then(({ status }) =>
      setHasPermission(status === 'granted')
    );
  }, []);

  if (hasPermission === null) return <Text>Requesting camera permission</Text>;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <BarCodeScanner
      onBarCodeScanned={({ data }) => onResult(data)}
      style={{ flex: 1 }}
    />
  );
};
