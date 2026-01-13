
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
