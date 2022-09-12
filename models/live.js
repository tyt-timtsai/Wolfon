const db = require('../utils/db');

async function create(liveData) {
  const result = await db.lives.insertOne(liveData);
  return result;
}

async function searchById(roomId) {
  const result = await db.lives.findOne({ room_id: roomId });
  return result;
}

module.exports = {
  create, searchById,
};
