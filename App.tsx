/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
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
import { createMasterKey, verifyPassword } from './src/security/masterKey';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const random = crypto.randomBytes(16);
    console.log('Random bytes:', random.toString('hex'));
  }, []);

  useEffect(() => {
    async function init() {
      await initializeStorage();
      await initializeDatabase();
    }

    init();
  }, []);

  useEffect(() => {
    const password = 'test123';

    const salt = generateSalt();
    const key = deriveKey(password, salt);

    console.log('Salt:', salt.toString('hex'));
    console.log('Key:', key.toString('hex'));
  }, []);

  useEffect(() => {
    createMasterKey('test123');
  }, []);

  useEffect(() => {
    async function test() {
      const ok = await verifyPassword('test123');

      console.log('Password correct:', ok);
    }

    test();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
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
