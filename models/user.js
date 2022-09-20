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

async function search(keyword) {
  const result = await db.users.find({ name: { $regex: keyword } }).toArray();
  return result;
}

async function addFriend(userId, targetId) {
  const result = {};
  result.user = await db.users.updateOne(
    { id: userId },
    { $addToSet: { friends: targetId } },
  );

  result.terget = await db.users.updateOne(
    { id: targetId },
    { $addToSet: { friends: userId } },
  );
  return result;
}

async function deleteFriend(userId, targetId) {
  const result = {};
  result.user = await db.users.updateOne(
    { id: userId },
    { $pull: { friends: targetId } },
  );

  result.terget = await db.users.updateOne(
    { id: targetId },
    { $pull: { friends: userId } },
  );
  return result;
}

async function addApplyFriend(userId, targetId) {
  const result = await db.users.updateOne(
    { id: userId },
    { $addToSet: { apply_friends: targetId } },
  );
  return result;
}

async function deleteApplyFriend(targetId, userId) {
  const result = await db.users.updateOne(
    { id: targetId },
    { $pull: { apply_friends: userId } },
  );
  return result;
}

async function addPendingFriend(userId, targetId) {
  const result = await db.users.updateOne(
    { id: userId },
    { $addToSet: { pending_friends: targetId } },
  );
  return result;
}

async function deletePendingFriend(userId, targetId) {
  const result = await db.users.updateOne(
    { id: userId },
    { $pull: { pending_friends: targetId } },
  );
  return result;
}

async function addFellow(userId, targetId) {
  const result = {};
  result.user = await db.users.updateOne(
    { id: userId },
    { $addToSet: { fellows: targetId } },
  );
  result.terget = await db.users.updateOne(
    { id: targetId },
    { $addToSet: { fellowers: userId } },
  );
  return result;
}

async function deleteFellow(userId, targetId) {
  const result = {};
  result.user = await db.users.updateOne(
    { id: userId },
    { $pull: { fellows: targetId } },
  );
  result.terget = await db.users.updateOne(
    { id: targetId },
    { $pull: { fellowers: userId } },
  );
  return result;
}

async function getUserLive(userId) {
  const result = await db.lives.find({ user_id: userId }).toArray();
  return result;
}

async function getUserPost(userId) {
  const result = await db.posts.find({ user_id: userId }).toArray();
  return result;
}

async function getUserFriend(userId) {
  const result = await db.users.findOne({ user_id: userId });
  return result;
}

async function getUserCommunity(userId) {
  const result = await db.lives.find({ user_id: userId }).toArray();
  return result;
}

module.exports = {
  signUp,
  signIn,
  get,
  search,
  addFriend,
  deleteFriend,
  addApplyFriend,
  deleteApplyFriend,
  addPendingFriend,
  deletePendingFriend,
  addFellow,
  deleteFellow,
  getUserLive,
  getUserPost,
  getUserFriend,
  getUserCommunity,
};
