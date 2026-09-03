import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.REACT_APP_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.REACT_APP_R2_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_R2_SECRET_KEY,
  },
});

const BUCKET_NAME = process.env.REACT_APP_R2_BUCKET_NAME;

/**
 * Uploads a file to Cloudflare R2
 * @param {File} file - The file object from an input element
 * @param {string} folder - Optional folder prefix (e.g. 'tasks', 'clients')
 * @returns {Promise<string>} - Returns the key (path) of the uploaded file
 */
export const uploadFileToR2 = async (file, folder = 'general') => {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${folder}/${Date.now()}-${sanitizedName}`;
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: new Uint8Array(await file.arrayBuffer()),
    ContentType: file.type,
  });

  await s3.send(command);
  return fileName; // Return the path so we can save it in the database
};

/**
 * Generates a temporary signed URL to view/download a file securely
 * @param {string} key - The file path (key) returned from uploadFileToR2
 * @returns {Promise<string>} - Returns the presigned URL
 */
export const getR2FileUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  // URL expires in 1 hour
  return await getSignedUrl(s3, command, { expiresIn: 3600 });
};

/**
 * Deletes a file from Cloudflare R2
 * @param {string} key - The file path (key) to delete
 */
export const deleteR2File = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  await s3.send(command);
};
