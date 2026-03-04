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


export async function insertPhoto(fileName: string) {

  const database = getDatabase()

  const id = Date.now().toString()

  const createdAt = Date.now()

  await database.executeAsync(
    `INSERT INTO photos
      (id, fileName, createdAt, updatedAt, syncStatus)
     VALUES (?, ?, ?, ?, ?)`,
    [
      id,
      fileName,
      createdAt,
      createdAt,
      'local'
    ]
  )

}


export async function getPhotos() {

  const database = getDatabase()

  const result = await database.executeAsync(
    `SELECT * FROM photos ORDER BY createdAt DESC`
  )

  console.log("DB result:", result)

  return result.rows._array;
}