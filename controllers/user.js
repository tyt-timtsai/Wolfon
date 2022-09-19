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
    pending_friends: [],
    apply_friends: [],
    fellows: [],
    fellowers: [],
    community: [],
    posts: [],
    like_posts: [],
    fellow_posts: [],
  };
  await User.signUp(userData);
  const token = await jwt.sign(userData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
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
  return res.status(200).json({ status: 200, message: 'success', data: req.userData });
}

async function search(req, res) {
  const { keyword } = req.query;
  const regex = new RegExp(keyword, 'i');
  const data = await User.search(regex);
  return res.status(200).json({ status: 200, message: 'success', data });
}

async function applyFriend(req, res) {
  const { userData } = req;
  // Add apply_friends in applicant's data
  await User.addApplyFriend(userData.id, req.body.id);

  // Add pending_friends in target's data
  await User.addPendingFriend(userData.id, req.body.id);

  const updatedUserData = await User.get(userData.id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
}

async function addFriend(req, res) {
  const { userData } = req;

  // Add friends in user's and applicant's data
  await User.addFriend(userData.id, req.body.id);

  // Delete pending_friends in data
  await User.deletePendingFriend(userData.id, req.body.id);

  // Delete apply_friend in applicant's data
  await User.deleteApplyFriend(req.body.id, userData.id);
  const updatedUserData = await User.get(userData.id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
}

async function deleteFriend(req, res) {
  const { userData } = req;

  // Delete friends in both user's data
  await User.deleteFriend(userData.id, req.body.id);
  const updatedUserData = await User.get(userData.id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
}

async function cancelApplyFriend(req, res) {
  const { userData } = req;

  const { id, action } = req.body;
  switch (action) {
    case 'cancel':
      await User.deleteApplyFriend(userData.id, id);
      await User.deletePendingFriend(userData.id, id);
      break;
    case 'reject':
      await User.deleteApplyFriend(id, userData.id);
      await User.deletePendingFriend(id, userData.id);
      break;

    default:
      console.log('lack of action');
      break;
  }

  const updatedUserData = await User.get(userData.id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
}

async function fellow(req, res) {
  const { userData } = req;

  // Add fellows & Add fellowers to target's data
  await User.addFellow(userData.id, req.body.id);
  const updatedUserData = await User.get(userData.id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
}

async function unfellow(req, res) {
  const { userData } = req;
  // Delete fellows & Delete fellowers to target's data
  await User.deleteFellow(userData.id, req.body.id);
  const updatedUserData = await User.get(userData.id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
}

async function getLive(req, res) {
  const { userData } = req;
  const data = await User.getUserLive(userData.id);
  return res.status(200).json({ status: 200, message: 'success', data });
}

async function getPost(req, res) {
  const { userData } = req;
  const data = await User.getUserPost(userData.id);
  // const data = 'post';
  return res.status(200).json({ status: 200, message: 'success', data });
}

async function getFriend(req, res) {
  const { userData } = req;
  console.log(userData);
  // const data = await User.getUserLive(userData.id);
  const data = 'friend';
  return res.status(200).json({ status: 200, message: 'success', data });
}

async function getCommunity(req, res) {
  const { userData } = req;
  // const data = await User.getUserLive(userData.id);
  const data = 'community';
  return res.status(200).json({ status: 200, message: 'success', data });
}

module.exports = {
  signUp,
  signIn,
  profile,
  search,
  applyFriend,
  addFriend,
  deleteFriend,
  fellow,
  unfellow,
  cancelApplyFriend,
  getLive,
  getPost,
  getFriend,
  getCommunity,
};
