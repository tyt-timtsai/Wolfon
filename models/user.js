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

async function addFriend(userId, targetId) {
  const result = {};
  result.user = await db.users.updateOne(
    { id: userId },
    { $addToSet: { friends: targetId } },
  );

  result.applier = await db.users.updateOne(
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

  result.applier = await db.users.updateOne(
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

module.exports = {
  signUp,
  signIn,
  get,
  addFriend,
  deleteFriend,
  addApplyFriend,
  deleteApplyFriend,
  addPendingFriend,
  deletePendingFriend,
};
