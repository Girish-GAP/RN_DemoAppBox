/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  AppState,
} from 'react-native';
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
import UnlockScreen from './src/screens/UnlockScreen';
import CreateVaultScreen from './src/screens/CreateVaultScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const [key, setKey] = useState<any>(null);
  const [vaultExists, setVaultExists] = useState(false);

  const [appState, setAppState] = useState(AppState.currentState);

  // Auto Lock Vault on background
  useEffect(() => {
    const blurSub = AppState.addEventListener('blur', () => {
      console.log('Vault locked (blur)');
      setKey(null);
    });

    const changeSub = AppState.addEventListener('change', state => {
      if (state !== 'active') {
        console.log('Vault locked (background)');
        setKey(null);
      }
    });

    return () => {
      blurSub.remove();
      changeSub.remove();
    };
  }, []);

  useEffect(() => {
    async function init() {
      await initializeStorage();
      await initializeDatabase();

      const masterPath = `${VAULT_PATH}/master.key.enc`;

      const exists = await RNFS.exists(masterPath);

      setVaultExists(exists);
    }

    init();
  }, []);

  if (!vaultExists) {
    return <CreateVaultScreen onCreated={() => setVaultExists(true)} />;
  }

  if (!key) {
    return <UnlockScreen onUnlock={setKey} />;
  }

  return <VaultGallery vaultKey={key} />;
}

export default App;
