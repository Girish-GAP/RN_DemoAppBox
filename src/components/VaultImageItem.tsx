import React, { useEffect, useState } from 'react';
import { Image, View, Dimensions } from 'react-native';
import { loadEncryptedImage } from '../storage/loadEncryptedImage';

const size = Dimensions.get('window').width / 3;

export default function VaultImageItem({ fileName, vaultKey }: any) {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const img = await loadEncryptedImage(vaultKey, fileName);

      if (mounted) {
        setUri(img);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [fileName]);

  return (
    <View style={{ width: size, height: size }}>
      {uri && <Image source={{ uri }} style={{ width: size, height: size }} />}
    </View>
  );
}
