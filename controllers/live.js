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

async function get(req, res) {
  const liveData = await Live.get();
  res.status(200).json({ status: 200, message: 'success', liveData });
}

async function create(req, res) {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(403).json({ status: 403, message: 'Unauthorization' });
  }
  console.log(req.body);
  const userData = await jwt.verify(auth, JWT_SECRET);
  const { title, language, tags } = req.body;
  const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -5) + 800;
  let roomId = signRoomId();
  let searchResult = await Live.searchById(roomId);
  console.log('roomId : ', roomId);

  while (searchResult && searchResult.room_id === roomId) {
    roomId = signRoomId();
    // eslint-disable-next-line no-await-in-loop
    searchResult = await Live.searchById(roomId);
  }
  const liveData = {
    user_id: userData.id,
    streamer: userData.name,
    title,
    language,
    // room_id: roomId,
    room_id: 'room1',
    tags,
    isStreaming: true,
    video_url: '',
    view: 0,
    chats: [
      {
        sender: 'system',
        message: 'Live Start',
        timeStamp,
      },
    ],
    total_message: 1,
  };
  // const result = await Live.create(liveData);
  // console.log(result);
  return res.status(200).json({ status: 200, message: 'success', liveData });
}

async function search(req, res) {
  const keyword = req.query.keyword || null;
  let data;
  console.log(keyword);
  if (keyword === null || keyword === 'all') {
    data = await Live.get();
  } else {
    const regex = new RegExp(`${keyword}`, 'i');
    data = await Live.searchByTitle(regex);
  }
  res.status(200).json({ status: 200, message: 'success', data });
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
  console.log('Get presign url');
}

async function completeUpload(req, res) {
  console.log('in complete');
  const {
    fileId, fileKey, parts, roomId,
  } = req.body;
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileKey,
    UploadId: fileId,
    MultipartUpload: {
      Parts: orderBy(parts, ['PartNumber'], ['asc']),
    },
  };
  const completeMultipartUploadOutput = await s3.completeMultipartUpload(params).promise();
  console.log(completeMultipartUploadOutput);
  const url = completeMultipartUploadOutput.Location;
  console.log(roomId);
  console.log(url);
  try {
    await Live.addRecordUrl(roomId, url);
  } catch (error) {
    console.log(error);
  }
  res.status(200).send(completeMultipartUploadOutput);
  console.log('complete');
}

module.exports = {
  get, create, search, completeUpload, upload,
};
