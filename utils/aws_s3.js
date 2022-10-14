require('dotenv').config();
const AWS = require('aws-sdk');
const path = require('path');

const {
  S3_KEYID, S3_ACCESSKEY, S3_REGION, S3_BUCKET,
} = process.env;

const credentials = new AWS.Credentials({
  accessKeyId: S3_KEYID,
  secretAccessKey: S3_ACCESSKEY,
});

const s3 = new AWS.S3({
  credentials,
  region: S3_REGION,
  signatureVersion: 'v4',
  s3ForcePathStyle: true,
});

async function s3UserUpload(userEmail, file) {
  const params = {
    Bucket: S3_BUCKET,
    Body: file.buffer,
    Key: `users/${userEmail}/wolfon_${Date.now()}${path.extname(file.originalname)}`,
  };
  return s3.upload(params).promise(); // this will upload file to S3
}

async function s3LiveUpload(roomId, file) {
  const params = {
    Bucket: S3_BUCKET,
    Body: file.buffer,
    Key: `lives/${roomId}/wolfon_${Date.now()}${path.extname(file.originalname)}`,
  };
  return s3.upload(params).promise(); // this will upload file to S3
}

async function s3DeleteObject(filePath) {
  const params = {
    Bucket: S3_BUCKET,
    Key: filePath,
  };
  return s3.deleteObject(params).promise(); // this will upload file to S3
}

module.exports = {
  s3, s3UserUpload, s3LiveUpload, s3DeleteObject,
};
