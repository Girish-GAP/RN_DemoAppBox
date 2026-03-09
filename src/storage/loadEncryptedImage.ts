import RNFS from 'react-native-fs'
import * as crypto from 'react-native-quick-crypto'
import { decryptImage } from '../security/crypto'

const thumbnailCache = new Map<string, string>()

export function clearThumbnailCache() {
    thumbnailCache?.clear()
}

export async function loadEncryptedImage(
    key: crypto.Buffer,
    path: string
) {

    if (thumbnailCache?.has(path)) {
        return thumbnailCache.get(path)!
    }

    const base64 = await RNFS.readFile(path, 'base64')

    const buffer = crypto.Buffer.from(base64, 'base64')

    const iv = buffer.slice(0, 12)
    const authTag = buffer.slice(12, 28)
    const ciphertext = buffer.slice(28)

    const decrypted = decryptImage(key, iv, authTag, ciphertext)

    const uri = `data:image/jpeg;base64,${decrypted.toString('base64')}`

    thumbnailCache.set(path, uri)

    return uri
}