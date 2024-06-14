import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId: process.env.ACCESS_ID,
    secretAccessKey: process.env.ACCESS_SECRET,
    endpoint: process.env.ENDPOINT,
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