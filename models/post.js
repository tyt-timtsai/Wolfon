const { ObjectId } = require('mongodb');
const db = require('../utils/db');

async function getUserPost(userId) {
  const result = await db.posts.find({ user_id: ObjectId(userId) }).toArray();
  return result;
}

async function search(keyword) {
  const result = await db.posts.find({ title: { $regex: keyword } }).toArray();
  return result;
}

async function getOne(postId) {
  const result = await db.posts.findOneAndUpdate({ _id: ObjectId(postId) }, { $inc: { view: 1 } });
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

async function update(_id, title, subtitle, content, updated_dt) {
  const result = await db.posts.updateOne({ _id: ObjectId(_id) }, {
    $set: {
      title, subtitle, content, updated_dt,
    },
  });
  return result;
}

async function deletePost(_id) {
  const result = await db.posts.deleteOne({ _id: ObjectId(_id) });
  return result;
}

async function like(postId, userId) {
  const result = await db.posts.updateOne(
    {
      _id: ObjectId(postId),
    },
    {
      $addToSet: { likes: ObjectId(userId) },
    },
  );
  await db.users.updateOne({
    _id: ObjectId(userId),
  }, {
    $addToSet: { like_posts: ObjectId(postId) },
  });
  return result;
}

async function unlike(postId, userId) {
  const result = await db.posts.updateOne({
    _id: ObjectId(postId),
  }, {
    $pull: { likes: ObjectId(userId) },
  });
  await db.users.updateOne({
    _id: ObjectId(userId),
  }, {
    $pull: { like_posts: ObjectId(postId) },
  });
  return result;
}

async function follow(postId, userId) {
  await db.posts.updateOne({
    _id: ObjectId(postId),
  }, {
    $addToSet: { followers: ObjectId(userId) },
  });
  const result = await db.users.updateOne({
    _id: ObjectId(userId),
  }, {
    $addToSet: { follow_posts: ObjectId(postId) },
  });
  return result;
}

async function unfollow(postId, userId) {
  await db.posts.updateOne(
    { _id: ObjectId(postId) },
    { $pull: { followers: ObjectId(userId) } },
  );
  const result = await db.users.updateOne({
    _id: ObjectId(userId),
  }, {
    $pull: { follow_posts: ObjectId(postId) },
  });
  return result;
}

async function updateAuthorAvatar(userId, imagePath) {
  const result = await db.posts.updateMany(
    { user_id: ObjectId(userId) },
    { $set: { author_photo: imagePath } },
    { upsert: false },
  );
  return result;
}

module.exports = {
  getUserPost,
  search,
  getOne,
  getAll,
  create,
  update,
  deletePost,
  like,
  unlike,
  follow,
  unfollow,
  updateAuthorAvatar,
};
