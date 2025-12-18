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
    maxW = 800,
    maxH = 800,
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

    ctx.drawImage(img, 0, 0, width, height);

    let q = 0.7;
    while (q >= 0.35) {
        const out = canvas.toDataURL('image/jpeg', q);
        if (estimateBytes(out) <= maxBytes) return out;
        q -= 0.08;
    }
    return canvas.toDataURL('image/jpeg', 0.35);
}

export const usePhotoGallery = () => {
    const photos = ref<UserPhoto[]>([]);

    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            source: CameraSource.Camera,
            resultType: CameraResultType.DataUrl,
            quality: 80,
            width: 2000,
            height: 2000,
        });

        const compressed = await compressDataUrl(
            photo.dataUrl!,
            800,
            800,
            450_000
        );

        photos.value = [{
            filepath: Date.now() + '.jpg',
            webviewPath: compressed,
        }];
    };

    const deletePhoto = (photoToDelete?: UserPhoto) => {
        photos.value = photoToDelete
            ? photos.value.filter(p => p.filepath !== photoToDelete.filepath)
            : [];
    };

    return {
        photos, takePhoto, deletePhoto
    };
};
