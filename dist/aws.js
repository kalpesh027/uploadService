"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: "6e98aa3ba003d2c279e79711ddbaec88",
    secretAccessKey: "ba8c1699ef36e159ce70203f14c77593ac2bf2d66e5f0172cc6a731135ea489b",
    endpoint: "https://964cc39b87cffa873b9b8c1d162da524.r2.cloudflarestorage.com"
});
/**
 * Upload a file to Cloudflare R2 storage
 * @param {string} fileName - The file name for storage
 * @param {string} localFilePath - The local path to the file
 */
const uploadFile = (fileName, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileContent = fs_1.default.readFileSync(localFilePath);
        const response = yield s3.upload({
            Body: fileContent,
            Bucket: 'vercel',
            Key: fileName.replace(/\\/g, '/')
        }).promise();
        console.log(response);
    }
    catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("File upload failed");
    }
});
exports.uploadFile = uploadFile;
