import { ref } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
}

function estimateBytes(dataUrl: string) {
    return Math.floor((dataUrl.length * 3) / 4);
}

async function compressDataUrl(
    dataUrl: string,
    maxW = 1200,
    maxH = 1200,
    maxBytes = 450_000
): Promise<string> {
    const img = new Image();
    img.src = dataUrl;

    await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = rej;
    });

    let { width, height } = img;
    const ratio = Math.min(maxW / width, maxH / height, 1);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUrl;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    let q = 0.75;
    let out = "";

    while (q >= 0.4) {
        out = canvas.toDataURL('image/jpeg', q);
        if (estimateBytes(out) <= maxBytes) return out;
        q -= 0.1;
    }

    return out || canvas.toDataURL('image/jpeg', 0.4);
}

export const usePhotoGallery = () => {
    const photos = ref<UserPhoto[]>([]);

    const takePhoto = async () => {
        try {
            const photo = await Camera.getPhoto({
                source: CameraSource.Camera,
                resultType: CameraResultType.DataUrl,
                quality: 90,
                width: 1600,
            });

            const compressed = await compressDataUrl(
                photo.dataUrl!,
                1200,
                1200,
                450_000
            );

            photos.value = [{
                filepath: Date.now() + '.jpg',
                webviewPath: compressed,
            }];
        } catch (e) {
            console.warn("User cancelled or camera error", e);
        }
    };

    const deletePhoto = (photoToDelete?: UserPhoto) => {
        photos.value = photoToDelete
            ? photos.value.filter(p => p.filepath !== photoToDelete.filepath)
            : [];
    };

    return { photos, takePhoto, deletePhoto };
};