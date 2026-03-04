import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { unlockVault } from '../security/masterKey';

export default function UnlockScreen({ onUnlock }: any) {
  const [password, setPassword] = useState('');

  async function handleUnlock() {
    const key = await unlockVault(password);

    if (key) {
      onUnlock(key);
    } else {
      Alert.alert('Alert Title', 'Wrong password', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Button title="Unlock Vault" onPress={handleUnlock} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
});
