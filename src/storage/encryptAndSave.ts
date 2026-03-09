import RNFS from 'react-native-fs'
import * as crypto from 'react-native-quick-crypto'
import { encryptImage } from '../security/crypto'

export async function encryptAndSave(
    sourcePath: string,
    destPath: string,
    key: crypto.Buffer
) {

    // read image file
    const base64 = await RNFS.readFile(sourcePath, 'base64')

    const buffer = crypto.Buffer.from(base64, 'base64')

    // encrypt
    const { iv, authTag, ciphertext } = encryptImage(key, buffer)

    // store format: iv + tag + ciphertext
    const combined = crypto.Buffer.concat([
        iv,
        authTag,
        ciphertext
    ])

    await RNFS.writeFile(destPath, combined.toString('base64'), 'base64')

}