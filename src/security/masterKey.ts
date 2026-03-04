import RNFS from 'react-native-fs'
import { VAULT_PATH } from '../storage/paths'
import { generateSalt, deriveKey, encryptMasterSecret, decryptMasterSecret } from './crypto'
import * as crypto from 'react-native-quick-crypto'

export async function createMasterKey(password: string) {

    const salt = generateSalt()

    const key = deriveKey(password, salt)

    const encrypted = encryptMasterSecret(key)

    const payload = {
        salt: salt.toString('base64'),
        iv: encrypted.iv.toString('base64'),
        authTag: encrypted.authTag.toString('base64'),
        ciphertext: encrypted.ciphertext.toString('base64')
    }

    const path = `${VAULT_PATH}/master.key.enc`

    await RNFS.writeFile(
        path,
        JSON.stringify(payload),
        'utf8'
    )

    console.log("Master key file created")
}




export async function verifyPassword(password: string) {

    const path = `${VAULT_PATH}/master.key.enc`

    const content = await RNFS.readFile(path, 'utf8')

    const data = JSON.parse(content)

    const salt = crypto.Buffer.from(data.salt, 'base64')

    const iv = crypto.Buffer.from(data.iv, 'base64')

    const authTag = crypto.Buffer.from(data.authTag, 'base64')

    const ciphertext = crypto.Buffer.from(data.ciphertext, 'base64')

    const key = deriveKey(password, salt)

    try {

        decryptMasterSecret(
            key,
            iv,
            authTag,
            ciphertext
        )

        return true

    } catch {

        return false
    }
}