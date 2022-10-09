require('dotenv').config();
const JSValidator = require('validator');
const Post = require('../models/post');
const User = require('../models/user');
const jwt = require('../utils/JWT');

const validator = JSValidator.default;

const { JWT_SECRET } = process.env;

function createDate() {
  return (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -5);
}

async function create(req, res) {
  // Prepare Data
  const { userData } = req;
  const date = createDate();
  const { title, subtitle, content } = req.body.data;
  const postData = {
    user_id: userData._id,
    author: userData.name,
    author_photo: userData.photo || null,
    likes: [],
    followers: [],
    view: 0,
    created_dt: date,
    updated_dt: date,
    title,
    subtitle,
    content,
    comments: [],
  };

  const result = await Post.create(postData);
  await User.addUserPost(userData._id, result.insertedId);
  const updatedUserData = await User.get(userData._id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);

  return res.status(200).json({ status: 200, message: 'success', data: { token, id: result.insertedId } });
}

async function get(req, res) {
  const type = req.params.id;
  let posts;
  let userData;
  if (req.headers.authorization) {
    userData = await jwt.verify(req.headers.authorization, JWT_SECRET);
  }
  let regex;
  let data;

  try {
    switch (type) {
      case 'all':
        data = await Post.getAll();
        break;

      case 'user':
        data = await Post.getUserPost(userData._id);
        break;

      case 'search':
        regex = new RegExp(`${req.query.keyword}`, 'i');
        data = await Post.search(regex);
        break;

      default:
        console.log(type);
        posts = await Post.getOne(type);
        if (!posts.value) {
          return res.status(400).json({ status: 400, message: 'fail', data: 'Post Not Found' });
        }
        userData = await User.get(posts.value.user_id);
        delete userData.password;
        data = { post: posts.value, userData };
        break;
    }

    return res.status(200).json({ status: 200, message: 'success', data });
  } catch (error) {
    console.log('GET Post function error : ', error);
    console.log('GET Post function type : ', type);
    data = error;
    return res.status(500).json({ status: 500, message: 'fail', data });
  }
}

async function update(req, res) {
  const {
    postId, title, subtitle, content,
  } = req.body;
  const { userData } = req;
  const updatedDate = createDate();
  if (validator.isEmpty(postId)) {
    return res.status(400).json({ status: 400, message: 'ID is empty!' });
  }
  if (validator.isEmpty(title)) {
    return res.status(400).json({ status: 400, message: 'Title is empty!' });
  }
  if (validator.isEmpty(subtitle)) {
    return res.status(400).json({ status: 400, message: 'Subtitle is empty!' });
  }
  if (validator.isEmpty(content)) {
    return res.status(400).json({ status: 400, message: 'Content is empty!' });
  }

  try {
    await Post.update(postId, title, subtitle, content, updatedDate);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: 'Updated failed' });
  }
  return res.status(200).json({ status: 200, message: 'Post Updated' });
}

async function deletePost(req, res) {
  // Not yet _id
  const { id } = req.params;
  const { _id } = req.userData;
  if (validator.isEmpty(_id)) {
    return res.status(400).json({ status: 400, message: 'ID is empty!' });
  }
  const post = await Post.getOne(id);
  console.log(post);
  const likes = [];
  const followers = [];

  for (let i = 0; i < post.value.likes.length; i += 1) {
    likes.push(Post.unlike(id, post.value.likes[i]));
  }
  for (let i = 0; i < post.value.followers.length; i += 1) {
    followers.push(Post.unfollow(id, post.value.followers[i]));
  }

  try {
    await Post.deletePost(id);
    await User.deletePost(_id, id);
    await Promise.all(likes);
    await Promise.all(followers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: 'Updated failed' });
  }
  const updatedUserData = await User.get(req.userData._id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'Post Deleted', data: token });
}

async function like(req, res) {
  const postId = req.params.id;
  const { userData } = req;
  console.log(postId);
  if (userData.like_posts.includes(postId)) {
    await Post.unlike(postId, userData._id);
  } else {
    await Post.like(postId, userData._id);
  }
  const updatedUserData = await User.get(userData._id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
}

async function follow(req, res) {
  const postId = req.params.id;
  const { userData } = req;
  if (userData.follow_posts.includes(postId)) {
    await Post.unfollow(postId, userData._id);
  } else {
    await Post.follow(postId, userData._id);
  }
  const updatedUserData = await User.get(userData._id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
}

module.exports = {
  get, create, update, deletePost, like, follow,
};
