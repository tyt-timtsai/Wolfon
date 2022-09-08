require('dotenv').config();
const Post = require('../models/post');
const User = require('../models/user');
const jwt = require('../utils/JWT');

const { JWT_SECRET } = process.env;

async function create(req, res) {
  const auth = req.headers.authorization;
  const userData = await jwt.verify(auth, JWT_SECRET);
  const createdDate = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -5);
  const id = Math.floor(Math.random() * 1000000);

  const { title, subtitle, content } = req.body.data;
  const postData = {
    id,
    user_id: userData.id,
    likes: [],
    fellowers: [],
    view: 0,
    created_dt: createdDate,
    updated_dt: createdDate,
    title,
    subtitle,
    content,
    comments: [],
  };
  const result = await Post.create(postData);
  res.status(200).json({ status: 200, message: 'success', data: result });
}

async function get(req, res) {
  const auth = req.headers.authorization;
  const userData = await jwt.verify(auth, JWT_SECRET);
  const posts = await Post.get(userData.id);
  res.status(200).json({ status: 200, message: 'success', data: posts });
}

async function like(req, res) {
  const postId = +req.params.id;
  const auth = req.headers.authorization;
  const userData = await jwt.verify(auth, JWT_SECRET);
  await Post.like(postId, userData.id);
  const updatedUserData = await User.get(userData.id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  res.status(200).json({ status: 200, message: 'success', data: token });
}

async function fellow(req, res) {
  const postId = +req.params.id;
  const auth = req.headers.authorization;
  const userData = await jwt.verify(auth, JWT_SECRET);
  await Post.fellow(postId, userData.id);
  const updatedUserData = await User.get(userData.id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  res.status(200).json({ status: 200, message: 'success', data: token });
}

module.exports = {
  get, create, like, fellow,
};
