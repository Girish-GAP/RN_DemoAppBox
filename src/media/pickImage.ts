import { launchImageLibrary } from 'react-native-image-picker'

export async function pickImages() {

    const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0, // unlimited
        includeBase64: false
    })

    if (result.didCancel) {
        return []
    }

    if (result.errorCode) {
        console.log("ImagePicker error:", result.errorMessage)
        return []
    }

    return result.assets ?? []

}