import React, { useEffect, useState } from 'react';
import { Image, View, Dimensions } from 'react-native';
import { loadEncryptedImage } from '../storage/loadEncryptedImage';
import { IMAGES_PATH } from '../storage/paths';

const size = Dimensions.get('window').width / 3;

export default function VaultImageItem({ vaultKey, id }: any) {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const path = `${IMAGES_PATH}/${id}/thumb.enc`;

    console.log('read tumbnp path >> ', path);

    async function load() {
      try {
        const img = await loadEncryptedImage(vaultKey, path);

        if (mounted) {
          setUri(img);
        }
      } catch (e) {
        console.log('error load images >> ', e);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <View style={{ width: size, height: size }}>
      {uri && <Image source={{ uri }} style={{ width: size, height: size }} />}
    </View>
  );
}
