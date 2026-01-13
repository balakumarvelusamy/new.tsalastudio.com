
export const compressImage = async (file: File): Promise<File> => {
    // Configuration
    const MAX_SIZE_MB = 1;
    const MAX_DIMENSION = 1500;
    const COMPRESSION_QUALITY = 0.8;

    // If file is already small enough, return strictly.
    if (file.size <= MAX_SIZE_MB * 1024 * 1024) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > height) {
                    if (width > MAX_DIMENSION) {
                        height = Math.round((height * MAX_DIMENSION) / width);
                        width = MAX_DIMENSION;
                    }
                } else {
                    if (height > MAX_DIMENSION) {
                        width = Math.round((width * MAX_DIMENSION) / height);
                        height = MAX_DIMENSION;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Compress
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Canvas to Blob failed'));
                            return;
                        }

                        // Create new File object
                        const newFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });

                        console.log(`Image compressed: ${file.size} -> ${newFile.size} bytes`);
                        resolve(newFile);
                    },
                    'image/jpeg',
                    COMPRESSION_QUALITY
                );
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};
