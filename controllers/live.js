require('dotenv').config();
const { orderBy } = require('lodash');
const jwt = require('../utils/JWT');
const s3 = require('../utils/aws_s3');
const Live = require('../models/live');

const { JWT_SECRET } = process.env;

function signRoomId() {
  let roomId = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i += 1) {
    roomId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return roomId;
}

async function getLive(req, res) {
  res.status(200).send('get live');
}

async function createLive(req, res) {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(403).json({ status: 403, message: 'Unauthorization' });
  }
  const userData = await jwt.verify(auth, JWT_SECRET);
  const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -5);
  let roomId;
  roomId = signRoomId();
  console.log('roomId : ', roomId);
  const searchResult = await Live.searchById(roomId);

  while (searchResult && searchResult.room_id === roomId) {
    roomId = signRoomId();
  }
  const liveData = {
    user_id: userData.id,
    streamer: userData.name,
    room_id: roomId,
    video_url: '',
    chats: [
      {
        sender: 'system',
        message: 'Live Start',
        timeStamp,
      },
    ],
    total_message: 1,
  };
  return res.status(200).json({ status: 200, message: 'success', liveData });
}

async function upload(req, res) {
  const { fileName, parts } = req.body;
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    ContentType: 'webm',
  };
  const multipartUpload = await s3.createMultipartUpload(params).promise();
  const { UploadId, Key } = multipartUpload;

  // get
  console.log('get Upload ID & Key');

  const MultipartParams = {
    Bucket: process.env.S3_BUCKET,
    Key,
    UploadId,
    Expires: 60 * 60,
  };
  const promises = [];
  for (let i = 0; i < parts; i += 1) {
    promises.push(
      s3.getSignedUrlPromise('uploadPart', {
        ...MultipartParams,
        PartNumber: i + 1,
      }),
    );
  }
  const signedUrls = await Promise.all(promises);
  // assign to each URL the index of the part to which it corresponds
  const partSignedUrlList = signedUrls.map((signedUrl, index) => ({
    signedUrl,
    PartNumber: index + 1,
  }));
  res.send({
    fileId: UploadId,
    fileKey: Key,
    parts: partSignedUrlList,
  });
  console.log(partSignedUrlList);
  console.log('Get presign url');
}

async function completeUpload(req, res) {
  console.log('in complete');
  const { fileId, fileKey, parts } = req.body;
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileKey,
    UploadId: fileId,
    MultipartUpload: {
      Parts: orderBy(parts, ['PartNumber'], ['asc']),
    },
  };
  console.log(params);
  const completeMultipartUploadOutput = await s3.completeMultipartUpload(params).promise();
  console.log(completeMultipartUploadOutput);
  res.send(completeMultipartUploadOutput);
  console.log('complete');
}

module.exports = {
  getLive, createLive, completeUpload, upload,
};
