require('dotenv').config();
const argon2 = require('argon2');
const JSValidator = require('validator');
const User = require('../models/user');
const Post = require('../models/post');
const Live = require('../models/live');
const jwt = require('../utils/JWT');
const { s3UserUpload, s3DeleteObject } = require('../utils/aws_s3');

const validator = JSValidator.default;
const { JWT_SECRET } = process.env;

async function signUp(req, res) {
  const { name, email, password } = req.body.data;

  // Data Validation
  if (validator.isEmpty(name)) {
    return res.status(400).json({ status: 400, message: '請填寫名字' });
  }
  if (validator.isEmpty(email)) {
    return res.status(400).json({ status: 400, message: '請填寫信箱' });
  }
  if (validator.isEmpty(password)) {
    return res.status(400).json({ status: 400, message: '請填寫密碼' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ status: 400, message: '信箱格式錯誤' });
  }

  // Check Exist
  const exist = await User.signIn(email);
  if (exist != null) {
    return res.status(401).json({ status: 401, message: '信箱已被註冊' });
  }

  // Prepare Data
  const photo = req.body.file || null;
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
    lives: [],
    follows: [],
    followers: [],
    community: [],
    posts: [],
    like_posts: [],
    follow_posts: [],
  };

  // Sign up
  await User.signUp(userData);
  const token = await jwt.sign(userData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
}

async function signIn(req, res) {
  // Prepare Data
  const { email, password } = req.body.data;
  const userData = await User.signIn(email);

  // Data Validation
  if (validator.isEmpty(email)) {
    return res.status(400).json({ status: 400, message: '請填寫信箱' });
  }
  if (validator.isEmpty(password)) {
    return res.status(400).json({ status: 400, message: '請填寫密碼' });
  }
  if (userData == null) {
    return res.status(401).json({ status: 401, message: '信箱尚未註冊' });
  }

  // Sign in
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
  // get other user profile
  if (req.body.id) {
    const userData = await User.get(+req.body.id);
    return res.status(200).json({ status: 200, message: 'success', data: userData });
  }
  const userData = await User.get(req.userData.id);
  // get Personal profile
  return res.status(200).json({ status: 200, message: 'success', data: userData });
}

async function uploadImage(req, res) {
  // Prepare Data
  const { userData } = req;
  const { type } = req.body;

  // Upload to S3
  const result = await s3UserUpload(userData.email, req.file);
  const imagePath = result.Key;
  // Update User Data
  switch (type) {
    case 'background':
      if (userData.background_image) {
        await s3DeleteObject(userData.background_image);
      }
      await User.updateUserBackgroundImage(userData.id, imagePath);
      break;
    case 'avatar':
      if (userData.photo) {
        await s3DeleteObject(userData.photo);
      }
      await User.updateUserAvatar(userData.id, imagePath);
      await Post.updateAuthorAvatar(userData.id, imagePath);
      await Live.updateStreamerAvatar(userData.id, imagePath);
      break;

    default:
      if (userData.photo) {
        await s3DeleteObject(userData.photo);
      }
      await User.updateUserAvatar(userData.id, imagePath);
      await Post.updateAuthorAvatar(userData.id, imagePath);
      await Live.updateStreamerAvatar(userData.id, imagePath);
      break;
  }

  // Update JWT
  const user = await User.get(userData.id);
  const data = await jwt.sign(user, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data });
}

async function search(req, res) {
  const { keyword } = req.query;
  const regex = new RegExp(keyword, 'i');
  const data = await User.search(regex);
  return res.status(200).json({ status: 200, message: 'success', data });
}

