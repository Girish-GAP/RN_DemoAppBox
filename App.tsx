/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { initializeStorage } from './src/storage/initStorage';
import { initializeDatabase } from './src/storage/database';
import * as crypto from 'react-native-quick-crypto';
import { generateSalt, deriveKey } from './src/security/crypto';
import {
  createMasterKey,
  unlockVault,
  verifyPassword,
} from './src/security/masterKey';
import { pickImage } from './src/media/pickImage';
import { saveEncryptedImage } from './src/storage/imageVault';
import VaultGallery from './src/screens/VaultGallery';
import { VAULT_PATH } from './src/storage/paths';
import RNFS from 'react-native-fs';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const [key, setKey] = useState<any>(null);

  useEffect(() => {
    async function init() {
      //1️ Ensure folders exist
      await initializeStorage();

      // 2 Initialize DB
      await initializeDatabase();

      const masterPath = `${VAULT_PATH}/master.key.enc`;

      const exists = await RNFS.exists(masterPath);

      if (!exists) {
        console.log('Creating new vault');
        await createMasterKey('test123');
      }

      const vaultKey = await unlockVault('test123');

      setKey(vaultKey);
    }

    init();
  }, []);

  if (!key) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </SafeAreaProvider>
    );
  }

  return <VaultGallery vaultKey={key} />;
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
