import RNFS from 'react-native-fs'
import * as crypto from 'react-native-quick-crypto'
import { decryptImage } from '../security/crypto'

export async function loadEncryptedImage(
    key: crypto.Buffer,
    path: string
) {

    const base64 = await RNFS.readFile(path, 'base64')

    const buffer = crypto.Buffer.from(base64, 'base64')

    const iv = buffer.slice(0, 12)
    const authTag = buffer.slice(12, 28)
    const ciphertext = buffer.slice(28)

    const decrypted = decryptImage(key, iv, authTag, ciphertext)

    return `data:image/jpeg;base64,${decrypted.toString('base64')}`

}