async function applyFriend(req, res) {
  // Prepare Data
  const { userData } = req;
  const { id } = req.body;

  // Data Validation
  if (!id) {
    return res.status(400).json({ status: 400, message: 'Miss Data : id' });
  }
  // Add apply_friends in applicant's data
  await User.addApplyFriend(userData.id, id);

  // Add pending_friends in target's data
  await User.addPendingFriend(id, userData.id);

  const updatedUserData = await User.get(userData.id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
}

async function acceptFriend(req, res) {
  // Prepare Data
  const { userData } = req;
  const { id } = req.body;

  // Add friends in user's and applicant's data
  await User.addFriend(userData.id, id);

  // Delete pending_friends in data
  await User.deletePendingFriend(userData.id, id);

  // Delete apply_friend in applicant's data
  await User.deleteApplyFriend(id, userData.id);
  const updatedUserData = await User.get(userData.id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
}

async function deleteFriend(req, res) {
  // Prepare Data
  const { userData } = req;
  const { id } = req.body;

  // Delete friends in both user's data
  await User.deleteFriend(userData.id, id);
  const updatedUserData = await User.get(userData.id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
}

async function cancelApplyFriend(req, res) {
  // Prepare Data
  const { id, action } = req.body;
  const { userData } = req;

  switch (action) {
    case 'cancel':
      await User.deleteApplyFriend(userData.id, id);
      await User.deletePendingFriend(id, userData.id);
      break;
    case 'reject':
      await User.deleteApplyFriend(id, userData.id);
      await User.deletePendingFriend(userData.id, id);
      break;

    default:
      console.log('lack of action');
      break;
  }

  const updatedUserData = await User.get(userData.id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
}

async function follow(req, res) {
  // Prepare Data
  const { userData } = req;
  const { id } = req.body;

  // Add follows & Add followers to target's data
  await User.addFollow(userData.id, id);
  const updatedUserData = await User.get(userData.id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
}

async function unfollow(req, res) {
  // Prepare Data
  const { userData } = req;
  const { id } = req.body;

  await User.deleteFollow(userData.id, id);
  const updatedUserData = await User.get(userData.id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
}

async function getFollow(req, res) {
  let targets;
  const data = {};

  if (req.body.id) {
    const { id } = req.body;
    const user = await User.get(id);
    targets = user.follows;
  } else {
    targets = req.userData.follows;
  }

  const follows = targets.map((target) => User.get(target));
  await Promise.all(follows).then((resolve) => {
    data.follows = resolve;
  }).catch((err) => console.log(err));
  return res.status(200).json({ status: 200, message: 'success', data });
}

async function getFollower(req, res) {
  let targets;
  const data = {};

  if (req.body.id) {
    const { id } = req.body;
    const user = await User.get(id);
    targets = user.followers;
  } else {
    targets = req.userData.followers;
  }

  const followers = targets.map((target) => User.get(target));
  await Promise.all(followers).then((resolve) => {
    data.followers = resolve;
  }).catch((err) => console.log(err));
  return res.status(200).json({ status: 200, message: 'success', data });
}

async function getLive(req, res) {
  let userId;
  if (req.body.id) {
    const { id } = req.body;
    userId = id;
  } else {
    const { id } = req.userData;
    userId = id;
  }
  const data = await User.getUserLive(userId);
  return res.status(200).json({ status: 200, message: 'success', data });
}

async function getPost(req, res) {
  let userId;
  if (req.body.id) {
    const { id } = req.body;
    userId = id;
  } else {
    const { id } = req.userData;
    userId = id;
  }
  const data = await User.getUserPost(userId);
  return res.status(200).json({ status: 200, message: 'success', data });
}

async function getLikePost(req, res) {
  let posts;
  let data;
  if (req.body.id) {
    const { id } = req.body;
    const user = await User.get(id);
    posts = user.like_posts;
  } else {
    posts = req.userData.like_posts;
  }
  const postArray = posts.map((postId) => User.getUserLikePost(postId));
  try {
    data = await Promise.all(postArray);
  } catch (error) {
    console.error('POST | User controller getLikePost : ', error);
  }
  return res.status(200).json({ status: 200, message: 'success', data });
}

async function getFollowPost(req, res) {
  let posts;
  let data;
  if (req.body.id) {
    const { id } = req.body;
    const user = await User.get(id);
    posts = user.follow_posts;
    console.log(posts);
  } else {
    posts = req.userData.follow_posts;
  }
  const postArray = posts.map((postId) => User.getUserFollowPost(postId));
  try {
    data = await Promise.all(postArray);
  } catch (error) {
    console.error('POST | User controller getFollowPost : ', error);
  }
  return res.status(200).json({ status: 200, message: 'success', data });
}

async function getFriend(req, res) {
  const { userData } = req;
  const pendingFriends = [];
  const friends = [];
  const data = {};

  if (userData.pending_friends.length > 0) {
    for (let i = 0; i < userData.pending_friends.length; i += 1) {
      pendingFriends.push(User.get(userData.pending_friends[i]));
    }
  }
  if (userData.friends.length > 0) {
    for (let i = 0; i < userData.friends.length; i += 1) {
      friends.push(User.get(userData.friends[i]));
    }
  }

  await Promise.all(pendingFriends).then((resolve) => {
    data.pendingFriends = resolve;
  }).catch((err) => console.log(err));

  await Promise.all(friends).then((resolve) => {
    data.friends = resolve;
  }).catch((err) => console.log(err));

  console.log(data);

  return res.status(200).json({ status: 200, message: 'success', data });
}

async function getCommunity(req, res) {
  const { userData } = req;
  // const data = await User.getUserLive(userData.id);
  const data = userData;
  return res.status(200).json({ status: 200, message: 'success', data });
}

module.exports = {
  signUp,
  signIn,
  profile,
  uploadImage,
  search,
  applyFriend,
  acceptFriend,
  deleteFriend,
  follow,
  unfollow,
  cancelApplyFriend,
  getLive,
  getPost,
  getLikePost,
  getFollowPost,
  getFriend,
  getFollow,
  getFollower,
  getCommunity,
};
