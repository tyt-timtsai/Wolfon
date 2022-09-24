require('dotenv').config();
const path = require('path');
const fs = require('fs');

// multer
const multer = require('multer');

const liveStorage = multer.memoryStorage({
  destination: (req, file, callback) => {
    const imagePath = path.join(__dirname, '../public/uploads/lives');
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath);
    }
    callback(null, imagePath);
  },
  filename: (req, file, callback) => {
    // 設定上傳後檔案名稱
    const fullName = `wolfon_${Date.now()}${path.extname(file.originalname)}`;
    callback(null, fullName);
  },
  limit: {
    // 限制上傳檔案的大小
    fileSize: 10000000,
  },
});

const upload = multer({
  storage: liveStorage,
  fileFilter: (req, file, cb) => {
    // 限制上傳檔案只能傳jpg jpge png
    if (
      file.mimetype === 'image/png'
      || file.mimetype === 'image/jpg'
      || file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      // return cb(new Error('Please upload an image with correct format.'));
    }
  },
});

const userStorage = multer.memoryStorage({
  destination: (req, file, callback) => {
    const { userData } = req;
    const imagePath = path.join(__dirname, `../public/uploads/users/${userData.email}`);
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath);
    }
    callback(null, imagePath);
  },
  filename: (req, file, callback) => {
    // 設定上傳後檔案名稱
    const fullName = `wolfon_${Date.now()}${path.extname(file.originalname)}`;
    callback(null, fullName);
  },
  limit: {
    fileSize: 10000000,
  },
});

const userUpload = multer({
  storage: userStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png'
      || file.mimetype === 'image/jpg'
      || file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      // return cb(new Error('Please upload an image with correct format.'));
    }
  },
});

module.exports = { upload, userUpload };
