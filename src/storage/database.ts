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
      createdAt INTEGER,
      updatedAt INTEGER,
      source TEXT,
      encryptedMetadata TEXT
    );
  `);

  console.log('Photos table ready');
}

export async function insertPhoto(id: string) {

  const database = getDatabase()

  const createdAt = Date.now()

  await database.executeAsync(
    `INSERT INTO photos (id, createdAt, updatedAt, source)
     VALUES (?, ?, ?, ?)`,
    [
      id,
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


export async function deletePhotoFromDB(id: string) {
  const database = getDatabase();

  await database.executeAsync(
    `DELETE FROM photos WHERE id = ?`,
    [id]
  );
}