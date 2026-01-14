
import AWS from 'aws-sdk';
import config from '../../config.json';

export interface S3UploadResult {
    url: string;
    key: string;
}

export const uploadToS3 = async (
    file: File | Blob,
    filename: string,
    secret: { s3key: string; s3secret: string },
    folder: string = 'course'
): Promise<string> => {
    // Parse Bucket and Prefix from config.S3_BUCKET_NAME
    // Format: "bucketname/path/to/folder/"
    const s3ConfigString = (config as any).S3_BUCKET_NAME || 'ssndigitalmedia/tsalastudio/prod/';
    const parts = s3ConfigString.split('/').filter(Boolean);
    const bucketName = parts[0]; // "ssndigitalmedia"
    const prefixPath = parts.slice(1).join('/'); // "tsalastudio/prod"

    const REGION = "ap-south-1";

    AWS.config.update({
        accessKeyId: secret.s3key,
        secretAccessKey: secret.s3secret,
        region: REGION
    });

    const s3 = new AWS.S3({
        params: { Bucket: bucketName },
        region: REGION,
    });

    // Ensure filename is clean
    const cleanFilename = filename.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '');

    // Construct Key: prefix + folder + filename
    const key = `${prefixPath}/${folder}/${cleanFilename}`;

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: file,
        ACL: 'public-read',
        ContentType: file.type || 'image/jpeg'
    };

    return new Promise((resolve, reject) => {
        s3.upload(params)
            .send((err: any, data: any) => {
                if (err) {
                    console.error("S3 Upload Error", err);
                    reject(err);
                } else {
                    // Construct URL driven by config
                    const bucketUrl = (config as any).bucketurl || `https://${bucketName}.s3.amazonaws.com/${prefixPath}/`;
                    // Ensure bucketUrl ends with slash
                    const baseUrl = bucketUrl.endsWith('/') ? bucketUrl : `${bucketUrl}/`;

                    const finalUrl = `${baseUrl}${folder}/${cleanFilename}`;
                    resolve(finalUrl);
                }
            });
    });
};

export const deleteFromS3 = async (
    fileUrl: string,
    secret: { s3key: string; s3secret: string }
): Promise<boolean> => {
    // Parse Bucket and Key from URL
    // Expected URL format: https://bucket.s3.region.amazonaws.com/prefix/folder/filename
    // Or if custom bucketurl is used: https://domain.com/path/to/folder/filename

    try {
        const s3ConfigString = (config as any).S3_BUCKET_NAME || 'ssndigitalmedia/tsalastudio/prod/';
        const parts = s3ConfigString.split('/').filter(Boolean);
        const bucketName = parts[0]; // "ssndigitalmedia"

        // We need to extract the "Key" from the full URL.
        // The Key typically starts after the bucket domain essentially.
        // simpler approach: The key is the part that was constructed in uploadToS3: `${prefixPath}/${folder}/${cleanFilename}`

        // Let's try to match the URL to get the key. 
        // URL: .../tsalastudio/prod/slider/filename.jpg
        // Key: tsalastudio/prod/slider/filename.jpg

        // If we split by bucketName, we might get it. 
        // Url structure is tricky if custom domains are used.
        // Let's rely on the assumption that the fileUrl contains the key suffix.

        // Safe bet: The key is built from config prefix + folder + filename.
        // We can't easily reverse engineer the filename from URL if URL structure varies widely.
        // BUT, for standard S3 URLs:

        let key = '';
        if (fileUrl.includes('.amazonaws.com/')) {
            const urlParts = fileUrl.split('.amazonaws.com/');
            if (urlParts.length > 1) {
                key = decodeURIComponent(urlParts[1]);
            }
        } else {
            // Fallback or custom domain: try to strip the protocol and domain.
            // This is risky without strict knowledge of the custom domain.
            // Let's assume the user is using the standard setup as per config.
            const bucketUrl = (config as any).bucketurl;
            if (bucketUrl && fileUrl.startsWith(bucketUrl)) {
                // Remove the bucketUrl base to get relative path
                // bucketUrl: https://.../tsalastudio/prod/
                // fileUrl: https://.../tsalastudio/prod/slider/abc.jpg
                // keysuffix: slider/abc.jpg
                // Prefix: tsalastudio/prod
                // Full Key: tsalastudio/prod/slider/abc.jpg

                const relativePath = fileUrl.replace(bucketUrl, '');
                const prefixPath = parts.slice(1).join('/');
                key = `${prefixPath}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;
            }
        }

        if (!key) {
            console.error("Could not parse S3 Key from URL:", fileUrl);
            return false;
        }

        const REGION = "ap-south-1";
        AWS.config.update({
            accessKeyId: secret.s3key,
            secretAccessKey: secret.s3secret,
            region: REGION
        });

        const s3 = new AWS.S3({
            params: { Bucket: bucketName },
            region: REGION,
        });

        await s3.deleteObject({
            Bucket: bucketName,
            Key: key
        }).promise();

        console.log("Deleted from S3:", key);
        return true;

    } catch (e) {
        console.error("Error deleting from S3:", e);
        return false;
    }
};
