const db = require('../utils/db');

async function get() {
  const result = await db.lives.find().toArray();
  return result;
}

async function create(liveData) {
  const result = await db.lives.insertOne(liveData);
  return result;
}

async function searchById(roomId) {
  const result = await db.lives.findOne({ room_id: roomId });
  return result;
}

async function searchByTitle(keyword) {
  const result = await db.lives.find({ title: { $regex: keyword } }).toArray();
  return result;
}

async function addRecordUrl(roomId, url) {
  const result = await db.lives.updateOne({ room_id: roomId }, { $set: { video_url: url } });
  return result;
}

module.exports = {
  get, create, searchById, searchByTitle, addRecordUrl,
};
