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
    // 1. Upload backdrop.png
    const pngPath = "C:\\Users\\Mr\\Downloads\\backdrop.png";
    if (fs.existsSync(pngPath)) {
        const pngContent = fs.readFileSync(pngPath);
        await s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: "website/backdrop.png",
        Body: pngContent,
        ContentType: "image/png"
        }));
        console.log("Uploaded backdrop.png");
    } else {
        console.log("backdrop.png not found at " + pngPath);
    }

    // 2. Delete old backdrop.jpg
    await s3.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: "website/backdrop.jpg"
    }));
    console.log("Deleted old backdrop.jpg");

  } catch (err) {
    console.error("Error:", err);
  }
}
run();
