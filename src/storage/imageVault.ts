import RNFS from 'react-native-fs'
import ImageResizer from '@bam.tech/react-native-image-resizer'
import { encryptAndSave } from './encryptAndSave'
import { IMAGES_PATH } from './paths'
import { insertPhoto } from './database'
import { Buffer } from 'react-native-quick-crypto'

export async function saveEncryptedImage(vaultKey: Buffer, uri: string) {

    const createdAt = Date.now()
    const id = `${createdAt}-${Math.random().toString(36).slice(2, 8)}`

    const imageFolder = `${IMAGES_PATH}/${id}`

    let thumb: any = null

    try {

        await RNFS.mkdir(imageFolder)

        // create thumbnail
        thumb = await ImageResizer.createResizedImage(
            uri,
            300,
            300,
            'JPEG',
            70
        )

        const fullPath = `${imageFolder}/full.enc`
        const thumbPath = `${imageFolder}/thumb.enc`

        // encrypt full image
        await encryptAndSave(uri, fullPath, vaultKey)

        // encrypt thumbnail
        await encryptAndSave(thumb.uri, thumbPath, vaultKey)

        await insertPhoto(id)

        // delete temp thumbnail
        if (thumb?.uri && await RNFS.exists(thumb.uri)) {
            await RNFS.unlink(thumb.uri)
        }

    } catch (err) {

        if (thumb?.uri && await RNFS.exists(thumb.uri)) {
            await RNFS.unlink(thumb.uri).catch(() => { })
        }

        if (await RNFS.exists(imageFolder)) {
            await RNFS.unlink(imageFolder).catch(() => { })
        }

        throw err
    }
}