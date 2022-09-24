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

async function addFollow(userId, targetId) {
  const result = {};
  result.user = await db.users.updateOne(
    { id: userId },
    { $addToSet: { follows: targetId } },
  );
  result.target = await db.users.updateOne(
    { id: targetId },
    { $addToSet: { followers: userId } },
  );
  return result;
}

async function deleteFollow(userId, targetId) {
  const result = {};
  result.user = await db.users.updateOne(
    { id: userId },
    { $pull: { follows: targetId } },
  );
  result.target = await db.users.updateOne(
    { id: targetId },
    { $pull: { followers: userId } },
  );
  return result;
}

async function getUserLive(userId) {
  const result = await db.lives.find({ user_id: userId }).toArray();
  return result;
}

async function addUserLive(userId, roomId) {
  const result = await db.users.updateOne(
    { id: userId },
    { $addToSet: { lives: roomId } },
  );
  return result;
}

async function getUserPost(userId) {
  const result = await db.posts.find({ user_id: userId }).toArray();
  return result;
}

async function getUserLikePost(postId) {
  const result = await db.posts.findOne({ id: postId });
  return result;
}

async function getUserFollowPost(postId) {
  const result = await db.posts.findOne({ id: postId });
  return result;
}

async function addUserPost(userId, postId) {
  const result = await db.users.updateOne(
    { user_id: userId },
    { $addToSet: { posts: postId } },
  );
  return result;
}

async function getUserFriend(userId) {
  const result = await db.users.findOne({ user_id: userId });
  return result;
}

async function updateUserAvatar(userId, imagePath) {
  const result = await db.users.updateOne(
    { id: userId },
    { $set: { photo: imagePath } },
    { upsert: true },
  );
  return result;
}

async function updateUserBackgroundImage(userId, imagePath) {
  const result = await db.users.updateOne(
    { id: userId },
    { $set: { background_image: imagePath } },
    { upsert: true },
  );
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
  addFollow,
  deleteFollow,
  getUserLive,
  getUserPost,
  getUserLikePost,
  getUserFollowPost,
  getUserFriend,
  getUserCommunity,
  addUserLive,
  addUserPost,
  updateUserAvatar,
  updateUserBackgroundImage,
};
