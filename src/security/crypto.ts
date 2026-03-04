import * as crypto from 'react-native-quick-crypto'

export function generateSalt() {
    return crypto.randomBytes(16)
}

export function deriveKey(password: string, salt: crypto.Buffer) {
    return crypto.pbkdf2Sync(
        password,
        salt,
        150000,
        32,
        'sha256'
    )
}

export function encryptMasterSecret(key: crypto.Buffer) {

    const iv = crypto.randomBytes(12)

    const masterSecret = crypto.randomBytes(32)

    const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        key,
        iv
    )

    const encrypted = crypto.Buffer.concat([
        cipher.update(masterSecret),
        cipher.final()
    ])

    const authTag = cipher.getAuthTag()

    return {
        iv,
        authTag,
        ciphertext: encrypted,
        masterSecret
    }
}


export function decryptMasterSecret(
    key: crypto.Buffer,
    iv: crypto.Buffer,
    authTag: crypto.Buffer,
    ciphertext: crypto.Buffer
) {

    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        key,
        iv
    )

    decipher.setAuthTag(authTag)

    const decrypted = crypto.Buffer.concat([
        decipher.update(ciphertext),
        decipher.final()
    ])

    return decrypted
}



export function encryptImage(
    key: crypto.Buffer,
    data: crypto.Buffer
) {

    const iv = crypto.randomBytes(12)

    const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        key,
        iv
    )

    const encrypted = crypto.Buffer.concat([
        cipher.update(data),
        cipher.final()
    ])

    const authTag = cipher.getAuthTag()

    return {
        iv,
        authTag,
        ciphertext: encrypted
    }
}




export function decryptImage(
    key: crypto.Buffer,
    iv: crypto.Buffer,
    authTag: crypto.Buffer,
    ciphertext: crypto.Buffer
) {

    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        key,
        iv
    )

    decipher.setAuthTag(authTag)

    const decrypted = crypto.Buffer.concat([
        decipher.update(ciphertext),
        decipher.final()
    ])

    return decrypted
}