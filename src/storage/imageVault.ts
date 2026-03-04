import RNFS from 'react-native-fs'
import * as crypto from 'react-native-quick-crypto'
import { IMAGES_PATH } from './paths'
import { encryptImage } from '../security/crypto'
import { insertPhoto } from './database'

export async function saveEncryptedImage(
    key: crypto.Buffer,
    imagePath: string
) {

    const data = await RNFS.readFile(
        imagePath,
        'base64'
    )

    const buffer = crypto.Buffer.from(data, 'base64')

    const encrypted = encryptImage(key, buffer)

    const payload = {
        iv: encrypted.iv.toString('base64'),
        authTag: encrypted.authTag.toString('base64'),
        ciphertext: encrypted.ciphertext.toString('base64')
    }

    const fileName = `${Date.now()}.enc`

    const filePath = `${IMAGES_PATH}/${fileName}`

    await RNFS.writeFile(
        filePath,
        JSON.stringify(payload),
        'utf8'
    )

    await insertPhoto(fileName)

    return fileName
}