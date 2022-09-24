const db = require('../utils/db');

async function get(userId) {
  const result = await db.posts.find({ user_id: userId }).toArray();
  return result;
}

async function search(keyword) {
  const result = await db.posts.find({ title: { $regex: keyword } }).toArray();
  return result;
}

async function getOne(postId) {
  const result = await db.posts.findOneAndUpdate({ id: postId }, { $inc: { view: 1 } });
  return result;
}

async function getAll() {
  const result = await db.posts.find().toArray();
  return result;
}

async function create(postData) {
  const result = await db.posts.insertOne(postData);
  return result;
}

async function like(postId, userId) {
  const result = await db.posts.updateOne({ id: postId }, { $addToSet: { likes: userId } });
  await db.users.updateOne({ id: userId }, { $addToSet: { like_posts: postId } });
  return result;
}

async function unlike(postId, userId) {
  const result = await db.posts.updateOne({ id: postId }, { $pull: { likes: userId } });
  await db.users.updateOne({ id: userId }, { $pull: { like_posts: postId } });
  return result;
}

async function follow(postId, userId) {
  await db.posts.updateOne({ id: postId }, { $addToSet: { followers: userId } });
  const result = await db.users.updateOne({ id: userId }, { $addToSet: { follow_posts: postId } });
  return result;
}

async function unfollow(postId, userId) {
  await db.posts.updateOne(
    { id: postId },
    { $pull: { followers: userId } },
  );
  const result = await db.users.updateOne({ id: userId }, { $pull: { follow_posts: postId } });
  return result;
}

async function updateAuthorAvatar(userId, imagePath) {
  const result = await db.posts.updateMany(
    { user_id: userId },
    { $set: { author_photo: imagePath } },
    { upsert: true },
  );
  return result;
}

module.exports = {
  get, search, getOne, getAll, create, like, unlike, follow, unfollow, updateAuthorAvatar,
};
