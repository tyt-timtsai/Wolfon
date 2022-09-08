const db = require('../utils/db');

async function signUp(userData) {
  const result = await db.users.insertOne(userData);
  return result;
}

async function signIn(email) {
  const result = await db.users.findOne({ email });
  return result;
}

async function get(id) {
  const result = await db.users.findOne({ id });
  return result;
}

module.exports = { signUp, signIn, get };
