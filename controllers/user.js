require('dotenv').config();
const argon2 = require('argon2');
const JSValidator = require('validator');
const {
  randomId,
  createDate,
  updateImage,
  cancelApply,
} = require('../service/user');
const User = require('../models/user');
const jwt = require('../utils/JWT');
const { s3UserUpload } = require('../utils/aws_s3');

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
  const id = randomId();
  const createdDate = createDate();
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
  let userData = '';
  if (req.body.id) {
    // get other user profile
    userData = await User.get(+req.body.id);
  } else {
    // get Personal profile
    userData = await User.get(req.userData.id);
  }
  return res.status(200).json({ status: 200, message: 'success', data: userData });
}

async function uploadImage(req, res) {
  // Prepare Data
  const { userData } = req;
  const { type } = req.body;
  console.log(type);

  // Upload to S3
  const result = await s3UserUpload(userData.email, req.file);
  const imagePath = result.Key;
  await updateImage[type](userData, imagePath);

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
  // Add apply_friends & pending_friends in applicant's data
  await User.addApplyFriend(userData.id, id);
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

  // Delete pending_friends & apply_friend in data
  await User.deletePendingFriend(userData.id, id);
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

  await cancelApply[action](userData.id, id);

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
  let data;
  if (req.body.id) {
    data = await User.getUserPost(req.body.id);
  } else {
    data = await User.getUserPost(req.userData.id);
  }
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

  try {
    await Promise.all(pendingFriends).then((resolve) => {
      data.pendingFriends = resolve;
    }).catch((err) => console.log(err));

    await Promise.all(friends).then((resolve) => {
      data.friends = resolve;
    }).catch((err) => console.log(err));

    return res.status(200).json({ status: 200, message: 'success', data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, message: 'failed' });
  }
}

async function getCommunity(req, res) {
  const { userData } = req;
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
