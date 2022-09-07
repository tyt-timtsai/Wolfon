require('dotenv').config();
const argon2 = require('argon2');
const User = require('../models/user');
const jwt = require('../utils/JWT');

const { JWT_SECRET } = process.env;

async function signUp(req, res) {
  const { name, email, password } = req.body.data;
  const exist = await User.signIn(email);
  if (exist != null) {
    return res.status(401).json({ status: 401, message: 'Email is already registed.' });
  }
  const photo = req.body.file;
  const id = Math.floor(Math.random() * 1000000);
  const createdDate = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -5);
  const hash = await argon2.hash(password);
  const userData = {
    id,
    name,
    email,
    password: hash,
    photo,
    created_dt: createdDate,
    friends: [],
    clubs: [],
    posts: [],
    fellowers: [],
  };
  await User.signUp(userData);
  const token = await jwt.sign(userData, JWT_SECRET);
  return res.status(200).send(token);
}

async function signIn(req, res) {
  const { email, password } = req.body.data;
  const userData = await User.signIn(email);
  if (userData == null) {
    return res.status(404).json({ status: 404, message: 'User not found' });
  }
  try {
    if (await argon2.verify(userData.password, password)) {
      const token = await jwt.sign(userData, JWT_SECRET);
      return res.status(200).json({ status: 200, message: 'success', data: token });
    }
    return res.status(403).json({ status: 403, message: 'Wrong password' });
  } catch (error) {
    console.error('sign in decode error : ', error);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
}

async function profile(req, res) {
  const auth = req.headers.authorization;
  if (!auth || auth == null) {
    return res.status(401).json({ status: 401, message: 'No Token' });
  }
  try {
    const decode = await jwt.verify(auth, JWT_SECRET);
    return res.status(200).json({ status: 200, message: 'success', data: decode });
  } catch (error) {
    console.error('User profile error : ', error);
    return res.status(403).json({ status: 403, message: 'Authorization failed' });
  }
}

module.exports = { signUp, signIn, profile };
