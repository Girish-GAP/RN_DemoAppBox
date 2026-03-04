import RNFS from 'react-native-fs'
import { IMAGES_PATH } from './paths'
import { decryptImage } from '../security/crypto'
import * as crypto from 'react-native-quick-crypto'

export async function loadEncryptedImage(
    key: crypto.Buffer,
    fileName: string
) {

    const path = `${IMAGES_PATH}/${fileName}`

    const content = await RNFS.readFile(path, 'utf8')

    const data = JSON.parse(content)

    const iv = crypto.Buffer.from(data.iv, 'base64')
    const authTag = crypto.Buffer.from(data.authTag, 'base64')
    const ciphertext = crypto.Buffer.from(data.ciphertext, 'base64')

    const decrypted = decryptImage(
        key,
        iv,
        authTag,
        ciphertext
    )

    return `data:image/jpeg;base64,${decrypted.toString('base64')}`
}