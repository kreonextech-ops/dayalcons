const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const s3 = new S3Client({
  region: "auto",
  endpoint: "https://06c0bed1fd7b4a7923d9ab4d899da5e9.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "151e301c7ca9f5370e590c14de885e4a",
    secretAccessKey: "35d26691b60485bc3a9cbfc3d0ab95aee4b0ed9bfe44e6ad2fb7e1c9aa70b560",
  },
});

const BUCKET_NAME = "dayal-crm-docs";

async function run() {
  try {
    // 1. Upload dayalhero.mp4
    const mp4Path = "C:\\Users\\Mr\\Downloads\\dayalhero.mp4";
    const mp4Content = fs.readFileSync(mp4Path);
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: "website/dayalhero.mp4",
      Body: mp4Content,
      ContentType: "video/mp4"
    }));
    console.log("Uploaded dayalhero.mp4");

    // 2. Upload backdrop.jpg
    const jpgPath = "C:\\Users\\Mr\\Downloads\\backdrop.jpg";
    const jpgContent = fs.readFileSync(jpgPath);
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: "website/backdrop.jpg",
      Body: jpgContent,
      ContentType: "image/jpeg"
    }));
    console.log("Uploaded backdrop.jpg");

    // 3. Delete old hero.mp4
    await s3.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: "website/hero.mp4"
    }));
    console.log("Deleted old hero.mp4");

  } catch (err) {
    console.error("Error:", err);
  }
}
run();
