const { ObjectId } = require('mongodb');
const db = require('../utils/db');

async function get() {
  const result = await db.lives.find().toArray();
  return result;
}

async function getOne(_id) {
  const result = await db.lives.findOne({ _id: ObjectId(_id) });
  return result;
}

async function create(liveData) {
  const result = await db.lives.insertOne(liveData);
  return result;
}

async function deleteLive(_id) {
  const result = await db.lives.deleteOne({ _id: ObjectId(_id) });
  return result;
}

async function end(roomId) {
  const result = await db.lives.updateOne(
    { _id: ObjectId(roomId) },
    { $set: { isStreaming: false } },
  );
  return result;
}

async function searchById(roomId) {
  const result = await db.lives.findOne({ id: roomId });
  return result;
}

async function searchByTitle(keyword) {
  const result = await db.lives.find({ title: { $regex: keyword } }).toArray();
  return result;
}

async function addRecordUrl(roomId, url) {
  const result = await db.lives.updateOne({ _id: ObjectId(roomId) }, { $set: { video_url: url } });
  return result;
}

async function uploadScreenshot(roomId, data) {
  const result = await db.lives.updateOne({ _id: ObjectId(roomId) }, { $push: { images: data } });
  return result;
}

async function updateStreamerAvatar(userId, imagePath) {
  const result = await db.lives.updateMany(
    { user_id: ObjectId(userId) },
    { $set: { streamer_photo: imagePath } },
  );
  return result;
}

module.exports = {
  get,
  getOne,
  create,
  deleteLive,
  end,
  searchById,
  searchByTitle,
  addRecordUrl,
  uploadScreenshot,
  updateStreamerAvatar,
};
