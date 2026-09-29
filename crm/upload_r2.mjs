import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: 'https://06c0bed1fd7b4a7923d9ab4d899da5e9.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: '151e301c7ca9f5370e590c14de885e4a',
    secretAccessKey: '35d26691b60485bc3a9cbfc3d0ab95aee4b0ed9bfe44e6ad2fb7e1c9aa70b560',
  },
});

const fileStream = fs.createReadStream('../public/dmain.mp4');

const uploadParams = {
  Bucket: 'dayal-crm-docs',
  Key: 'website/dmain.mp4',
  Body: fileStream,
  ContentType: 'video/mp4',
};

async function run() {
  try {
    const data = await s3.send(new PutObjectCommand(uploadParams));
    console.log("Success", data);
  } catch (err) {
    console.log("Error", err);
  }
}
run();
