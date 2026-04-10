import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { loadEncryptedImage } from '../storage/loadEncryptedImage';
import { IMAGES_PATH } from '../storage/paths';

export default function ImageViewerScreen({ route }: any) {
  const { id, vaultKey } = route.params;

  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const path = `${IMAGES_PATH}/${id}/full.enc`;

      const img = await loadEncryptedImage(vaultKey, path);

      setUri(img);
    }

    load();
  }, [id]);

  return (
    <View style={styles.container}>
      {uri && (
        <Image source={{ uri }} style={styles.image} resizeMode="contain" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
