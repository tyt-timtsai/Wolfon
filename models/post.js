const db = require('../utils/db');

async function get(userId) {
  const result = await db.posts.find({ user_id: userId }).toArray();
  return result;
}

async function create(postData) {
  const result = await db.posts.insertOne(postData);
  return result;
}

module.exports = { get, create };
