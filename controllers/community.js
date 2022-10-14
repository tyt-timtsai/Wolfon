require('dotenv').config();
const User = require('../models/user');
const Community = require('../models/community');
const jwt = require('../utils/JWT');

const { JWT_SECRET } = process.env;

async function get(req, res) {
  let data;
  const keyword = req.query.keyword || null;
  let regex;
  switch (req.params.id) {
    case 'search':
      if (keyword === null) {
        return res.status(404).json({ status: 400, message: 'Missing keyword' });
      }
      regex = new RegExp(`${keyword}`, 'i');
      data = await Community.search(regex);
      break;

    default:
      data = await Community.get(req.params.id);
      break;
  }

  if (!data) {
    return res.status(404).json({ status: 404, message: 'Not found' });
  }

  return res.status(200).json({ status: 200, message: 'success', data });
}

async function create(req, res) {
  const { userData } = req;
  const id = Math.floor(Math.random() * 1000000);
  const createdDate = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -5);
  const { name, isPublic } = req.body;
  const communityData = {
    id,
    name,
    created_dt: createdDate,
    creator: userData.id,
    posts: [],
    admin: [userData.id],
    users: [userData.id],
    applicant: [],
    is_public: isPublic,
  };
  // create community and update user data
  await Community.create(communityData, userData.id);
  const updatedUserData = await User.get(userData.id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
}

async function apply(req, res) {
  const { userData } = req;
  if (!req.params.id) {
    return res.status(404).json({ status: 404, message: 'Not found' });
  }
  await Community.apply(req.params.id, userData.id);
  const updatedUserData = await User.get(userData.id);
  const token = await jwt.sign(updatedUserData, JWT_SECRET);
  return res.status(200).json({ status: 200, message: 'success', data: token });
}

async function confirmApply(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ status: 400, message: 'Missing community id or user id' });
  }

  const { userData } = req;
  const communityData = await Community.get(+id);
  const isAdmin = communityData.admin.some((user) => user === userData.id);

  if (!isAdmin) {
    return res.status(403).json({ status: 403, message: 'Unauthorized' });
  }

  await Community.confirmApply(+id, userData.id);
  const data = await Community.get(+id);

  if (!data) {
    return res.status(404).json({ status: 404, message: 'Not found' });
  }

  return res.status(200).json({ status: 200, message: 'success', data });
}

module.exports = {
  get,
  create,
  apply,
  confirmApply,
};
