import RNFS from 'react-native-fs';
import { APP_ROOT, VAULT_PATH, IMAGES_PATH, DB_PATH } from './paths';

async function ensureDir(path: string) {
    const exists = await RNFS.exists(path);
    if (!exists) {
        await RNFS.mkdir(path);
    }
}

export async function initializeStorage() {
    await ensureDir(APP_ROOT);
    await ensureDir(VAULT_PATH);
    await ensureDir(IMAGES_PATH);
    await ensureDir(DB_PATH);
}