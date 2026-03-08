import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { deletePhotoFromDB, getPhotos } from '../storage/database';
import { loadEncryptedImage } from '../storage/loadEncryptedImage';
import { pickImages } from '../media/pickImage';
import { saveEncryptedImage } from '../storage/imageVault';
import VaultImageItem from '../components/VaultImageItem';
import { IMAGES_PATH } from '../storage/paths';
import RNFS from 'react-native-fs';

const size = Dimensions.get('window').width / 3;

export default function VaultGallery({ vaultKey }: any) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  async function loadGallery() {
    const rows = await getPhotos();
    setPhotos(rows);
  }

  useEffect(() => {
    loadGallery();
  }, []);

  async function addPhoto() {
    const images = await pickImages();

    if (!images.length) return;

    for (const image of images) {
      if (!image.uri) continue;
      await saveEncryptedImage(vaultKey, image.uri);
    }

    await loadGallery();
  }

  function startSelection(id: string) {
    setSelectionMode(true);
    setSelected(prev => new Set(prev).add(id));
  }

  function toggleSelection(id: string) {
    if (!selectionMode) return;

    setSelected(prev => {
      const newSet = new Set(prev);

      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }

      if (newSet.size === 0) {
        setSelectionMode(false);
      }

      return newSet;
    });
  }

  async function deleteSelected() {
    if (selected.size === 0) return;

    const ids = Array.from(selected);

    await Promise.all(
      ids.map(async id => {
        const photo = photos.find(p => p.id === id);

        if (!photo) return;

        try {
          await deletePhotoFromDB(id);

          const path = `${IMAGES_PATH}/${photo.fileName}`;

          const exists = await RNFS.exists(path);

          if (exists) {
            await RNFS.unlink(path);
          }
        } catch (err) {
          console.log('Delete failed:', err);
        }
      }),
    );

    setSelected(new Set());
    setSelectionMode(false);

    await loadGallery();
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => startSelection(item.id)}
            onPress={() => toggleSelection(item.id)}
          >
            <VaultImageItem
              fileName={item.fileName}
              vaultKey={vaultKey}
              id={item.id}
            />

            {selected.has(item.id) && <View style={styles.selectedOverlay} />}
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={addPhoto}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {selectionMode && (
        <View style={styles.toolbar}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Delete Photos',
                `Delete ${selected.size} selected photo(s)?`,
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteSelected(),
                  },
                ],
              );
            }}
          >
            <Text style={{ color: 'white' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
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
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  toolbar: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
});
