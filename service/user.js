const User = require('../models/user');
const Post = require('../models/post');
const Live = require('../models/live');
const { s3DeleteObject } = require('../utils/aws_s3');

function randomId() {
  return Math.floor(Math.random() * 1000000);
}

function createDate() {
  return (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -5);
}

const updateImage = {
  async background(userData, imagePath) {
    if (userData.background_image) {
      await s3DeleteObject(userData.background_image);
    }
    await User.updateUserBackgroundImage(userData.id, imagePath);
  },

  async avatar(userData, imagePath) {
    if (userData.photo) {
      await s3DeleteObject(userData.photo);
    }
    await User.updateUserAvatar(userData.id, imagePath);
    await Post.updateAuthorAvatar(userData.id, imagePath);
    await Live.updateStreamerAvatar(userData.id, imagePath);
  },
};

const cancelApply = {
  async cancel(userId, friendId) {
    await User.deleteApplyFriend(userId, friendId);
    await User.deletePendingFriend(friendId, userId);
  },
  async reject(userId, friendId) {
    await User.deleteApplyFriend(friendId, userId);
    await User.deletePendingFriend(userId, friendId);
  },
};

module.exports = {
  randomId,
  createDate,
  updateImage,
  cancelApply,
};
