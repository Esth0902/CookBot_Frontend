import { ref } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export const usePhotoGallery = () => {
    const photos = ref<UserPhoto[]>([]);
    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });
        const fileName = Date.now() + '.jpeg';
        const savedFileImage = {
            filepath: fileName,
            webviewPath: photo.webPath,
        };

        photos.value = [savedFileImage, ...photos.value];
    };

    const deletePhoto = (photoToDelete?: UserPhoto) => {
        if (photoToDelete) {
            photos.value = photos.value.filter(p => p.filepath !== photoToDelete.filepath);
        } else {
            photos.value = [];
        }
    };

    return {
        takePhoto,
        photos,
        deletePhoto,
    };
};

export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
}