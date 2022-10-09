const { ObjectId } = require('mongodb');
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
  const result = await db.users.findOne({ _id: ObjectId(id) });
  return result;
}

async function search(keyword) {
  const result = await db.users.find({ name: { $regex: keyword } }).toArray();
  return result;
}

async function addFriend(userId, targetId) {
  const result = {};
  result.user = await db.users.updateOne(
    { _id: ObjectId(userId) },
    { $addToSet: { friends: ObjectId(targetId) } },
  );

  result.terget = await db.users.updateOne(
    { _id: ObjectId(targetId) },
    { $addToSet: { friends: ObjectId(userId) } },
  );
  return result;
}

async function deleteFriend(userId, targetId) {
  const result = {};
  result.user = await db.users.updateOne(
    { _id: ObjectId(userId) },
    { $pull: { friends: ObjectId(targetId) } },
  );

  result.terget = await db.users.updateOne(
    { _id: ObjectId(targetId) },
    { $pull: { friends: ObjectId(userId) } },
  );
  return result;
}

async function addApplyFriend(userId, targetId) {
  const result = await db.users.updateOne(
    { _id: ObjectId(userId) },
    { $addToSet: { apply_friends: ObjectId(targetId) } },
  );
  return result;
}

async function deleteApplyFriend(userId, targetId) {
  const result = await db.users.updateOne(
    { _id: ObjectId(userId) },
    { $pull: { apply_friends: ObjectId(targetId) } },
  );
  return result;
}

async function addPendingFriend(userId, targetId) {
  const result = await db.users.updateOne(
    { _id: ObjectId(userId) },
    { $addToSet: { pending_friends: ObjectId(targetId) } },
  );
  return result;
}

async function deletePendingFriend(userId, targetId) {
  const result = await db.users.updateOne(
    { _id: ObjectId(userId) },
    { $pull: { pending_friends: ObjectId(targetId) } },
  );
  return result;
}

async function addFollow(userId, targetId) {
  const result = {};
  result.user = await db.users.updateOne(
    { _id: ObjectId(userId) },
    { $addToSet: { follows: ObjectId(targetId) } },
  );
  result.target = await db.users.updateOne(
    { _id: ObjectId(targetId) },
    { $addToSet: { followers: ObjectId(userId) } },
  );
  return result;
}

async function deleteFollow(userId, targetId) {
  const result = {};
  result.user = await db.users.updateOne(
    { _id: ObjectId(userId) },
    { $pull: { follows: ObjectId(targetId) } },
  );
  result.target = await db.users.updateOne(
    { _id: ObjectId(targetId) },
    { $pull: { followers: ObjectId(userId) } },
  );
  return result;
}

async function getUserLive(userId) {
  const result = await db.lives.find({ user_id: userId }).toArray();
  return result;
}

async function addUserLive(userId, roomId) {
  const result = await db.users.updateOne(
    { _id: ObjectId(userId) },
    { $addToSet: { lives: roomId } },
  );
  return result;
}

async function deleteUserLive(userId, liveId) {
  const result = await db.users.updateOne(
    { _id: ObjectId(userId) },
    { $pull: { lives: ObjectId(liveId) } },
  );
  return result;
}

async function getUserPost(userId) {
  const result = await db.posts.find({ user_id: userId }).toArray();
  return result;
}

async function getUserLikePost(postId) {
  const result = await db.posts.findOne({ _id: ObjectId(postId) });
  return result;
}

async function getUserFollowPost(postId) {
  const result = await db.posts.findOne({ _id: ObjectId(postId) });
  return result;
}

async function addUserPost(userId, postId) {
  const result = await db.users.updateOne(
    { _id: ObjectId(userId) },
    { $addToSet: { posts: ObjectId(postId) } },
  );
  return result;
}

async function deletePost(userId, postId) {
  const result = await db.users.updateOne(
    { _id: ObjectId(userId) },
    { $pull: { posts: ObjectId(postId) } },
  );
  return result;
}

async function getUserFriend(userId) {
  const result = await db.users.findOne({ _id: ObjectId(userId) });
  return result;
}

async function updateUserAvatar(userId, imagePath) {
  const result = await db.users.updateOne(
    { _id: ObjectId(userId) },
    { $set: { photo: imagePath } },
    { upsert: true },
  );
  return result;
}

async function updateUserBackgroundImage(userId, imagePath) {
  const result = await db.users.updateOne(
    { _id: ObjectId(userId) },
    { $set: { background_image: imagePath } },
    { upsert: true },
  );
  return result;
}

async function getUserCommunity(userId) {
  const result = await db.lives.find({ user_id: ObjectId(userId) }).toArray();
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
  deletePost,
  deleteUserLive,
  updateUserAvatar,
  updateUserBackgroundImage,
};
