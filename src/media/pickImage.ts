import { launchImageLibrary } from 'react-native-image-picker'

export async function pickImage() {

    const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        includeBase64: false
    })

    if (result.didCancel) {
        return null
    }

    if (result.errorCode) {
        console.log("ImagePicker Error:", result.errorMessage)
        return null
    }

    const asset = result.assets?.[0]

    return asset?.uri ?? null
}