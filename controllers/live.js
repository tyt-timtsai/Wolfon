require('dotenv').config();
const { orderBy } = require('lodash');
const Live = require('../models/live');
const User = require('../models/user');
const { s3, s3LiveUpload } = require('../utils/aws_s3');
// const { IMG_ENDPOINT } = process.env;

function signRoomId() {
  let roomId = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i += 1) {
    roomId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return roomId;
}

async function get(req, res) {
  let liveData;

  if (req.query.id) {
    liveData = await Live.getOne(req.query.id);
  } else {
    liveData = await Live.get();
  }
  res.status(200).json({ status: 200, message: 'success', liveData });
}

async function create(req, res) {
  // Prepare Data
  const { userData } = req;
  const { title, language, tags } = req.body;
  const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -5) + 800;
  let roomId = signRoomId();
  let searchResult = await Live.searchById(roomId);

  while (searchResult && searchResult.room_id === roomId) {
    roomId = signRoomId();
    // eslint-disable-next-line no-await-in-loop
    searchResult = await Live.searchById(roomId);
  }
  const s3Result = await s3LiveUpload(roomId, req.file);

  const liveData = {
    user_id: userData.id,
    streamer: userData.name,
    streamer_photo: userData.photo || null,
    title,
    language,
    room_id: roomId,
    tags,
    isStreaming: true,
    video_url: '',
    view: 0,
    cover_img: s3Result.Key,
    images: [],
    chats: [
      {
        sender: 'system',
        message: 'Live Start',
        timeStamp,
      },
    ],
    total_message: 1,
  };
  await Live.create(liveData);
  await User.addUserLive(userData.id, roomId);
  console.log(liveData);
  return res.status(200).json({ status: 200, message: 'success', liveData });
}

async function search(req, res) {
  let data;
  const keyword = req.query.keyword || null;

  if (keyword === null || keyword === 'all') {
    data = await Live.get();
  } else {
    const regex = new RegExp(`${keyword}`, 'i');
    data = await Live.searchByTitle(regex);
  }

  res.status(200).json({ status: 200, message: 'success', data });
}

async function uploadScreenshot(req, res) {
  let data;
  try {
    const { userData } = req;
    const { roomId } = req.body;
    const s3Result = await s3LiveUpload(roomId, req.file);
    data = { user: userData.id, url: s3Result.Key };
    await Live.uploadScreenshot(roomId, data);
  } catch (error) {
    console.log('upload screenshot error : ', error);
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
  const url = completeMultipartUploadOutput.Location;

  try {
    await Live.addRecordUrl(roomId, url);
    await Live.end(roomId);
  } catch (error) {
    console.log(error);
  }

  console.log('complete');
  return res.status(200).send(completeMultipartUploadOutput);
}

module.exports = {
  get, create, search, completeUpload, upload, uploadScreenshot,
};
