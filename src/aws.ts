import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId: "6e98aa3ba003d2c279e79711ddbaec88",
    secretAccessKey: "ba8c1699ef36e159ce70203f14c77593ac2bf2d66e5f0172cc6a731135ea489b",
    endpoint: "https://964cc39b87cffa873b9b8c1d162da524.r2.cloudflarestorage.com"
});

/**
 * Upload a file to Cloudflare R2 storage
 * @param {string} fileName - The file name for storage
 * @param {string} localFilePath - The local path to the file
 */
export const uploadFile = async (fileName: string, localFilePath: string): Promise<void> => {
    try {
        const fileContent = fs.readFileSync(localFilePath);
        const response = await s3.upload({
            Body: fileContent,
            Bucket: 'vercel',
            Key: fileName.replace(/\\/g, '/')
        }).promise();
        console.log(response);
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("File upload failed");
    }
};