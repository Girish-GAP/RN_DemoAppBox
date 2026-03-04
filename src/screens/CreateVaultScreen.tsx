import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { createMasterKey } from '../security/masterKey';

export default function CreateVaultScreen({ onCreated }: any) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  async function createVault() {
    if (!password) {
      Alert.alert('Password required');
      return;
    }

    if (password !== confirm) {
      Alert.alert('Passwords do not match');
      return;
    }

    await createMasterKey(password);

    onCreated();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Vault Password</Text>

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={styles.input}
      />

      <Button title="Create Vault" onPress={createVault} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  title: {
    fontSize: 20,
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
  },
});
