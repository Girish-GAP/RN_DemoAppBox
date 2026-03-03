import { open } from 'react-native-nitro-sqlite';

let db: any = null;

export function getDatabase() {
  if (!db) {
    db = open({ name: 'metadata.db' });
  }
  return db;
}

export async function initializeDatabase() {
  const database = getDatabase();

  await database.executeAsync(`
    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      fileName TEXT,
      encryptedMetadata TEXT,
      createdAt INTEGER,
      updatedAt INTEGER,
      syncStatus TEXT
    );
  `);

  console.log('Photos table ready');
}