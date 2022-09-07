require('dotenv').config();
const Post = require('../models/post');
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
    like: 0,
    view: 0,
    created_dt: createdDate,
    updated_dt: createdDate,
    title,
    subtitle,
    content,
    comments: [],
  };

  const result = await Post.create(postData);

  res.send(result);
}

async function get(req, res) {
  const auth = req.headers.authorization;
  const userData = await jwt.verify(auth, JWT_SECRET);
  const posts = await Post.get(userData.id);
  res.send(posts);
}

module.exports = { get, create };
