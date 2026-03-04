import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { getPhotos } from '../storage/database';
import { loadEncryptedImage } from '../storage/loadEncryptedImage';
import { pickImage } from '../media/pickImage';
import { saveEncryptedImage } from '../storage/imageVault';

const size = Dimensions.get('window').width / 3;

export default function VaultGallery({ vaultKey }: any) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [images, setImages] = useState<any>({});

  async function loadGallery() {
    const rows = await getPhotos();

    setPhotos(rows);

    for (const item of rows) {
      const uri = await loadEncryptedImage(vaultKey, item?.fileName);

      setImages((prev: any) => ({
        ...prev,
        [item?.fileName]: uri,
      }));
    }
  }

  useEffect(() => {
    loadGallery();
  }, []);

  async function addPhoto() {
    const uri = await pickImage();

    if (!uri) return;

    await saveEncryptedImage(vaultKey, uri);

    await loadGallery();
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ width: size, height: size }}>
            {images[item.fileName] && (
              <Image
                source={{ uri: images[item.fileName] }}
                style={{ width: size, height: size }}
              />
            )}
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={addPhoto}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fabText: {
    color: '#fff',
    fontSize: 30,
  },
});
