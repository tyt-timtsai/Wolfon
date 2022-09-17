require('dotenv').config();
const path = require('path');

// multer
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, `${__dirname}/../public/uploads/lives`);
    // callback(null, '/uploads/lives');
    // callback(null, '/public/uploads/lives');
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
  storage,
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

module.exports = { upload };
