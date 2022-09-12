require('dotenv').config();
const AWS = require('aws-sdk');

const {
  S3_KEYID, S3_ACCESSKEY, S3_REGION,
} = process.env;

const credentials = new AWS.Credentials({
  accessKeyId: S3_KEYID,
  secretAccessKey: S3_ACCESSKEY,
});

const s3 = new AWS.S3({
  credentials,
  signatureVersion: 'v4',
  region: S3_REGION,
  s3ForcePathStyle: true,
});

module.exports = s3;
